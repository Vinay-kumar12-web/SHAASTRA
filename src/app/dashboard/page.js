/**
 * app/dashboard/page.js — Progress Dashboard
 * Shows overall learning stats, skill progress, and topic completion.
 */
"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { domains } from "@/data/domains";
import styles from "./page.module.css";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }) {
  return (
    <div className={styles.statCard} style={{ "--card-color": color }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue} style={{ color }}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

// ─── Domain Progress Row ──────────────────────────────────────────────────────
function DomainRow({ domain, progress, completed, total }) {
  const isStarted = progress > 0;
  return (
    <Link
      href={`/skills/${domain.id}`}
      className={`${styles.domainRow} ${isStarted ? styles.domainStarted : ""}`}
    >
      <div className={styles.domainLeft}>
        <span className={styles.domainIcon}>{domain.icon}</span>
        <div>
          <div className={styles.domainName}>{domain.name}</div>
          <div className={styles.domainStat}>
            {isStarted
              ? `${completed}/${total} topics complete`
              : "Not started yet"}
          </div>
        </div>
      </div>
      <div className={styles.domainRight}>
        <div className={styles.barContainer}>
          <div
            className={styles.barFill}
            style={{
              width: `${progress}%`,
              background: domain.color,
              boxShadow: isStarted ? `0 0 8px ${domain.color}60` : "none",
            }}
          />
        </div>
        <div
          className={styles.domainPct}
          style={{ color: isStarted ? domain.color : "var(--text-muted)" }}
        >
          {progress}%
        </div>
        <span className={styles.arrowLink} style={{ color: domain.color }}>→</span>
      </div>
    </Link>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { completedTopics, skillProgress, getTotalCompleted, resetProgress } = useApp();
  const totalCompleted = getTotalCompleted();
  const activeDomains = Object.keys(skillProgress).filter((k) => skillProgress[k] > 0).length;
  const totalTopics = domains.reduce((acc, d) => acc + d.basics.length, 0);
  const overallPercent = Math.round((totalCompleted / totalTopics) * 100);

  // Sort domains: started ones first, then by progress
  const sortedDomains = [...domains].sort((a, b) => {
    const pa = skillProgress[a.id] || 0;
    const pb = skillProgress[b.id] || 0;
    return pb - pa;
  });

  const completedDomains = domains.filter((d) => (skillProgress[d.id] || 0) >= 100).length;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className="section-tag">📊 Dashboard</p>
            <h1 className={styles.title}>Learning Progress</h1>
            <p className={styles.subtitle}>
              Track your skill development and completed topics
            </p>
          </div>
          <div className={styles.headerActions}>
            {totalCompleted > 0 && (
              <button
                className="btn btn-ghost btn--sm"
                onClick={() => {
                  if (confirm("Reset all progress? This cannot be undone.")) resetProgress();
                }}
              >
                🔄 Reset Progress
              </button>
            )}
            <Link href="/skills" className="btn btn-primary">
              + Explore Skills
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={styles.statsGrid}>
          <StatCard
            icon="✅"
            value={totalCompleted}
            label="Topics Completed"
            color="#10b981"
          />
          <StatCard
            icon="🎯"
            value={activeDomains}
            label="Active Domains"
            color="#6366f1"
          />
          <StatCard
            icon="🏆"
            value={completedDomains}
            label="Mastered Skills"
            color="#f59e0b"
          />
          <StatCard
            icon="📈"
            value={`${overallPercent}%`}
            label="Overall Progress"
            color="#06b6d4"
          />
        </div>

        {/* Overall Progress Bar */}
        <div className={styles.overallSection}>
          <div className={styles.overallHeader}>
            <h2 className={styles.overallTitle}>Platform Progress</h2>
            <span className={styles.overallPercent}>{totalCompleted}/{totalTopics} topics</span>
          </div>
          <div className={styles.overallBar}>
            <div
              className={styles.overallFill}
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          {totalCompleted === 0 && (
            <p className={styles.emptyHint}>
              👉 Start learning in{" "}
              <Link href="/skills" className={styles.linkBlue}>Explore Skills</Link>{" "}
              and mark topics complete to track progress here!
            </p>
          )}
        </div>

        {/* Two-column layout */}
        <div className={styles.mainGrid}>
          {/* Domain Progress */}
          <div className={styles.mainCard}>
            <h2 className={styles.cardTitle}>📚 Skill Domains</h2>
            <div className={styles.domainList}>
              {sortedDomains.map((domain) => {
                const progress = skillProgress[domain.id] || 0;
                const completed = Object.keys(completedTopics).filter(
                  (k) => k.startsWith(domain.id + "_")
                ).length;
                return (
                  <DomainRow
                    key={domain.id}
                    domain={domain}
                    progress={progress}
                    completed={completed}
                    total={domain.basics.length}
                  />
                );
              })}
            </div>
          </div>

          {/* Activity & Breakdown */}
          <div className={styles.sideColumn}>
            {/* Completed Topics Breakdown */}
            <div className={styles.mainCard}>
              <h2 className={styles.cardTitle}>✅ Completed Topics</h2>
              {totalCompleted === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📋</span>
                  <p>No topics completed yet</p>
                  <Link href="/skills" className="btn btn-primary btn--sm">
                    Start Learning
                  </Link>
                </div>
              ) : (
                <div className={styles.completedList}>
                  {Object.entries(completedTopics).slice(0, 12).map(([key]) => {
                    const [domainId, topicIdx] = key.split("_");
                    const domain = domains.find((d) => d.id === domainId);
                    if (!domain) return null;
                    const topic = domain.basics[parseInt(topicIdx)];
                    return (
                      <div key={key} className={styles.completedItem}>
                        <div className={styles.completedIcon} style={{ color: domain.color }}>
                          {domain.icon}
                        </div>
                        <div className={styles.completedInfo}>
                          <div className={styles.completedTopic}>{topic}</div>
                          <div className={styles.completedDomain}>{domain.name}</div>
                        </div>
                        <Link 
                          href={`/skills/${domainId}?tab=basics`} 
                          className={styles.retakeBtn}
                          title="View topic and retake quiz"
                        >
                          ↺ Retake
                        </Link>
                        <span className={styles.checkIcon}>✓</span>
                      </div>
                    );
                  })}
                  {totalCompleted > 12 && (
                    <p className={styles.moreItems}>
                      +{totalCompleted - 12} more completed topics
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Learning Streak */}
            <div className={styles.streakCard}>
              <div className={styles.streakHeader}>
                <span className={styles.streakIcon}>🔥</span>
                <div>
                  <h3 className={styles.streakTitle}>Keep Learning!</h3>
                  <p className={styles.streakSub}>
                    {totalCompleted === 0
                      ? "Complete your first topic to start your streak"
                      : `You've completed ${totalCompleted} topic${totalCompleted !== 1 ? "s" : ""}. Keep going!`}
                  </p>
                </div>
              </div>
              <div className={styles.nextSteps}>
                <p className={styles.nextStepsTitle}>Suggested next steps:</p>
                <Link href="/skills" className={styles.nextStep}>
                  <span>🎯</span> Browse all skill domains
                </Link>
                <Link href="/planner" className={styles.nextStep}>
                  <span>📅</span> Create an AI study plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
