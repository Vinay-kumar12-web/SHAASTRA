/**
 * app/page.js — Home / Landing Page
 * Shows two main action cards: Explore Skills and Study Planning
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { domains } from "@/data/domains";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const { getTotalCompleted, skillProgress, user, authLoading } = useApp();
  const totalCompleted = getTotalCompleted();
  const activeDomains = Object.keys(skillProgress).length;

  // Protect the main page, force unauthenticated users to Sign Up first
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  // Prevent flash while loading Firebase state or instantly redirecting
  if (authLoading || !user) {
    return <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a", color: "white" }}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Ambient glows */}
        <div className={styles.glow1} />
        <div className={styles.glow2} />

        <div className={styles.heroContent}>
          <div className={`badge badge-brand ${styles.heroBadge}`}>
            ⚡ Your Learning Platform
          </div>

          <h1 className={styles.heroTitle}>
            Learn Smarter,<br />
            <span className="gradient-text">Build Faster</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Master in-demand skills with structured paths, AI-powered study plans,
            interactive coding, and progress tracking — all in one place.
          </p>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{domains.length}</span>
              <span className={styles.statLabel}>Skill Domains</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalCompleted}</span>
              <span className={styles.statLabel}>Topics Completed</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{activeDomains}</span>
              <span className={styles.statLabel}>Active Skills</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="section-tag">✨ Get Started</p>
            <h2 className={styles.sectionTitle}>Where would you like to begin?</h2>
          </div>

          <div className={styles.mainCards}>
            {/* Explore Skills Card */}
            <Link href="/skills" className={styles.mainCard}>
              <div className={styles.cardGlow} style={{ background: "rgba(99, 102, 241, 0.15)" }} />
              <div className={styles.cardIcon}>🎯</div>
              <h2 className={styles.cardTitle}>Explore Skills</h2>
              <p className={styles.cardDesc}>
                Browse {domains.length}+ skill domains — from Coding to UI/UX to AI & Machine Learning.
                Get structured learning paths, mini projects, and a virtual coding environment.
              </p>
              <div className={styles.cardFeatures}>
                <span className={styles.feature}>📚 Structured content</span>
                <span className={styles.feature}>🛠️ Mini projects</span>
                <span className={styles.feature}>💻 Code playground</span>
                <span className={styles.feature}>✅ Progress tracking</span>
              </div>
              <div className={styles.cardCta}>
                Explore Skills <span>→</span>
              </div>
            </Link>

            {/* Study Planner Card */}
            <Link href="/planner" className={`${styles.mainCard} ${styles.mainCardAlt}`}>
              <div className={styles.cardGlow} style={{ background: "rgba(16, 185, 129, 0.12)" }} />
              <div className={styles.cardIcon}>📅</div>
              <h2 className={styles.cardTitle}>Study Planning</h2>
              <p className={styles.cardDesc}>
                Let AI create a personalized learning roadmap for you. Paste your existing plan
                to get a daily schedule, or start from scratch with your goals.
              </p>
              <div className={styles.cardFeatures}>
                <span className={styles.feature}>🤖 AI-powered plans</span>
                <span className={styles.feature}>📋 Daily schedules</span>
                <span className={styles.feature}>🎯 Quiz challenges</span>
                <span className={styles.feature}>📈 Progress view</span>
              </div>
              <div className={`${styles.cardCta} ${styles.cardCtaGreen}`}>
                Open Planner <span>→</span>
              </div>
            </Link>

            {/* Habit Tracker Card */}
            <a href="/habit/index.html" className={`${styles.mainCard} ${styles.mainCardAmber}`}>
              <div className={styles.cardGlow} style={{ background: "rgba(245, 158, 11, 0.12)" }} />
              <div className={styles.cardIcon}>🔥</div>
              <h2 className={styles.cardTitle}>Habit Tracker</h2>
              <p className={styles.cardDesc}>
                Build consistency with our premium habit tracker. Set daily goals, maintain streaks, and visualize your long-term progress.
              </p>
              <div className={styles.cardFeatures}>
                <span className={styles.feature}>✅ Daily Goals</span>
                <span className={styles.feature}>🔥 Streak Tracking</span>
                <span className={styles.feature}>📊 Analytics</span>
                <span className={styles.feature}>🏆 Achievements</span>
              </div>
              <div className={`${styles.cardCta} ${styles.cardCtaAmber}`}>
                Open Tracker <span>→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Domain Preview Strip */}
      <section className={styles.domainsPreview}>
        <div className="container">
          <p className={styles.previewLabel}>Explore domains:</p>
          <div className={styles.domainChips}>
            {domains.map((domain) => (
              <Link
                key={domain.id}
                href={`/skills/${domain.id}`}
                className={styles.domainChip}
                style={{ borderColor: domain.color + "40", color: domain.color }}
              >
                <span>{domain.icon}</span>
                <span>{domain.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.section} style={{ paddingBottom: "80px" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="section-tag">🔥 Why Learnify</p>
            <h2 className={styles.sectionTitle}>Everything you need to grow</h2>
          </div>
          <div className={styles.featuresGrid}>
            {[
              { icon: "💻", title: "Virtual Coding Lab", desc: "Write and run Python and JavaScript directly in the browser — no setup required." },
              { icon: "🤖", title: "AI Study Plans", desc: "Describe what you want to learn and our AI generates a structured roadmap instantly." },
              { icon: "✅", title: "Topic Completion Quiz", desc: "Mark topics done and immediately get a quiz to reinforce your memory." },
              { icon: "📊", title: "Progress Dashboard", desc: "Track completed topics, skill percentages, and see your growth over time." },
              { icon: "🎯", title: "Mini Projects", desc: "Every skill domain comes with a hands-on mini project and step-by-step guide." },
              { icon: "📋", title: "Schedule Converter", desc: "Paste any study material and watch AI convert it into a daily study schedule." },
            ].map((f, i) => (
              <div key={i} className={`card ${styles.featureCard}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
