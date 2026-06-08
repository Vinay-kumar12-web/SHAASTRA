/**
 * SkillDeepDiveModal.js
 * An interactive reader and quiz platform for specific skills.
 */
"use client";

import { useState } from "react";
import styles from "./SkillDeepDive.module.css";
import QuizModal from "@/components/quiz/QuizModal";
import { subSkillContent } from "@/data/skillContent";

export default function SkillDeepDiveModal({ skillId, onClose }) {
  // Normalize ID (e.g. "JavaScript" -> "javascript")
  const id = skillId?.toLowerCase();
  const skillData = subSkillContent[id] || {
    name: skillId,
    icon: "💡",
    levels: [
      {
        title: "Introduction",
        topics: [
          {
            id: "placeholder",
            title: "Getting Started",
            readingTime: "3 min",
            content: `### Understanding ${skillId}\n\nThis content is currently being prepared for you! Check back soon for basic to advanced mastery tracks for ${skillId}.`,
            quiz: {
              title: `${skillId} Intro Quiz`,
              questions: [
                { id:1, question: `Is ${skillId} a valuable skill?`, options: ["Yes", "No", "Maybe", "I don't know"], answer: 0, explanation: "All skills on Learnify are highly valuable for your career!" }
              ]
            }
          }
        ]
      }
    ]
  };

  const [activeTopic, setActiveTopic] = useState(skillData.levels[0].topics[0]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [view, setView] = useState("intro"); // "intro" or "reader"

  const renderIntro = () => (
    <div className={`${styles.introView} animate-fadeIn`}>
      <div className={styles.introContent}>
        <div className={styles.introLeft}>
          <div className={styles.introDescription}>
             <h2 className={styles.introHeader}>The Path to {skillData.name} Mastery</h2>
             <div className={styles.descriptionText}>
                {(skillData.description || `### Introduction to ${skillData.name}\n\nThis path provides a comprehensive professional trajectory for mastering ${skillData.name}. Throughout this curriculum, you will transition from foundational concepts to advanced systems architecture.\n\n${skillId} is more than just a tool; it is a critical skill set in the modern digital economy. Mastering it requires persistence, logic, and creative problem-solving. This platform is designed to guide you through every milestone.`).split("\n\n").map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
             </div>
          </div>
        </div>

        <div className={styles.introRight}>
          <div className={styles.roadmapCard}>
             <h3 className={styles.roadmapTitle}>📍 Mastery Roadmap</h3>
             <div className={styles.diagRoadmap}>
                {(skillData.roadmap || [
                  { step: "Step 1: Core Paradigms", detail: `What is ${skillData.name}? Architecture & Use Cases.` },
                  { step: "Step 2: Environment Config", detail: `Installation, CLIs, and Tooling setup.` },
                  { step: "Step 3: Syntax & Types", detail: `Primitive structures and data encapsulation.` },
                  { step: "Step 4: Control Flow", detail: `Conditional logic and execution divergence.` },
                  { step: "Step 5: Iteration", detail: `Looping mechanisms and bulk data processing.` },
                  { step: "Step 6: Data Structures", detail: `Arrays, Lists, Maps, and memory properties.` },
                  { step: "Step 7: Function Definitions", detail: `Methods, scope, and parameterization.` },
                  { step: "Step 8: File/Memory I/O", detail: `Reading and writing external state.` },
                  { step: "Step 9: Error Handling", detail: `Try/catch blocks and system resilience.` },
                  { step: "Step 10: Modules", detail: `Code splitting, imports, and exports.` },
                  { step: "Step 11: Package Managers", detail: `Third-party libraries and dependency resolution.` },
                  { step: "Step 12: Object-Oriented Principles", detail: `Classes, instances, and inheritance.` },
                  { step: "Step 13: Functional Programming", detail: `Immutability, pure functions, and higher-order logic.` },
                  { step: "Step 14: Asynchronous Activity", detail: `Non-blocking code and event handling.` },
                  { step: "Step 15: APIs & Networking", detail: `Connecting ${skillData.name} to the web (REST/GraphQL).` },
                  { step: "Step 16: Security Principles", detail: `Data validation, sanitization, and auth hooks.` },
                  { step: "Step 17: Database Integration", detail: `Connecting logic to persistence layers (SQL/NoSQL).` },
                  { step: "Step 18: Testing", detail: `Unit testing, mocks, and integration pipelines.` },
                  { step: "Step 19: Build Strategies", detail: `Compiling, minification, and bundling.` },
                  { step: "Step 20: CI/CD Pipelines", detail: `Automated integration and testing workflows.` },
                  { step: "Step 21: Containerization", detail: `Dockerizing ${skillData.name} for isolated execution.` },
                  { step: "Step 22: Deployment", detail: `Cloud hosting, scaling, and production environments.` }
                ]).map((item, idx) => (
                  <div key={idx} className={styles.diagItem}>
                    <div className={styles.diagPoint} />
                    <div className={styles.diagLine} />
                    <div className={styles.diagLabel}>
                      <strong>{item.step}</strong>
                      <span>{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          <div className={styles.roadmapCard}>
             <h3 className={styles.roadmapTitle}>🔗 Recommended Resources</h3>
             <div className={styles.resourcesList}>
                {(skillData.resources || [
                  { title: `${skillData.name} Official Docs`, url: `https://www.google.com/search?q=${encodeURIComponent(skillData.name)}+official+documentation`, type: "Docs" },
                  { title: `Learn ${skillData.name} in 100 Seconds`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillData.name)}+in+100+seconds`, type: "Video" },
                  { title: `${skillData.name} Interactive Tutorial`, url: `https://www.google.com/search?q=${encodeURIComponent(skillData.name)}+interactive+tutorial`, type: "Practice" }
                ]).map((res, idx) => (
                  <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className={styles.skillResourceCard}>
                     <span className={styles.skillResourceType}>{res.type}</span>
                     <strong className={styles.skillResourceTitle}>{res.title}</strong>
                  </a>
                ))}
             </div>
          </div>

          <div className={styles.actionCard}>
            <h3>Ready to master {skillData.name}?</h3>
            <p>Jump straight into a complete, full-length video course engineered to kickstart your journey.</p>
            <button 
              className="btn btn-primary btn--lg" 
              style={{ width: '100%' }}
              onClick={() => {
                const bestVideos = {
                  "python": "https://www.youtube.com/watch?v=kqtD5dpn9C8", // Programming with Mosh
                  "javascript": "https://www.youtube.com/watch?v=jS4aFq5-91M", // FreeCodeCamp
                  "react": "https://www.youtube.com/watch?v=bMknfKXIFA8", // FreeCodeCamp 
                  "node.js": "https://www.youtube.com/watch?v=Oe421EPjeBE", // FreeCodeCamp
                  "sql": "https://www.youtube.com/watch?v=HXV3zeJZ1EQ", // FreeCodeCamp
                  "docker": "https://www.youtube.com/watch?v=gAkwW2tuIqE", // FreeCodeCamp
                  "figma": "https://www.youtube.com/watch?v=jwNmEqJ05C4", // FreeCodeCamp
                  "aws": "https://www.youtube.com/watch?v=k1RI5locZE4", // FreeCodeCamp
                  "html": "https://www.youtube.com/watch?v=qz0aGYrrlhU", // Programming with Mosh
                  "css": "https://www.youtube.com/watch?v=1Rs2ND1ryYc", // FreeCodeCamp
                  "typescript": "https://www.youtube.com/watch?v=BwuLxPH8IDs", // FreeCodeCamp
                  "c++": "https://www.youtube.com/watch?v=8jLOx1hD3_o", // FreeCodeCamp
                  "java": "https://www.youtube.com/watch?v=eIrMbAQSU34", // Programming with Mosh
                  "linux": "https://www.youtube.com/watch?v=v_1qaQuSpgE", // FreeCodeCamp
                  "cybersecurity": "https://www.youtube.com/watch?v=U_P23SqJaDc", // FreeCodeCamp
                  "blockchain": "https://www.youtube.com/watch?v=yWjvB7m9uK0", // FreeCodeCamp
                  "machine learning": "https://www.youtube.com/watch?v=GwIoAwNZlzM" // FreeCodeCamp
                };

                const mappedVideo = bestVideos[skillId?.toLowerCase()] || (skillData.name && bestVideos[skillData.name?.toLowerCase()]);
                const videoResource = skillData.resources?.find(r => r.type === "Video" || r.type === "Course");
                
                // If mapped globally found -> use it. Else check skillData resource -> else execute DuckDuckGo auto-redirect (I'm Feeling Lucky for YouTube)
                const targetUrl = mappedVideo 
                  || (videoResource ? videoResource.url : null) 
                  || `https://duckduckgo.com/?q=%5Csite%3Ayoutube.com+${encodeURIComponent(skillData.name)}+full+course+for+beginners`;
                
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Watch Full Course 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReader = () => (
    <div className={`${styles.content} animate-fadeIn`}>
      <aside className={styles.sidebar}>
        {skillData.levels.map((level, lIdx) => (
          <div key={lIdx} className={styles.levelGroup}>
            <h3 className={styles.levelTitle}>{level.title}</h3>
            {level.topics.map((topic) => (
              <button
                key={topic.id}
                className={`${styles.topicItem} ${activeTopic.id === topic.id ? styles.activeTopic : ""}`}
                onClick={() => setActiveTopic(topic)}
              >
                <div className={styles.topicStatus} />
                {topic.title}
              </button>
            ))}
          </div>
        ))}

        <button className={styles.backToIntro} onClick={() => setView("intro")}>
           ← Back to Skill Overview
        </button>
      </aside>

      <main className={styles.reader}>
        <div className={styles.topicHeader}>
          <h1 className={styles.topicSubject}>{activeTopic.title}</h1>
          <div className={styles.readingTime}>
            <span>⏱️ {activeTopic.readingTime} read</span>
            <span>•</span>
            <span>Unlocked Concept</span>
          </div>
        </div>

        <div className={styles.article}>
          {activeTopic.content.split("\n").map((line, i) => {
            if (line.startsWith("####")) return <h4 key={i}>{line.replace(/#/g, "").trim()}</h4>;
            if (line.startsWith("###")) return <h3 key={i}>{line.replace(/#/g, "").trim()}</h3>;
            if (line.startsWith("*")) return <li key={i}>{line.replace("*", "").trim()}</li>;
            if (line.trim().startsWith("```")) return null;
            if (line.trim().length === 0) return <br key={i} />;
            
            if (line.trim().startsWith("age =") || line.trim().startsWith("print(") || line.trim().startsWith("class ")) {
               return <div key={i} className={styles.codeBox}>{line}</div>
            }

            return <p key={i}>{line}</p>;
          })}
        </div>

        <div className={styles.readerFooter}>
          <div className={styles.quizPromo}>
            <h3>Ready to test your knowledge?</h3>
            <p>Complete the {activeTopic.title} quiz to earn mastery points for this track.</p>
            <button className="btn btn-primary btn--lg" onClick={() => setShowQuiz(true)}>
              Attempt Quiz 🎉
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${view === 'intro' ? styles.modalIntro : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.icon}>{skillData.icon}</div>
            <div>
              <h2 className={styles.title}>{skillData.name}</h2>
              <span className={styles.badge}>{view === 'intro' ? "Skill Overview" : "Learning Track"}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {view === 'intro' ? renderIntro() : renderReader()}
      </div>

      {showQuiz && (
        <QuizModal
          quiz={activeTopic.quiz}
          domainName={skillData.name}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}
