/**
 * app/skills/page.js — Explore Skills Domain Grid
 * Shows all skill domains as clickable cards.
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { domains } from "@/data/domains";
import { useApp } from "@/context/AppContext";
import styles from "./page.module.css";

const CATEGORIES = ["All", "Engineering", "Creative", "Analysis", "Business"];

export default function SkillsPage() {
  const { getSkillProgress, getCompletedCount } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDomains = useMemo(() => {
    if (activeCategory === "All") return domains;
    return domains.filter(d => d.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-tag">🚀 Career Roadmaps</p>
          <h1 className={styles.title}>Professional Learning Paths</h1>
          <p className={styles.subtitle}>
            Industry-aligned curricula designed to take you from foundational concepts to professional mastery. 
            Choose a path to begin your journey.
          </p>

          <div className={styles.filterBar}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Grid */}
        <div className={styles.grid}>
          {filteredDomains.map((domain, idx) => {
            const progress = getSkillProgress(domain.id);
            const completed = getCompletedCount(domain.id);

            return (
              <Link
                key={domain.id}
                href={`/skills/${domain.id}`}
                className={styles.domainCard}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  "--domain-color": domain.color,
                }}
              >
                {/* Top glow */}
                <div
                  className={styles.cardGlow}
                  style={{ background: `radial-gradient(circle, ${domain.color}22 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div className={styles.iconWrapper} style={{ borderColor: domain.color + "40" }}>
                  <span className={styles.icon}>{domain.icon}</span>
                </div>

                {/* Status Badges */}
                <div className={styles.badgeRow}>
                  {domain.id === 'cybersecurity' || domain.id === 'coding' ? (
                    <span className={styles.pathBadge}>Expert Verified</span>
                  ) : (
                    <span className={styles.pathBadge}>Standard Path</span>
                  )}
                  <span className={styles.levelBadge}>Beginner to Pro</span>
                </div>

                {/* Content */}
                <div className={styles.content}>
                  <h2 className={styles.domainName}>{domain.name}</h2>
                  <p className={styles.tagline}>{domain.tagline}</p>

                  {/* Skills tags */}
                  <div className={styles.skillTags}>
                    {domain.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className={styles.skillTag}>{skill}</span>
                    ))}
                    {domain.skills.length > 4 && (
                      <span className={styles.skillTag}>+{domain.skills.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {progress > 0 && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressInfo}>
                      <span>{completed} topics done</span>
                      <span style={{ color: domain.color }}>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${domain.color}cc, ${domain.color})`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Arrow */}
                <div className={styles.arrow} style={{ color: domain.color }}>→</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
