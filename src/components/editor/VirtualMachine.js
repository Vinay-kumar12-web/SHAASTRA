/**
 * VirtualMachine.js
 * An interactive, domain-specific simulation environment.
 * Provides a "Virtual Machine" feel for different skill domains.
 */
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./VirtualMachine.module.css";

// ─── Sub-Components for Different VM Modes ─────────────────────────────────────

const TerminalVM = ({ domain, initialData }) => {
  const [logs, setLogs] = useState([
    `[SYS] Initializing ${domain.name} environment...`,
    `[SYS] Loading core modules...`,
    `[SYS] System online. Welcome, Learner.`,
    `> _`,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(prev => [
        ...prev.slice(0, -1),
        `> running ${domain.id}_compiler.sh`,
        `[BUILD] Compiling your mini project...`,
        `[SUCCESS] Build complete!`,
        `[RUN] Executing demo...`,
        ...initialData?.output || [`Hello from the ${domain.name} VM!`],
        `> _`
      ]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [domain, initialData]);

  return (
    <div className={styles.terminal}>
      {logs.map((log, i) => (
        <div key={i} className={styles.logLine}>
          {log.startsWith(">") ? <span style={{ color: "var(--brand-primary)" }}>{log.split(" ")[0]}</span> : ""}
          {log.startsWith(">") ? log.substring(1) : log}
          {i === logs.length - 1 && <span className={styles.cursor} />}
        </div>
      ))}
    </div>
  );
};

const StudioVM = ({ domain }) => {
  const [color, setColor] = useState(domain.color);
  const [radius, setRadius] = useState(12);

  return (
    <div className={styles.studio}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Primary Color</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            style={{ width: "100%", height: 32, border: "none", borderRadius: 4 }}
          />
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Border Radius: {radius}px</label>
          <input 
            type="range" min="0" max="100" 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)} 
          />
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Theme</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn--sm" style={{ flex: 1 }}>Light</button>
            <button className="btn btn-primary btn--sm" style={{ flex: 1 }}>Dark</button>
          </div>
        </div>
      </div>
      <div className={styles.preview} style={{ background: color + "10" }}>
        <div 
          style={{ 
            width: 200, 
            height: 200, 
            background: color, 
            borderRadius: radius,
            boxShadow: `0 10px 30px ${color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700
          }}
        >
          {domain.name} Card
        </div>
      </div>
    </div>
  );
};

const MarketTerminal = () => {
  const [price, setPrice] = useState(152.45);
  const [history, setHistory] = useState([40, 45, 42, 48, 52, 55, 50, 58, 62, 60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = prev + change;
        setHistory(h => [...h.slice(1), Math.max(20, Math.min(90, h[h.length-1] + change * 5))]);
        return newPrice;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.market}>
      <div className={styles.chartArea}>
        <div className={styles.priceDisplay}>
          <span style={{ color: "var(--brand-primary)", marginRight: 8 }}>AAPL</span>
          <span style={{ color: price > 152.45 ? "#34d399" : "#f43f5e" }}>
            ${price.toFixed(2)}
          </span>
        </div>
        <div className={styles.chart}>
          {history.map((h, i) => (
            <div 
              key={i} 
              className={styles.bar} 
              style={{ 
                height: `${h}%`, 
                background: i === history.length - 1 ? "var(--brand-primary)" : "rgba(255,255,255,0.1)" 
              }} 
            />
          ))}
        </div>
      </div>
      <div className={styles.orderBook}>
        <h4 style={{ fontSize: 12, marginBottom: 12 }}>Live Order Book</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#f43f5e" }}>
              <span>152.{(50+i).toString()}</span>
              <span>{(Math.random()*100).toFixed(0)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#34d399" }}>
              <span>152.{(40-i).toString()}</span>
              <span>{(Math.random()*100).toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CreatorHub = ({ domain }) => {
  return (
    <div className={styles.creator}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Followers</span>
          <span className={styles.statVal}>12.4K</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Engagement</span>
          <span className={styles.statVal}>4.8%</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reach (30d)</span>
          <span className={styles.statVal}>145K</span>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20 }}>
        <h4 style={{ fontSize: 13, marginBottom: 16 }}>Upcoming Content Schedule</h4>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, background: domain.color + "20", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: domain.color }}>
              {domain.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Social Post Strategy #{i}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Status: Draft · Scheduled for tomorrow</div>
            </div>
            <button className="btn btn-ghost btn--sm">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FreelanceDashboard = ({ domain }) => {
  return (
    <div className={styles.creator}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeft: `4px solid ${domain.color}` }}>
          <span className={styles.statLabel}>Active Projects</span>
          <span className={styles.statVal}>3</span>
        </div>
        <div className={styles.statCard} style={{ borderLeft: `4px solid #34d399` }}>
          <span className={styles.statLabel}>Total Earned</span>
          <span className={styles.statVal}>$4,250</span>
        </div>
        <div className={styles.statCard} style={{ borderLeft: `4px solid #fbbf24` }}>
          <span className={styles.statLabel}>Pending Invoices</span>
          <span className={styles.statVal}>2</span>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20 }}>
        <h4 style={{ fontSize: 13, marginBottom: 16 }}>Project Workspace</h4>
        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>New Client Proposal: E-commerce Refactor</span>
            <span className="badge badge--success">Drafting</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>
            "I've reviewed your current stack and propose a complete migration to Next.js for better SEO and performance..."
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-primary btn--sm">Send Proposal</button>
            <button className="btn btn-ghost btn--sm">Attach Portfolio</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VirtualMachine({ domain, type = "terminal" }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOnline(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderVM = () => {
    switch (type) {
      case "terminal": return <TerminalVM domain={domain} />;
      case "studio":   return <StudioVM domain={domain} />;
      case "market":   return <MarketTerminal />;
      case "creator":  return <CreatorHub domain={domain} />;
      case "freelance": return <FreelanceDashboard domain={domain} />;
      default:         return <TerminalVM domain={domain} />;
    }
  };

  const getVMTitle = () => {
    if (type === "terminal") return `${domain.name} Virtual Terminal`;
    if (type === "studio") return `${domain.name} Design Studio`;
    if (type === "market") return `${domain.name} Trading Terminal`;
    if (type === "creator") return `${domain.name} Creator Hub`;
    if (type === "freelance") return `${domain.name} Work Dashboard`;
    return `${domain.name} Virtual Machine`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.windowControls}>
          <div className={`${styles.dot} ${styles.red}`} />
          <div className={`${styles.dot} ${styles.yellow}`} />
          <div className={`${styles.dot} ${styles.green}`} />
        </div>
        <div className={styles.title}>
          <span>⚡</span>
          {getVMTitle()}
        </div>
        <div className={styles.status}>
          {isOnline && <div className={styles.statusDot} />}
          {isOnline ? "Online" : "Initializing..."}
        </div>
      </div>
      
      <div className={styles.body}>
        {renderVM()}
      </div>

      <div className={styles.footer}>
        <div className={styles.hint}>
          <span>💡</span>
          <span>This is an interactive simulation of the {domain.name} workspace.</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost btn--sm">Restart</button>
          <button className="btn btn-primary btn--sm">Export Progress</button>
        </div>
      </div>
    </div>
  );
}
