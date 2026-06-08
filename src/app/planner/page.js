/**
 * app/planner/page.js — AI Study Planner (ChatGPT / Gemini style)
 */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { generateAIResponse } from "@/lib/studyPlanAI";
import styles from "./page.module.css";

// ─── Markdown renderer ──────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";

  if (typeof text !== "string") {
    text = text.content || JSON.stringify(text);
  }

  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/\n/g, "<br>");
}

// ─── Quiz Component ─────────────────────────────────────────────────────────
function QuizBlock({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const score = submitted
    ? quiz.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className={styles.quizBlock}>
      <div className={styles.quizHeader}>
        🧪 <strong>Quick Quiz</strong>
        {submitted && (
          <span className={styles.quizScore}>
            {score}/{quiz.length} correct {score === quiz.length ? "🎉" : ""}
          </span>
        )}
      </div>
      {quiz.map((q, qi) => (
        <div key={qi} className={styles.quizQ}>
          <p className={styles.quizQuestion}>{qi + 1}. {q.q}</p>
          <div className={styles.quizOptions}>
            {q.options.map((opt, oi) => {
              let cls = styles.quizOpt;
              if (submitted) {
                if (oi === q.answer) cls = `${styles.quizOpt} ${styles.quizCorrect}`;
                else if (answers[qi] === oi) cls = `${styles.quizOpt} ${styles.quizWrong}`;
              } else if (answers[qi] === oi) {
                cls = `${styles.quizOpt} ${styles.quizSelected}`;
              }
              return (
                <button
                  key={oi}
                  className={cls}
                  onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                  disabled={submitted}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted && Object.keys(answers).length === quiz.length && (
        <button className={styles.submitQuiz} onClick={() => setSubmitted(true)}>
          Submit Quiz ✓
        </button>
      )}
      {submitted && (
        <button className={styles.submitQuiz} onClick={() => { setAnswers({}); setSubmitted(false); }}>
          Retry 🔄
        </button>
      )}
    </div>
  );
}

// ─── Day-by-Day Plan Card ───────────────────────────────────────────────────
function StudyPlanCard({ planData, onAddToTaskManager }) {
  const [added, setAdded] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0); // first day open by default
  const [showQuiz, setShowQuiz] = useState({});

  if (!planData || !planData.days || !planData.days.length) return null;

  const handleAdd = () => {
    onAddToTaskManager(planData);
    setAdded(true);
  };

  const toggleDay = (i) => setExpandedDay(expandedDay === i ? null : i);
  const toggleQuiz = (i) =>
    setShowQuiz(prev => ({ ...prev, [i]: !prev[i] }));

  const MAX_VISIBLE = 30;
  const visibleDays = planData.days.slice(0, MAX_VISIBLE);
  const remaining = planData.days.length - visibleDays.length;


  return (
    <div className={styles.planCard}>
      {/* Header */}
      <div className={styles.planCardHeader}>
        <div className={styles.planCardMeta}>
          <span className={styles.planChip}>📚 Study Plan</span>
          <span className={styles.planChip}>{planData.days.length} days</span>
          <span className={styles.planChip}>⏱️ ~1-2 hrs/day</span>
        </div>
        <h3 className={styles.planCardTitle}>{planData.subject}</h3>
        <p className={styles.planCardDesc}>
          Day-by-day roadmap with resources & quizzes. Click any day to expand. Add to Task Manager when ready!
        </p>
      </div>

      {/* Day list */}
      <div className={styles.planDayList}>
        {visibleDays.map((d, i) => (
          <div key={i} className={styles.planDayItem}>
            {/* Day toggle row */}
            <button className={styles.planDayToggle} onClick={() => toggleDay(i)}>
              <span className={styles.dayBadge}>Day {d.day}</span>
              <span className={styles.planDayLabel}>{d.topic}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: expandedDay === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Expanded day content */}
            {expandedDay === i && (
              <div className={styles.dayDetail}>
                {d.description && (
                  <p className={styles.dayDesc}>{d.description}</p>
                )}
                <div className={styles.dayLinks}>
                  {d.docUrl && (
                    <a href={d.docUrl} target="_blank" rel="noreferrer" className={`${styles.dayLink} ${styles.docLink}`}>
                      📖 {d.docLabel || "Read Docs"}
                    </a>
                  )}
                  {d.videoUrl && (
                    <a href={d.videoUrl} target="_blank" rel="noreferrer" className={`${styles.dayLink} ${styles.videoLink}`}>
                      ▶️ {d.videoLabel || "Watch Video"}
                    </a>
                  )}
                  {d.practiceUrl && (
                    <a href={d.practiceUrl} target="_blank" rel="noreferrer" className={`${styles.dayLink} ${styles.practiceLink}`}>
                      💻 Practice
                    </a>
                  )}
                </div>

                {/* Quiz toggle */}
                {d.quiz && d.quiz.length > 0 && (
                  <>
                    <button
                      className={styles.quizToggleBtn}
                      onClick={() => toggleQuiz(i)}
                    >
                      {showQuiz[i] ? "Hide Quiz ▲" : "🧪 Take Quiz for This Topic"}
                    </button>
                    {showQuiz[i] && <QuizBlock quiz={d.quiz} />}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {remaining > 0 && (
          <p className={styles.planMoreNote}>
            +{remaining} more days in full plan — all {planData.days.length} days added to Task Manager 📋
          </p>
        )}

      </div>

      {/* Footer */}
      <div className={styles.planCardFooter}>
        {added ? (
          <div className={styles.addedBadge}>
            ✅ Added to Task Manager!
            <Link href="/tasks" className={styles.viewLink}>View Tasks →</Link>
          </div>
        ) : (
          <button className={styles.addPlanBtn} onClick={handleAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to My Task Manager
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ChatMessage ────────────────────────────────────────────────────────────
function ChatMessage({ message, onAddToTaskManager }) {
  const isUser = message.role === "user";
  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.aiMessage}`}>
      {!isUser && (
        <div className={styles.aiAvatar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
        {isUser ? (
          <p className={styles.userText}>{message.content}</p>
        ) : (
          <>
            <div className={styles.aiText}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
            {message.planData && (
              <StudyPlanCard planData={message.planData} onAddToTaskManager={onAddToTaskManager} />
            )}
          </>
        )}
        <div
          className={styles.messageTime}
          suppressHydrationWarning
        >
          {new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className={`${styles.message} ${styles.aiMessage}`}>
      <div className={styles.aiAvatar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <div className={`${styles.bubble} ${styles.aiBubble}`}>
        <div className={styles.typingDots}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

// ─── Welcome Screen ─────────────────────────────────────────────────────────
const STARTERS = [
  { icon: "🐍", label: "Python — 30 days",       msg: "Create a 30-day Python learning plan" },
  { icon: "⚡", label: "JavaScript — 4 weeks",   msg: "Create a 30-day JavaScript learning plan" },
  { icon: "🤖", label: "Machine Learning — 60 days", msg: "Create a 60-day Machine Learning plan" },
  { icon: "🔒", label: "Cybersecurity — 45 days", msg: "Create a 45-day Cybersecurity plan" },
];

function WelcomeScreen({ onSelect }) {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeIcon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <h2 className={styles.welcomeTitle}>AI Study Planner</h2>
      <p className={styles.welcomeSubtitle}>
        Tell me what you want to learn — I&apos;ll build a day-by-day plan with video lectures, docs &amp; quizzes. Or just chat! 😄
      </p>
      <div className={styles.starterGrid}>
        {STARTERS.map((s, i) => (
          <button key={i} className={styles.starterBtn} onClick={() => onSelect(s.msg)}>
            <span className={styles.starterIcon}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const { chatMessages, addChatMessage, clearChat, addStudyPlan, aiConfig, setAiConfig } = useApp();
  const [input, setInput]               = useState("");
  const [isTyping, setIsTyping]         = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey]           = useState(aiConfig?.apiKey || "");

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    addChatMessage({ role: "user", content: messageText });
    setIsTyping(true);
    try {
      const response = await generateAIResponse(messageText, aiConfig);
      addChatMessage({ role: "assistant", content: response.content, planData: response.planData });
    } catch {
      addChatMessage({ role: "assistant", content: "Oops! Something broke on my end 😅 Try again?" });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const hasMessages = chatMessages.length > 0;

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </Link>
          <div className={styles.topbarTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI Study Planner
          </div>
        </div>
        <div className={styles.topbarRight}>
          {hasMessages && (
            <button className={styles.iconBtn} onClick={clearChat}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Chat
            </button>
          )}
          <button className={styles.iconBtn} onClick={() => setShowSettings(!showSettings)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </button>
          <Link href="/tasks" className={styles.iconBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Tasks
          </Link>
        </div>
      </header>

      {/* Settings bar */}
      {showSettings && (
        <div className={styles.settingsBar}>
          <div className={styles.settingsInner}>
            <div className={styles.settingsLabel}>🔑 Gemini API Key</div>
            <input type="password" className={styles.settingsInput} placeholder="AIza..."
              value={tempKey} onChange={(e) => setTempKey(e.target.value)} />
            <button className={styles.saveKeyBtn}
              onClick={() => { setAiConfig({ ...aiConfig, apiKey: tempKey }); setShowSettings(false); }}>
              Save
            </button>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className={styles.getKeyLink}>
              Get free key →
            </a>
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className={styles.chatWindow}>
        <div className={styles.messageList}>
          {!hasMessages ? (
            <WelcomeScreen onSelect={(msg) => { setInput(msg); textareaRef.current?.focus(); }} />
          ) : (
            chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg}
                onAddToTaskManager={(pd) => addStudyPlan(pd)} />
            ))
          )}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputBox}>
            <textarea ref={textareaRef} className={styles.chatInput}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder='Ask me anything — "30-day Python plan", "What is recursion?", "thinnava?" 😄'
              rows={1}
              disabled={isTyping} />
            <button
              className={`${styles.sendBtn} ${(!input.trim() || isTyping) ? styles.sendDisabled : ""}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? <div className={styles.spinner} /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <p className={styles.inputHint}>
            <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
