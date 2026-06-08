/**
 * app/skills/[domainId]/page.js — Domain Detail Page
 * Shows all sections: About, Basics, Mini Project, Code, and Practice Environment.
 */
"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getDomainById } from "@/data/domains";
import { getQuizByDomain } from "@/data/quizData";
import { useApp } from "@/context/AppContext";
import QuizModal from "@/components/quiz/QuizModal";
import VirtualMachine from "@/components/editor/VirtualMachine";
import SkillDeepDiveModal from "@/components/skills/SkillDeepDiveModal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./page.module.css";

// Lazy-load CodeEditor to avoid SSR Monaco issues
const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <div className="spinner" />
      <span>Loading code editor...</span>
    </div>
  ),
});

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "about",    label: "About & Fit",     icon: "📖" },
  { id: "basics",   label: "Basics",          icon: "🧱" },
  { id: "project",  label: "Mini Project",    icon: "🛠️" },
  { id: "code",     label: "Example Code",    icon: "💾" },
  { id: "practice", label: "Practice Studio", icon: "💻" },
];

// ─── Section Components ───────────────────────────────────────────────────────

function AboutSection({ domain, onSkillClick }) {
  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📖</span>
        <h2 className={styles.sectionTitle}>About {domain.name}</h2>
      </div>

      {/* Suitability Analysis */}
      <div className={styles.suitabilityCard}>
        <div className={styles.suitabilityHeader}>
          <span>💡 Career Fit Analysis</span>
        </div>
        <p className={styles.suitabilityText}>{domain.suitability}</p>
      </div>

      <div className={styles.aboutText}>
        {domain.about.split("\n\n").map((para, i) => (
          <p key={i}>{para.trim()}</p>
        ))}
      </div>
      
      <div className={styles.skillChips}>
        <p className={styles.chipsLabel}>Deep Dive into Specialized Skills:</p>
        <div className={styles.chips}>
          {domain.skills.map((skill) => (
            <button 
              key={skill} 
              className={`${styles.chip} ${styles.clickableChip}`}
              onClick={() => onSkillClick(skill)}
              title={`Master ${skill}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapSection({ domain }) {
  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🗺️</span>
        <h2 className={styles.sectionTitle}>Learning Roadmap</h2>
        <p className={styles.sectionSubtitle}>Phase-by-phase professional trajectory</p>
      </div>
      
      <div className={styles.roadmapList}>
        {domain.roadmap && domain.roadmap.map((item, idx) => (
          <div key={idx} className={styles.roadmapItem}>
            <div className={styles.roadmapStep}>
              <div className={styles.roadmapPoint} />
              <div className={styles.roadmapLine} />
              <div className={styles.roadmapLabel}>{item.step}</div>
            </div>
            <div className={styles.roadmapDetail}>{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesSection({ domain }) {
  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🔗</span>
        <h2 className={styles.sectionTitle}>Learning Resources</h2>
        <p className={styles.sectionSubtitle}>Curated external links and suggestions</p>
      </div>
      
      <div className={styles.resourcesGrid}>
        {domain.resources && domain.resources.map((res, idx) => (
          <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className={styles.resourceCard}>
            <div className={styles.resourceType}>{res.type}</div>
            <h3 className={styles.resourceTitle}>{res.title}</h3>
            <div className={styles.resourceLink}>Visit Resource →</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function BasicsSection({ domain, domainId, markTopicComplete, isTopicCompleted, onQuiz }) {
  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🧱</span>
        <h2 className={styles.sectionTitle}>Learning Basics</h2>
        <p className={styles.sectionSubtitle}>Core concepts to get you started</p>
      </div>
      <div className={styles.basicsList}>
        {domain.basics.map((topic, idx) => {
          const done = isTopicCompleted(domainId, idx);
          return (
            <div key={idx} className={`${styles.basicItem} ${done ? styles.basicDone : ""}`}>
              <div className={styles.basicLeft}>
                <div className={`${styles.stepNum} ${done ? styles.stepNumDone : ""}`}>
                  {done ? "✓" : idx + 1}
                </div>
                <span className={styles.basicText}>{topic}</span>
              </div>
              {done ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={styles.completedBadge}>✅ Completed</span>
                  <button
                    className="btn btn-ghost btn--sm"
                    onClick={() => {
                      // Trigger quiz again without marking complete
                      onQuiz();
                    }}
                    title="Retake the quiz for this topic"
                  >
                    ↺ Retake Quiz
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-success btn--sm"
                  onClick={() => {
                    markTopicComplete(domainId, idx);
                    onQuiz();
                  }}
                >
                  Mark Done
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.quizHint}>
        💡 Marking a topic complete triggers a <strong>mini quiz</strong> to reinforce your learning!
      </div>
    </div>
  );
}

function ProjectSection({ domain }) {
  const [showCode, setShowCode] = useState(false);
  const { miniProject } = domain;

  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🛠️</span>
        <h2 className={styles.sectionTitle}>{miniProject.title}</h2>
        <p className={styles.sectionSubtitle}>Hands-on mini project guide</p>
      </div>

      {/* Description */}
      <div className={styles.projectDesc}>
        <p>{miniProject.description}</p>
      </div>

      {/* Step Guide */}
      <h3 className={styles.stepsTitle}>📋 Step-by-Step Guide</h3>
      <div className={styles.steps}>
        {miniProject.steps.map((step, idx) => (
          <div key={idx} className={styles.step}>
            <div className={styles.stepBubble}>{idx + 1}</div>
            <p className={styles.stepText}>{step}</p>
          </div>
        ))}
      </div>
      
      {/* Virtual Machine simulation */}
      <h3 className={styles.stepsTitle} style={{ marginTop: 40 }}>⚡ Virtual Practice Environment</h3>
      <p className={styles.sectionSubtitle} style={{ marginBottom: 20 }}>
        Launch your virtual {domain.name} workstation to practice what you've learned.
      </p>
      <VirtualMachine domain={domain} type={domain.vmType} />

      {/* Code toggle */}
      <button
        className={`btn btn-primary btn--lg ${styles.codeToggleBtn}`}
        onClick={() => setShowCode(!showCode)}
      >
        {showCode ? "⬆️ Hide Code" : "📄 View Example Code"}
      </button>

      {showCode && (
        <div className={`${styles.codeReveal} animate-fadeIn`}>
          <div className="code-block">
            <div className="code-block-header">
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {miniProject.language === "python" ? "🐍 Python" : "⚡ JavaScript"}
              </span>
              <button
                className="btn btn-ghost btn--sm"
                onClick={() => navigator.clipboard?.writeText(miniProject.code)}
              >
                📋 Copy
              </button>
            </div>
            <SyntaxHighlighter
              language={miniProject.language}
              style={vscDarkPlus}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: "20px",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
              showLineNumbers
            >
              {miniProject.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}

function CodeSection({ domain }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(domain.miniProject.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>💾</span>
        <h2 className={styles.sectionTitle}>Example Code</h2>
        <p className={styles.sectionSubtitle}>Complete, annotated code for the mini project</p>
      </div>

      <div className="code-block">
        <div className="code-block-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {domain.miniProject.language === "python" ? "🐍 Python" : "⚡ JavaScript"}
              {" — "}{domain.miniProject.title}
            </span>
          </div>
          <button className="btn btn-ghost btn--sm" onClick={handleCopy}>
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </button>
        </div>
        <SyntaxHighlighter
          language={domain.miniProject.language}
          style={vscDarkPlus}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: "24px",
            fontSize: "13px",
            lineHeight: "1.7",
            maxHeight: "600px",
            overflowY: "auto",
          }}
          showLineNumbers
          wrapLongLines
        >
          {domain.miniProject.code}
        </SyntaxHighlighter>
      </div>

      <div className={styles.codeNote}>
        <span>💡</span>
        <span>
          Go to the <strong>Practice Studio</strong> tab to run this code directly in your browser!
        </span>
      </div>
    </div>
  );
}

function PracticeSection({ domain }) {
  return (
    <div className={`${styles.section} animate-fadeIn`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>💻</span>
        <h2 className={styles.sectionTitle}>Practice Studio</h2>
        <p className={styles.sectionSubtitle}>
          Write, run, and experiment with code directly in your browser
        </p>
      </div>

      <div className={styles.practiceInfo}>
        <div className={styles.practiceFeature}>
          <span>🐍</span><span>Python (Skulpt)</span>
        </div>
        <div className={styles.practiceFeature}>
          <span>⚡</span><span>JavaScript (Dynamic)</span>
        </div>
        <div className={styles.practiceFeature}>
          <span>🌐</span><span>HTML/CSS (Live Preview)</span>
        </div>
        <div className={styles.practiceFeature}>
          <span>🗜️</span><span>C/C++ (Concepts)</span>
        </div>
      </div>

      <CodeEditor
        initialCode={domain.miniProject.code}
        initialLanguage={domain.miniProject.language === "python" ? "python" : "javascript"}
      />

      <div className={styles.practiceHints}>
        <h3>💡 Practice Ideas</h3>
        <ul>
          <li>Modify the code above and re-run it to see changes</li>
          <li>Add error handling to handle edge cases</li>
          <li>Extend the project with one additional feature</li>
          <li>Try rewriting key functions from memory</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function DomainPage({ params }) {
  const { domainId } = use(params);
  const domain = getDomainById(domainId);
  const router = useRouter();

  if (!domain) notFound();

  const { markTopicComplete, isTopicCompleted, getCompletedCount, getSkillProgress } = useApp();
  const [activeTab, setActiveTab] = useState("about");
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedSubSkill, setSelectedSubSkill] = useState(null);

  const quiz = getQuizByDomain(domainId);
  const completedCount = getCompletedCount(domainId);
  const progress = getSkillProgress(domainId);
  const totalTopics = domain.basics.length;

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <Link href="/skills" className={styles.breadcrumbLink}>← All Skills</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{domain.name}</span>
        </div>
      </div>

      {/* Domain Hero */}
      <div className={styles.hero} style={{ "--color": domain.color }}>
        <div
          className={styles.heroGlow}
          style={{ background: `radial-gradient(ellipse, ${domain.color}18 0%, transparent 70%)` }}
        />
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.domainIcon} style={{ borderColor: domain.color + "50" }}>
              {domain.icon}
            </div>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge} style={{ color: domain.color, borderColor: domain.color + "40", background: domain.color + "12" }}>
                ✨ {domain.tagline}
              </div>
              <h1 className={styles.heroTitle}>{domain.name}</h1>
              <p className={styles.heroSubtitle}>
                {domain.tagline} • <span className={styles.heroCategory}>{domain.category} Specialized</span>
              </p>
            </div>

            <div className={styles.heroAnalysis}>
               <div className={styles.analysisLabel}>Professional Fit</div>
               <div className={styles.analysisValue}>{domain.suitability.split(' ').slice(0, 5).join(' ')}...</div>
            </div>

            {/* Progress */}
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <span>Your Progress</span>
                <span style={{ color: domain.color }}>{progress}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%`, background: domain.color }}
                />
              </div>
              <div className={styles.progressStats}>
                <span>{completedCount}/{totalTopics} topics</span>
                {completedCount > 0 && (
                  <span style={{ color: "#34d399" }}>🔥 Keep going!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabsBar}>
        <div className="container">
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { color: domain.color, borderColor: domain.color } : {}}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className={styles.content}>
          {activeTab === "about" && (
            <AboutSection 
              domain={domain} 
              onSkillClick={(skill) => setSelectedSubSkill(skill)} 
            />
          )}
          {activeTab === "basics" && (
            <BasicsSection
              domain={domain}
              domainId={domainId}
              markTopicComplete={markTopicComplete}
              isTopicCompleted={isTopicCompleted}
              onQuiz={() => setShowQuiz(true)}
            />
          )}
          {activeTab === "project" && <ProjectSection domain={domain} />}
          {activeTab === "code" && <CodeSection domain={domain} />}
          {activeTab === "practice" && <PracticeSection domain={domain} />}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          quiz={quiz}
          domainName={domain.name}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Sub Skill Deep Dive Modal */}
      {selectedSubSkill && (
        <SkillDeepDiveModal
          skillId={selectedSubSkill}
          onClose={() => setSelectedSubSkill(null)}
        />
      )}
    </div>
  );
}
