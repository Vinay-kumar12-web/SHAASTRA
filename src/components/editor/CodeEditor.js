/**
 * CodeEditor.js
 * Virtual coding environment using Monaco Editor.
 * Supports Python (Skulpt), JavaScript, and displays output.
 */
"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./CodeEditor.module.css";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ─── Language Runtimes ────────────────────────────────────────────────────────

/**
 * Executes JavaScript code safely using Function constructor.
 * Captures console.log output.
 */
function runJavaScript(code) {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  try {
    console.log = (...args) => logs.push(args.map(String).join(" "));
    console.error = (...args) => logs.push("ERROR: " + args.map(String).join(" "));
    console.warn = (...args) => logs.push("WARN: " + args.map(String).join(" "));

    // Wrap in async function to support await
    const fn = new Function(code);
    fn();

    return { output: logs.join("\n") || "(No output)", error: null };
  } catch (err) {
    return { output: logs.join("\n"), error: err.message };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}

/**
 * Runs Python code using Skulpt (in-browser Python interpreter).
 * Skulpt is loaded via CDN on the fly.
 */
function runPython(code, setOutput) {
  return new Promise((resolve) => {
    // Check if Skulpt is loaded
    if (typeof window === "undefined" || !window.Sk) {
      // Load Skulpt dynamically
      const script1 = document.createElement("script");
      script1.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";
      document.head.appendChild(script1);

      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";
        document.head.appendChild(script2);
        script2.onload = () => executePython(code, setOutput, resolve);
      };
    } else {
      executePython(code, setOutput, resolve);
    }
  });
}

function executePython(code, setOutput, resolve) {
  let outputBuffer = "";

  window.Sk.configure({
    output: (text) => {
      outputBuffer += text;
      setOutput((prev) => prev + text);
    },
    read: (x) => {
      if (window.Sk.builtinFiles?.files?.[x] === undefined)
        throw new Error("File not found: '" + x + "'");
      return window.Sk.builtinFiles.files[x];
    },
    execLimit: 10000,
  });

  window.Sk.misceval
    .asyncToPromise(() => window.Sk.importMainWithBody("<stdin>", false, code, true))
    .then(() => resolve({ error: null }))
    .catch((err) => {
      const errorMsg = err.toString();
      setOutput((prev) => prev + "\n❌ " + errorMsg);
      resolve({ error: errorMsg });
    });
}

// ─── Language Definitions ─────────────────────────────────────────────────────
const LANGUAGES = [
  { id: "python", label: "Python", monacoLang: "python", icon: "🐍" },
  { id: "javascript", label: "JavaScript", monacoLang: "javascript", icon: "⚡" },
  { id: "html", label: "HTML/CSS", monacoLang: "html", icon: "🌐" },
  { id: "cpp", label: "C++", monacoLang: "cpp", icon: "⚙️" },
  { id: "c", label: "C Language", monacoLang: "c", icon: "🗜️" },
];

const STARTER_CODE = {
  python: `# 🐍 Python Sandbox
# Write your code here and click Run!

def greet(name):
    return f"Hello, {name}! Welcome to Learnify 🚀"

message = greet("Learner")
print(message)

# Try a simple calculation
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum of {numbers} = {total}")
`,
  javascript: `// ⚡ JavaScript Sandbox
// Write your code here and click Run!

function greet(name) {
  return \`Hello, \${name}! Welcome to Learnify 🚀\`;
}

const message = greet("Learner");
console.log(message);

// Try some array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));
`,
  html: `<!-- 🌐 HTML/CSS Sandbox -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; text-align: center; background: #0f172a; color: white; padding: 20px; }
    .card { background: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155; }
    h1 { color: #818cf8; }
    button { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello Web 🚀</h1>
    <p>Edit this HTML/CSS and click Run to see the live preview!</p>
    <button onclick="alert('Success!')">Interact Me</button>
  </div>
</body>
</html>
`,
  cpp: `// ⚙️ C++ Code (Display Only)
#include <iostream>

int main() {
    std::cout << "Hello C++ 🚀" << std::endl;
    return 0;
}
`,
  c: `// 🗜️ C Code (Display Only)
#include <stdio.h>

int main() {
    printf("Hello C Language 🚀\\n");
    return 0;
}
`,
};

// ─── CodeEditor Component ─────────────────────────────────────────────────────
export default function CodeEditor({ initialCode, initialLanguage = "python" }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || STARTER_CODE[initialLanguage]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setOutput("");
    setHasRun(false);
  };

  const runCode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("");
    setHasRun(true);

    try {
      if (language === "javascript") {
        const { output: out, error } = runJavaScript(code);
        setOutput(error ? `❌ Error: ${error}\n\n${out}` : out || "(No console output)");
      } else if (language === "python") {
        await runPython(code, setOutput);
      } else if (language === "html") {
        setOutput("✅ HTML Preview rendering in the output panel...");
      } else {
        setOutput(
          `ℹ️  ${language === 'c' ? 'C' : 'C++'} requires a backend compiler.\n\n` +
          "For local execution:\n" +
          `  1. Install ${language === 'c' ? 'gcc' : 'g++'} or clang\n` +
          `  2. Save code as 'main.${language === 'c' ? 'c' : 'cpp'}'\n` +
          `  3. Run: ${language === 'c' ? 'gcc main.c' : 'g++ main.cpp'} -o main && ./main\n\n` +
          "Or use: repl.it, onlinegdb.com"
        );
      }
    } finally {
      setIsRunning(false);
    }
  }, [code, language, isRunning]);

  const clearOutput = () => { setOutput(""); setHasRun(false); };
  const resetCode = () => { setCode(STARTER_CODE[language]); setOutput(""); setHasRun(false); };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.langTabs}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              className={`${styles.langTab} ${language === lang.id ? styles.activeLang : ""}`}
              onClick={() => handleLanguageChange(lang.id)}
            >
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.controls}>
          <button className="btn btn-ghost btn--sm" onClick={resetCode} title="Reset code">
            ↺ Reset
          </button>
          <button
            className="btn btn-primary btn--sm"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <><div className="spinner" style={{ width: 14, height: 14 }} /> Running...</>
            ) : (
              <>▶ Run Code</>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className={styles.editorWrapper}>
        <MonacoEditor
          height="360px"
          language={LANGUAGES.find((l) => l.id === language)?.monacoLang || "python"}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            bracketPairColorization: { enabled: true },
            formatOnType: true,
          }}
        />
      </div>

      {/* Output Panel */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>
          <div className={styles.outputTitle}>
            <span>💻</span>
            <span>Output</span>
            {isRunning && <div className="spinner" style={{ width: 12, height: 12 }} />}
          </div>
          {hasRun && (
            <button className="btn btn-ghost btn--sm" onClick={clearOutput}>
              Clear
            </button>
          )}
        </div>
        <pre className={styles.outputContent}>
          {isRunning ? (
            <span className={styles.runningText}>⏳ Executing code...</span>
          ) : language === "html" && hasRun ? (
            <iframe
              srcDoc={code}
              title="HTML Preview"
              style={{ width: "100%", height: "260px", background: "white", border: "none", borderRadius: "8px" }}
              sandbox="allow-scripts"
            />
          ) : output ? (
            output
          ) : (
            <span className={styles.placeholder}>
              Click "▶ Run Code" to see output here...
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
