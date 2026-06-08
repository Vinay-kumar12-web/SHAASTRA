/**
 * Navbar.js
 * Top navigation bar with links, active state, and progress summary.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/skills", label: "Explore Skills", icon: "🎯" },
  { href: "/planner", label: "Study Planner", icon: "📅" },
  { href: "/tasks", label: "Task Manager", icon: "📝" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { getTotalCompleted } = useApp();
  const totalCompleted = getTotalCompleted(); 

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>SHAASTRA</span>
        </Link>

        {/* Navigation Links */}
        <div className={styles.links}>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              <span className={styles.linkIcon}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className={styles.meta}>
          {totalCompleted > 0 && (
            <div className={styles.progressBadge}>
              <span>✅</span>
              <span>{totalCompleted} completed</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
