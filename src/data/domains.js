/**
 * domains.js
 * Central data store for all skill domains on the learning platform.
 * Each domain has: id, name, icon (emoji), tagline, color, about, basics,
 * miniProject (with stepGuide and code), and skills array for display.
 */

export const domains = [
  {
    id: "coding",
    name: "Coding",
    category: "Engineering",
    icon: "💻",
    tagline: "Build the digital world",
    color: "#6366f1",
    gradient: "from-indigo-600 to-purple-700",
    about: `Programming is the backbone of modern technology. It involves writing instructions for computers to perform tasks, solve problems, and automate processes. From web apps to AI systems, coding powers virtually every digital experience we interact with daily.

Real-world applications include web development, mobile apps, data analysis, cloud computing, game development, cybersecurity, and artificial intelligence. Learning to code opens doors to one of the most in-demand and well-paying career fields globally.`,
    basics: [
      "Understand how computers work (CPU, memory, I/O)",
      "Learn a beginner language (Python is highly recommended)",
      "Variables, data types, and operators",
      "Control flow: if/else, loops (for, while)",
      "Functions and modular code design",
      "Basic data structures: arrays, lists, dictionaries",
      "Introduction to Object-Oriented Programming (OOP)",
      "Error handling and debugging techniques",
      "Version control with Git & GitHub",
      "Build your first simple projects",
    ],
    miniProject: {
      title: "Build a Python Calculator",
      description:
        "Create a command-line calculator that performs basic arithmetic operations. This project introduces you to input handling, functions, and conditional logic — fundamental building blocks for any programmer.",
      steps: [
        "Set up Python environment (install Python 3.x from python.org)",
        "Create a new file called `calculator.py`",
        "Define functions for add, subtract, multiply, divide",
        "Build a main menu loop that asks the user for an operation",
        "Accept two number inputs from the user",
        "Call the appropriate function and display the result",
        "Add error handling for division by zero and invalid inputs",
        "Test all operations with various inputs",
      ],
      language: "python",
      code: `# 🧮 Python Calculator - Mini Project
# Demonstrates: functions, loops, conditionals, error handling

def add(a, b):
    """Return the sum of two numbers."""
    return a + b

def subtract(a, b):
    """Return the difference of two numbers."""
    return a - b

def multiply(a, b):
    """Return the product of two numbers."""
    return a * b

def divide(a, b):
    """Return the quotient; handle division by zero."""
    if b == 0:
        raise ValueError("Cannot divide by zero!")
    return a / b

def get_number(prompt):
    """Safely get a numeric input from the user."""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("⚠️  Please enter a valid number.")

def main():
    print("=" * 40)
    print("   🧮  Python Calculator")
    print("=" * 40)

    operations = {
        "1": ("Addition (+)", add),
        "2": ("Subtraction (-)", subtract),
        "3": ("Multiplication (*)", multiply),
        "4": ("Division (/)", divide),
    }

    while True:
        print("\\nSelect an operation:")
        for key, (name, _) in operations.items():
            print(f"  {key}. {name}")
        print("  5. Exit")

        choice = input("\\nEnter choice (1-5): ").strip()

        if choice == "5":
            print("👋 Goodbye!")
            break

        if choice not in operations:
            print("❌ Invalid choice. Try again.")
            continue

        op_name, op_func = operations[choice]
        a = get_number("Enter first number: ")
        b = get_number("Enter second number: ")

        try:
            result = op_func(a, b)
            print(f"✅ Result: {a} → {op_name} → {b} = {result}")
        except ValueError as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
`,
    },
    skills: ["Python", "JavaScript", "TypeScript", "C++", "Java", "Go", "Rust"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Foundations", detail: "Logic, Variables, and Control Flow" },
      { step: "Phase 2: Data Structures", detail: "Arrays, Linked Lists, Trees, and Hash Maps" },
      { step: "Phase 3: Algorithms", detail: "Sorting, Searching, and Big O complexity" },
      { step: "Phase 4: Specialization", detail: "Web, Mobile, or Systems Engineering" }
    ],
    resources: [
      { title: "CS50: Introduction to Computer Science", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T382_R182iS3096yS37By4pD8", type: "Course" },
      { title: "FreeCodeCamp: Full Coding Course", url: "https://www.youtube.com/c/Freecodecamp", type: "YouTube" }
    ],
    suitability: "Best suited for analytical thinkers who enjoy problem-solving and building functional systems from scratch."
  },
  {
    id: "designing",
    name: "Designing",
    category: "Creative",
    icon: "🎨",
    tagline: "Create visual experiences",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    about: `Graphic design is the art of visual communication. Designers create logos, branding, marketing materials, illustrations, and digital assets that convey messages and emotions effectively.

From company logos to social media graphics, packaging design to motion graphics — designers shape how brands are perceived. It requires creativity, typography knowledge, color theory, and proficiency in design tools like Adobe Illustrator, Photoshop, Figma, and Canva.`,
    basics: [
      "Understand the principles of good design (balance, contrast, alignment)",
      "Color theory: primary, secondary, complementary, warm/cool",
      "Typography: fonts, spacing, hierarchy, readability",
      "Learn Canva (beginner) then move to Figma or Adobe tools",
      "Grid systems and layout composition",
      "Creating logos and brand identities",
      "Working with vectors vs. raster graphics",
      "Designing for print vs. digital",
      "Understanding client briefs and design feedback",
      "Building a design portfolio",
    ],
    miniProject: {
      title: "Design a Personal Brand Logo",
      description:
        "Create a professional personal brand logo using Figma. This project teaches you to work with vectors, shapes, typography, and color to communicate a personal identity visually.",
      steps: [
        "Sign up for Figma (free at figma.com)",
        "Research logos of professionals in your field for inspiration",
        "Sketch 3-5 logo concepts on paper first",
        "Open Figma and create a new file (1000x1000px artboard)",
        "Use shapes and the pen tool to draw your logo mark",
        "Add your name using a professional font (try Google Fonts integration)",
        "Apply a 2-color palette (use coolors.co for inspiration)",
        "Export in PNG and SVG formats",
        "Create a simple brand kit showing logo on light and dark backgrounds",
      ],
      language: "javascript",
      code: `// 🎨 Design System Color Generator
// A JavaScript utility to generate harmonious color palettes

/**
 * Converts HSL color values to HEX format.
 * HSL makes it easy to create harmonious palettes.
 */
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

/**
 * Generates a complementary color palette from a base hue.
 * @param {number} baseHue - The primary hue (0-360)
 */
function generateBrandPalette(baseHue) {
  const palette = {
    primary:     hslToHex(baseHue, 75, 50),        // Main brand color
    primaryDark: hslToHex(baseHue, 75, 35),        // Darker shade for hover
    primaryLight: hslToHex(baseHue, 75, 70),       // Lighter tint
    complementary: hslToHex((baseHue + 180) % 360, 75, 50), // Opposite color
    accent:      hslToHex((baseHue + 30) % 360, 80, 55),    // 30° analogous
    neutral:     hslToHex(baseHue, 10, 20),        // Dark neutral
    background:  hslToHex(baseHue, 15, 97),        // Light background
  };
  
  console.log("🎨 Your Brand Color Palette:");
  console.log("================================");
  Object.entries(palette).forEach(([name, hex]) => {
    console.log(\`  \${name.padEnd(15)}: \${hex}\`);
  });
  
  return palette;
}

// Generate a palette from a blue base hue (210°)
const myBrandPalette = generateBrandPalette(210);
console.log("\\n✅ Use these colors consistently across all your brand materials!");
`,
    },
    skills: ["Figma", "Adobe Photoshop", "Illustrator", "Canva", "Brand Identity", "Typography"],
    vmType: "studio",
    roadmap: [
      { step: "Phase 1: Design Fundamentals", detail: "Color Theory, Typography, and Composition" },
      { step: "Phase 2: Master Tools", detail: "Figma and Adobe Creative Suite proficiency" },
      { step: "Phase 3: Real Projects", detail: "Logo design and Brand Identity builds" },
      { step: "Phase 4: Client Work", detail: "Portfolio building and Brand Systems" }
    ],
    resources: [
      { title: "GCF LearnFree: Graphic Design Basics", url: "https://www.youtube.com/watch?v=YqQx75OPRa0", type: "YouTube" },
      { title: "Figma: Official Training", url: "https://help.figma.com/hc/en-us/categories/360002042553-Training", type: "Official" }
    ],
    suitability: "Perfect for creative individuals with an eye for detail and a passion for visual storytelling."
  },
  {
    id: "marketing",
    name: "Marketing",
    category: "Business",
    icon: "📈",
    tagline: "Grow brands and audiences",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    about: `Digital marketing encompasses all strategies to promote products and services through online channels. It's one of the fastest-growing and most versatile career fields. Marketers use data, creativity, and psychology to reach and convert target audiences.

Key domains include SEO (search engine optimization), social media marketing, email campaigns, content marketing, paid advertising (PPC), analytics, and growth hacking. Every business — from startups to Fortune 500 companies — needs effective marketing to survive and grow.`,
    basics: [
      "Understand the marketing funnel: Awareness → Interest → Decision → Action",
      "Learn SEO fundamentals: keywords, on-page optimization, backlinks",
      "Social media strategy: content calendars, platform algorithms",
      "Email marketing: list building, open rates, automation",
      "Google Analytics and data-driven decision making",
      "Content marketing and copywriting",
      "Paid ads: Google Ads, Facebook/Instagram Ads basics",
      "Consumer psychology and persuasion techniques",
      "Branding and brand voice development",
      "Running and measuring marketing campaigns",
    ],
    miniProject: {
      title: "Create a Social Media Content Calendar",
      description:
        "Build a 30-day content calendar for a fictional brand using JavaScript. This project demonstrates planning, categorization, and scheduling — core marketing skills.",
      steps: [
        "Choose a fictional product or service to market",
        "Define your target audience (age, interests, platforms)",
        "Identify 5-7 content pillars (educational, promotional, behind-the-scenes, etc.)",
        "Map out 30 days of post ideas with platform and format",
        "Write sample captions for 5 posts",
        "Plan a simple hashtag strategy",
        "Define 3 KPIs to track (likes, reach, conversions)",
        "Create a simple tracking spreadsheet",
      ],
      language: "javascript",
      code: `// 📅 30-Day Social Media Content Calendar Generator
// Automates content planning for a marketing campaign

const contentPillars = [
  { type: "Educational",     icon: "📚", platforms: ["Instagram", "LinkedIn"] },
  { type: "Promotional",     icon: "🎯", platforms: ["Instagram", "Facebook"] },
  { type: "Behind-Scenes",   icon: "🎬", platforms: ["Instagram", "TikTok"] },
  { type: "User-Generated",  icon: "👥", platforms: ["Instagram", "Twitter"] },
  { type: "Inspirational",   icon: "✨", platforms: ["Instagram", "LinkedIn"] },
  { type: "Product Feature", icon: "🛍️", platforms: ["Instagram", "Facebook"] },
  { type: "Community",       icon: "💬", platforms: ["Twitter", "Facebook"] },
];

const hashtagSets = {
  "Educational":     ["#LearnEveryDay", "#TipOfTheDay", "#DidYouKnow"],
  "Promotional":     ["#Sale", "#SpecialOffer", "#LimitedTime"],
  "Behind-Scenes":   ["#BehindTheScenes", "#TeamWork", "#OurProcess"],
  "User-Generated":  ["#CommunityLove", "#CustomerStory", "#ShareYourStory"],
  "Inspirational":   ["#MondayMotivation", "#Inspire", "#Growth"],
  "Product Feature": ["#ProductSpotlight", "#NewFeature", "#MustHave"],
  "Community":       ["#Community", "#JoinUs", "#Together"],
};

/**
 * Generates a 30-day content calendar.
 * Rotates through content pillars to ensure variety.
 */
function generateContentCalendar(brandName, startDate) {
  const calendar = [];
  const baseDate = new Date(startDate);

  for (let day = 1; day <= 30; day++) {
    const pillar = contentPillars[(day - 1) % contentPillars.length];
    const postDate = new Date(baseDate);
    postDate.setDate(baseDate.getDate() + day - 1);

    calendar.push({
      day,
      date: postDate.toISOString().split("T")[0],
      pillar: pillar.type,
      icon: pillar.icon,
      platform: pillar.platforms[day % pillar.platforms.length],
      hashtags: hashtagSets[pillar.type],
      caption: \`[Day \${day}] \${pillar.icon} \${brandName} — \${pillar.type} post\`,
    });
  }

  return calendar;
}

const calendar = generateContentCalendar("TechVibe Co.", "2024-01-01");

// Display first 7 days
console.log("📅 30-Day Content Calendar — First Week:");
console.log("==========================================");
calendar.slice(0, 7).forEach(post => {
  console.log(\`Day \${post.day} | \${post.date} | \${post.platform}\`);
  console.log(\`  \${post.icon} \${post.pillar} — "\${post.caption}"\`);
  console.log(\`  Tags: \${post.hashtags.join(" ")}\`);
  console.log("---");
});
`,
    },
    skills: ["SEO", "Social Media", "Google Ads", "Email Marketing", "Analytics", "Content Strategy"],
    vmType: "creator",
    roadmap: [
      { step: "Phase 1: Marketing Fundamentals", detail: "Psychology, Funnels, and Brand Voice" },
      { step: "Phase 2: Content Mastery", detail: "Copywriting and Social Media Strategy" },
      { step: "Phase 3: Data & Ads", detail: "Google Ads (PPC), SEO, and Analytics" },
      { step: "Phase 4: Growth Engineering", detail: "Retention, Viral Loops, and Automation" }
    ],
    resources: [
      { title: "HubSpot Academy: Digital Marketing", url: "https://academy.hubspot.com/", type: "Platform" },
      { title: "Neil Patel: SEO Unlocked", url: "https://www.youtube.com/playlist?list=PLjr6u3P07H8X7p3f1id6-y7k2u8oGv_y4", type: "YouTube" }
    ],
    suitability: "Perfect for social, data-aware individuals who enjoy storytelling and understanding what makes people buy."
  },
  {
    id: "freelancing",
    name: "Freelancing",
    category: "Business",
    icon: "🚀",
    tagline: "Work on your own terms",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    about: `Freelancing means offering your skills as an independent contractor to clients worldwide. It offers flexibility, autonomy, and the ability to earn based on your skills and market rates — often significantly more than traditional employment.

Popular freelancing platforms include Upwork, Fiverr, Toptal, and Freelancer.com. Successful freelancers master skill delivery, client communication, proposal writing, pricing, and self-management. Fields like web development, design, writing, marketing, and consulting all have thriving freelance markets.`,
    basics: [
      "Identify your core marketable skill",
      "Set up professional profiles on Upwork and Fiverr",
      "Write a compelling bio and portfolio",
      "Learn to price your services (hourly vs. project-based)",
      "Craft winning proposals and pitches",
      "Communicate professionally with clients",
      "Manage contracts, invoices, and payments",
      "Deliver high-quality work and get 5-star reviews",
      "Handle scope creep and difficult clients",
      "Scale: raise rates, build long-term clients, subcontract",
    ],
    miniProject: {
      title: "Build a Freelancer Portfolio Landing Page",
      description:
        "Create a single-page professional portfolio that showcases your skills and services. This is your #1 tool for winning high-value clients.",
      steps: [
        "Define your niche and the services you offer",
        "Collect or create 3-5 portfolio pieces (real or concept work)",
        "Write a compelling headline (e.g., 'I help SaaS startups grow with conversion-focused copy')",
        "Create an About section with your story and expertise",
        "Add a Services section with pricing tiers",
        "Include client testimonials (real or placeholder at start)",
        "Add a clear Contact/Hire Me call-to-action",
        "Deploy for free on Vercel or Netlify",
      ],
      language: "javascript",
      code: `// 💼 Freelancer Rate Calculator
// Helps freelancers set profitable hourly and project rates

/**
 * Calculate the minimum hourly rate needed to meet income goals.
 * @param {Object} params - Financial parameters
 */
function calculateFreelanceRate(params) {
  const {
    monthlyIncomeGoal,   // Target monthly take-home pay
    monthlyExpenses,     // Business expenses (software, internet, equipment)
    taxRate,             // Self-employment tax % (typically 25-30%)
    billableHoursPerWeek, // Hours actually billed (not total hours worked)
    weeksPerYear,        // Working weeks (e.g., 48 to allow for vacation)
  } = params;

  // Total annual income needed before tax
  const annualGoal = monthlyIncomeGoal * 12;
  const annualExpenses = monthlyExpenses * 12;
  
  // Gross income needed (accounting for taxes)
  const grossIncomeNeeded = (annualGoal + annualExpenses) / (1 - taxRate / 100);
  
  // Total billable hours per year
  const billableHoursPerYear = billableHoursPerWeek * weeksPerYear;
  
  // Minimum hourly rate
  const minHourlyRate = grossIncomeNeeded / billableHoursPerYear;
  
  // Suggested rates (with buffer for negotiations)
  return {
    minimumRate: Math.ceil(minHourlyRate),
    recommendedRate: Math.ceil(minHourlyRate * 1.25),  // +25% buffer
    premiumRate: Math.ceil(minHourlyRate * 1.5),        // +50% for premium clients
    
    // Project pricing examples
    smallProject:  Math.ceil(minHourlyRate * 10),   // ~10 hour project
    mediumProject: Math.ceil(minHourlyRate * 40),   // ~1 week project
    largeProject:  Math.ceil(minHourlyRate * 160),  // ~1 month project
    
    // Summary stats
    annualRevenue: Math.ceil(grossIncomeNeeded),
    effectiveHourlyEarned: Math.ceil(annualGoal / billableHoursPerYear),
  };
}

const rates = calculateFreelanceRate({
  monthlyIncomeGoal: 5000,      // $5,000/month take-home
  monthlyExpenses: 300,          // Software, subscriptions
  taxRate: 28,                   // 28% self-employment tax
  billableHoursPerWeek: 30,     // 30 billable hours/week
  weeksPerYear: 48,             // 4 weeks off per year
});

console.log("💰 Your Freelance Rate Calculator Results");
console.log("==========================================");
console.log(\`Minimum Rate:    \$\${rates.minimumRate}/hr\`);
console.log(\`Recommended Rate: \$\${rates.recommendedRate}/hr\`);
console.log(\`Premium Rate:    \$\${rates.premiumRate}/hr\`);
console.log("\\n📦 Project Pricing:");
console.log(\`Small Project:  \$\${rates.smallProject}\`);
console.log(\`Medium Project: \$\${rates.mediumProject}\`);
console.log(\`Large Project:  \$\${rates.largeProject}\`);
console.log("\\n📊 Annual Summary:");
console.log(\`Target Revenue: \$\${rates.annualRevenue}\`);
`,
    },
    skills: ["Proposal Writing", "Client Relations", "Pricing", "Upwork", "Fiverr", "Project Management"],
    vmType: "freelance",
  },
  {
    id: "trading",
    name: "Trading",
    category: "Analysis",
    icon: "📊",
    tagline: "Navigate financial markets",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    about: `Trading involves buying and selling financial instruments — stocks, cryptocurrencies, forex, commodities, and derivatives — to generate profits. It requires discipline, analytical thinking, risk management, and a deep understanding of market dynamics.

Successful traders study chart patterns (technical analysis), company fundamentals, macroeconomic conditions, and develop systematic strategies. Risk management is paramount: professional traders never risk more than 1-2% of capital per trade. Trading can be done as a career, side income, or personal wealth building activity.`,
    basics: [
      "Understand financial markets: stocks, forex, crypto, commodities",
      "Learn candlestick charts and basic chart reading",
      "Technical analysis: support/resistance, trend lines, MA",
      "Key indicators: RSI, MACD, Bollinger Bands, Volume",
      "Fundamental analysis: P/E ratio, earnings, news events",
      "Risk management: stop-loss, position sizing, risk/reward",
      "Paper trading (practice without real money)",
      "Trading psychology: discipline, patience, avoiding FOMO",
      "Journal and track all your trades",
      "Develop and back-test a trading strategy",
    ],
    miniProject: {
      title: "Build a Simple Stock Price Analyzer",
      description:
        "Create a Python script that fetches stock data and calculates moving averages to generate simple buy/sell signals. This introduces you to quantitative trading concepts.",
      steps: [
        "Install Python libraries: pip install yfinance pandas numpy",
        "Import a stock symbol (e.g., AAPL, TSLA) using yfinance",
        "Load 6 months of daily closing price data into a DataFrame",
        "Calculate 20-day Simple Moving Average (SMA20)",
        "Calculate 50-day Simple Moving Average (SMA50)",
        "Generate signal: BUY when SMA20 crosses above SMA50 (Golden Cross)",
        "Generate signal: SELL when SMA20 crosses below SMA50 (Death Cross)",
        "Print the latest signal and price statistics",
      ],
      language: "python",
      code: `# 📊 Simple Stock Moving Average Analyzer
# Demonstrates: data fetching, moving averages, trading signals
# Install: pip install yfinance pandas numpy

import pandas as pd
import numpy as np

# Simulated stock price data (in practice, use: yf.download("AAPL", period="6mo"))
# This demo uses synthetic data so it runs without API calls
np.random.seed(42)
dates = pd.date_range(start="2024-01-01", periods=120, freq="B")  # Business days
prices = 150 + np.cumsum(np.random.randn(120) * 2)  # Random walk from $150

df = pd.DataFrame({"Close": prices}, index=dates)
df["Symbol"] = "AAPL (Simulated)"

# ─── Calculate Moving Averages ────────────────────────────────────────────────
df["SMA_20"] = df["Close"].rolling(window=20).mean()  # Short-term trend
df["SMA_50"] = df["Close"].rolling(window=50).mean()  # Long-term trend

# ─── Generate Trading Signals ─────────────────────────────────────────────────
df["Signal"] = 0
df.loc[df["SMA_20"] > df["SMA_50"], "Signal"] = 1   # Bullish (BUY)
df.loc[df["SMA_20"] < df["SMA_50"], "Signal"] = -1  # Bearish (SELL)

# ─── Detect Crossovers (actual buy/sell points) ───────────────────────────────
df["Crossover"] = df["Signal"].diff()
buy_signals  = df[df["Crossover"] == 2]   # Went from -1 to +1
sell_signals = df[df["Crossover"] == -2]  # Went from +1 to -1

# ─── Analysis Report ──────────────────────────────────────────────────────────
latest = df.dropna().iloc[-1]

print("=" * 50)
print("  📊 Stock Moving Average Analysis Report")
print("=" * 50)
print(f"Symbol:         {df['Symbol'].iloc[0]}")
print(f"Latest Date:    {df.index[-1].strftime('%Y-%m-%d')}")
print(f"Latest Price:   \${df['Close'].iloc[-1]:.2f}")
print(f"SMA-20:         \${latest['SMA_20']:.2f}")
print(f"SMA-50:         \${latest['SMA_50']:.2f}")
print()

# Current signal
signal_map = {1: "🟢 BULLISH — Consider BUY positions",
              -1: "🔴 BEARISH — Consider SELL/SHORT",
               0: "⚪ NEUTRAL"}
print(f"Current Signal: {signal_map.get(latest['Signal'], 'N/A')}")
print()

print(f"📈 Buy Crossovers (Golden Cross): {len(buy_signals)} events")
print(f"📉 Sell Crossovers (Death Cross): {len(sell_signals)} events")
print()
print("⚠️  DISCLAIMER: This is educational only. Never trade based solely")
print("   on moving averages. Always use proper risk management!")
`,
    },
    skills: ["Technical Analysis", "Risk Management", "Python", "Chart Reading", "Economics"],
    vmType: "market",
    roadmap: [
      { step: "Phase 1: Market Basics", detail: "Asset classes, Brokers, and Order types" },
      { step: "Phase 2: Analysis Tools", detail: "Technical and Fundamental Analysis basics" },
      { step: "Phase 3: Strategy Build", detail: "Backtesting and Risk Management rules" },
      { step: "Phase 4: Live Execution", detail: "Psychology and Journaling performance" }
    ],
    resources: [
      { title: "Babypips: School of Pipsology", url: "https://www.babypips.com/learn", type: "Platform" },
      { title: "TradingView: Analysis Platform", url: "https://www.tradingview.com/", type: "Tool" }
    ],
    suitability: "Excellently suited for highly disciplined, unemotional, and mathematically-inclined individuals."
  },
  {
    id: "content-creation",
    name: "Content Creation",
    category: "Creative",
    icon: "🎬",
    tagline: "Tell stories that captivate",
    color: "#ef4444",
    gradient: "from-red-500 to-pink-600",
    about: `Content creators produce written, visual, or audio material for platforms like YouTube, Instagram, TikTok, blogs, and podcasts. It's one of the most rapidly growing career paths, with top creators earning millions annually.

Successful content creation combines storytelling, production skills, platform knowledge, audience psychology, and consistency. Creators must understand their niche, viewer/reader needs, SEO, and monetization strategies (AdSense, sponsorships, merchandise, creations). The creator economy is now worth over $100 billion globally.`,
    basics: [
      "Find your niche (what can you talk about for 2+ years?)",
      "Study your target audience and their pain points",
      "Learn basic video editing (CapCut, DaVinci Resolve)",
      "Understand platform algorithms (YouTube, Instagram, TikTok)",
      "Script writing and storytelling structures",
      "Audio quality: microphone basics, noise reduction",
      "Thumbnail design and click-through optimization",
      "SEO for content: titles, descriptions, tags",
      "Batch content creation and scheduling",
      "Monetization strategies: AdSense, brand deals, products",
    ],
    miniProject: {
      title: "Create a YouTube Channel Content Strategy",
      description:
        "Develop a complete content strategy document and programming schedule for a YouTube channel in your niche.",
      steps: [
        "Choose a channel niche with clear demand and passion",
        "Research 20 channel competitors to understand the landscape",
        "Define your unique value proposition (why watch YOU?)",
        "Generate 30 video ideas using keyword research",
        "Design a posting schedule (1-3x per week for YouTube)",
        "Plan your first 5 videos in detail (title, hook, outline, CTA)",
        "Create a channel art mockup",
        "Write an engaging channel description with keywords",
      ],
      language: "javascript",
      code: `// 🎬 YouTube Content Strategy Generator
// Generates video ideas and scripts based on your niche

const niche = "Programming Tutorials";

// ─── Video Idea Generator ─────────────────────────────────────────────────────
const videoFormats = [
  { type: "Tutorial",      hook: "How to", cta: "Code along with me" },
  { type: "Listicle",      hook: "Top 10", cta: "Save this for later" },
  { type: "Comparison",    hook: "vs.",    cta: "Comment your pick"   },
  { type: "Challenge",     hook: "I tried", cta: "Try it yourself"   },
  { type: "Case Study",    hook: "How I",  cta: "Get the free guide" },
  { type: "Beginner Guide", hook: "Complete guide to", cta: "Start here" },
];

const topics = [
  "Python", "JavaScript", "React", "APIs", "Machine Learning",
  "Git", "Docker", "Web Scraping", "Automation", "Data Visualization"
];

function generateVideoIdeas(count = 10) {
  const ideas = [];

  for (let i = 0; i < count; i++) {
    const format = videoFormats[i % videoFormats.length];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    ideas.push({
      id: i + 1,
      type: format.type,
      title: \`\${format.hook} \${topic} in 2024\`,
      hook: \`"By the end of this video, you'll be able to \${topic.toLowerCase()} like a pro"\`,
      estimatedRuntime: \`\${8 + (i % 7)} min\`,
      cta: format.cta,
      priority: i < 5 ? "🔥 High" : "📌 Queue",
    });
  }

  return ideas;
}

// ─── Script Template Generator ────────────────────────────────────────────────
function generateScriptTemplate(title, topic) {
  return {
    title,
    segments: [
      { name: "Hook (0-30s)",       content: \`Start with: "Did you know \${topic} can do [surprising fact]?"\` },
      { name: "Intro (30s-1min)",   content: "Introduce yourself + what viewers will learn" },
      { name: "Main Content",       content: \`Teach \${topic} step by step, show examples\` },
      { name: "Demo/Results",       content: "Show the finished project/result in action" },
      { name: "Summary (1-2min)",   content: "Recap key points learned in this video" },
      { name: "CTA (last 30s)",     content: "Subscribe + comment + next recommended video" },
    ]
  };
}

const ideas = generateVideoIdeas(10);
console.log(\`🎬 Content Strategy for: "\${niche}"\`);
console.log("=" + "=".repeat(44));
ideas.slice(0, 5).forEach(v => {
  console.log(\`\\n#\${v.id} [\${v.type}] \${v.priority}\`);
  console.log(\`  Title: "\${v.title}"\`);
  console.log(\`  Hook:  \${v.hook}\`);
  console.log(\`  Runtime: \${v.estimatedRuntime} | CTA: \${v.cta}\`);
});
`,
    },
    skills: ["Video Editing", "Scripting", "Thumbnail Design", "SEO", "YouTube Analytics", "Monetization"],
    vmType: "creator",
    roadmap: [
      { step: "Phase 1: Niche Research", detail: "Audience pain points and Niche selection" },
      { step: "Phase 2: Production Mastery", detail: "Lighting, Sound, and Editing basics" },
      { step: "Phase 3: Distribution", detail: "SEO, Thumbnails, and Hook writing" },
      { step: "Phase 4: Business Scale", detail: "Monetization, Brand deals, and Community" }
    ],
    resources: [
      { title: "Think Media: YouTube for Beginners", url: "https://www.youtube.com/c/ThinkMediaTV", type: "YouTube" },
      { title: "Colin & Samir: Creator Economy", url: "https://www.youtube.com/c/ColinandSamir", type: "YouTube" }
    ],
    suitability: "Great for charismatic storytellers and creatives who love building a personal brand and community."
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    category: "Creative",
    icon: "✏️",
    tagline: "Design delightful user experiences",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-700",
    about: `UI (User Interface) design focuses on the visual elements users interact with — buttons, typography, color, layout. UX (User Experience) focuses on the entire experience: how intuitive, efficient, and satisfying a product is to use.

Great UI/UX design is invisible — it guides users effortlessly. Poor design creates friction and drives users away. Companies invest heavily in design because good UX directly increases conversion rates, retention, and user satisfaction. Tools like Figma, Adobe XD, and Sketch are industry standards.`,
    basics: [
      "Understand the design thinking process: Empathize, Define, Ideate, Prototype, Test",
      "Learn Figma (free, industry-standard): frames, components, auto-layout",
      "Typography hierarchy and readability principles",
      "Color psychology and accessible color contrast (WCAG)",
      "User research techniques: interviews, surveys, usability tests",
      "Wireframing: lo-fi sketches to hi-fi mockups",
      "Prototyping with interactive transitions in Figma",
      "Design systems: component libraries, style guides",
      "Mobile-first and responsive design principles",
      "Heuristic evaluation and design critique",
    ],
    miniProject: {
      title: "Design a Mobile App Login Flow",
      description:
        "Create a complete login/sign-up UX flow for a mobile app in Figma with wireframe, mockup, and prototype states.",
      steps: [
        "Open Figma and create an iPhone 14 frame (390×844)",
        "Sketch a lo-fi wireframe for the login screen",
        "Design screens: Splash → Welcome → Login → Home",
        "Create reusable components: Button, Input Field, Logo",
        "Apply your color palette and typography system",
        "Add meaningful micro-interactions (button press states, error states)",
        "Build a prototype connecting all screens",
        "Record a prototype walkthrough video",
      ],
      language: "javascript",
      code: `// ✏️ UX Design Heuristic Evaluator
// Score a UI design against Nielsen's 10 Usability Heuristics

const heuristics = [
  { id: 1, name: "Visibility of System Status",
    question: "Does the UI always keep users informed about what's happening?",
    example: "Loading spinners, progress bars, success/error messages" },
  { id: 2, name: "Match System to Real World",
    question: "Does it use language and concepts familiar to the user?",
    example: "Trash icon for delete, cart icon for shopping" },
  { id: 3, name: "User Control & Freedom",
    question: "Can users undo, redo, or exit unwanted states?",
    example: "Undo delete, cancel button on forms" },
  { id: 4, name: "Consistency & Standards",
    question: "Do similar elements behave consistently throughout?",
    example: "All primary buttons same color, same position" },
  { id: 5, name: "Error Prevention",
    question: "Does the design prevent errors before they happen?",
    example: "Confirm dialog before irreversible actions" },
  { id: 6, name: "Recognition over Recall",
    question: "Can users see options rather than memorize them?",
    example: "Visible navigation, autocomplete dropdowns" },
  { id: 7, name: "Flexibility & Efficiency",
    question: "Does it accommodate both novice and expert users?",
    example: "Keyboard shortcuts, customizable workflows" },
  { id: 8, name: "Aesthetic & Minimal Design",
    question: "Is every element necessary? Is UI clutter-free?",
    example: "Remove decorative elements that add noise" },
  { id: 9, name: "Help Users Recognize & Recover from Errors",
    question: "Are error messages clear and actionable?",
    example: "'Email format invalid' not just 'Error 400'" },
  { id: 10, name: "Help & Documentation",
    question: "Is help easily accessible when needed?",
    example: "Search in docs, contextual tooltips" },
];

// Example evaluation scores (0-4: 0=Fail, 4=Excellent)
const exampleScores = [4, 3, 2, 4, 3, 3, 2, 4, 3, 2];

function evaluateDesign(designName, scores) {
  const maxScore = heuristics.length * 4;
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const rating = percentage >= 85 ? "🏆 Excellent" :
                 percentage >= 70 ? "✅ Good" :
                 percentage >= 50 ? "⚠️  Needs Work" : "❌ Poor";

  console.log(\`🎯 Heuristic Evaluation: "\${designName}"\`);
  console.log("=" + "=".repeat(44));
  
  heuristics.forEach((h, i) => {
    const score = scores[i];
    const bar = "█".repeat(score) + "░".repeat(4 - score);
    console.log(\`\${h.id.toString().padStart(2)}. [\${bar}] \${score}/4 — \${h.name}\`);
  });
  
  console.log(\`\\nTotal Score: \${totalScore}/\${maxScore} (\${percentage}%)\`);
  console.log(\`Rating: \${rating}\`);
}

evaluateDesign("Mobile Login Flow v1", exampleScores);
`,
    },
    skills: ["Figma", "Wireframing", "Prototyping", "User Research", "Design Systems", "Accessibility"],
    vmType: "studio",
    roadmap: [
      { step: "Phase 1: UX Process", detail: "User Research and Information Architecture" },
      { step: "Phase 2: UI Design", detail: "Visual Design, Components, and Prototyping" },
      { step: "Phase 3: Design Systems", detail: "Scalable libraries and Developer handoff" },
      { step: "Phase 4: Career Pack", detail: "Portfolio, Case Studies, and Interview prep" }
    ],
    resources: [
      { title: "Google UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design", type: "Course" },
      { title: "Flux Academy: UI Design Guide", url: "https://www.youtube.com/c/FluxAcademy", type: "YouTube" }
    ],
    suitability: "Ideal for empathetic thinkers who enjoy combining human psychology with clean, functional visual design."
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "Analysis",
    icon: "🔬",
    tagline: "Extract insights from data",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-600",
    about: `Data Science is the interdisciplinary field that uses statistics, programming, and domain expertise to extract meaningful insights from structured and unstructured data. It powers modern business intelligence, product recommendations, medical research, and predictive analytics.

Data scientists work with tools like Python, R, SQL, and big data platforms. The typical workflow involves data collection, cleaning, exploratory analysis, statistical modeling, machine learning, and visualization. With data growing exponentially, skilled data scientists are among the highest-paid professionals globally.`,
    basics: [
      "Python fundamentals + NumPy and Pandas for data manipulation",
      "SQL for querying databases",
      "Data cleaning and preprocessing (handling nulls, outliers)",
      "Exploratory Data Analysis (EDA) and statistical summaries",
      "Data visualization with Matplotlib, Seaborn, or Plotly",
      "Probability and statistics fundamentals",
      "Introduction to machine learning with Scikit-Learn",
      "Feature engineering and selection",
      "Model evaluation: accuracy, precision, recall, F1-score",
      "Communicating findings to non-technical stakeholders",
    ],
    miniProject: {
      title: "Analyze a Real-World Dataset",
      description:
        "Perform exploratory data analysis on a public dataset to uncover trends and insights. This is exactly what data scientists do professionally.",
      steps: [
        "Install Python, Pandas, Matplotlib: pip install pandas matplotlib seaborn",
        "Download a public dataset (Titanic, Iris, or COVID data from Kaggle)",
        "Load data into a Pandas DataFrame and inspect shape and columns",
        "Check for missing values and decide on handling strategy",
        "Calculate summary statistics: mean, median, std, min, max",
        "Create 3-5 visualizations: histogram, heatmap, scatter plot",
        "Identify the top 3 insights from the data",
        "Write a brief analysis summary",
      ],
      language: "python",
      code: `# 🔬 Exploratory Data Analysis (EDA) Template
# Replace the synthetic data with any real dataset from Kaggle!

import statistics
import math

# ─── Synthetic Sales Dataset ──────────────────────────────────────────────────
data = {
    "product":  ["Laptop", "Phone", "Tablet", "Watch", "Earbuds"] * 20,
    "sales":    [150, 85, 45, 30, 60] * 20,
    "revenue":  [225000, 68000, 27000, 15000, 18000] * 20,
    "rating":   [4.5, 4.2, 3.8, 4.0, 4.3] * 20,
    "region":   ["North", "South", "East", "West", "Central"] * 20,
}

# ─── Analysis Functions ───────────────────────────────────────────────────────
def summarize(values, label):
    """Print summary statistics for a numeric column."""
    mean   = statistics.mean(values)
    median = statistics.median(values)
    stdev  = statistics.stdev(values)
    min_v  = min(values)
    max_v  = max(values)
    
    print(f"  {label}:")
    print(f"    Mean:   {mean:>10.2f}")
    print(f"    Median: {median:>10.2f}")
    print(f"    Std:    {stdev:>10.2f}")
    print(f"    Min:    {min_v:>10.2f} | Max: {max_v:.2f}")

def group_sum(categories, values):
    """Calculate sum per category (like pandas groupby.sum)."""
    result = {}
    for cat, val in zip(categories, values):
        result[cat] = result.get(cat, 0) + val
    return dict(sorted(result.items(), key=lambda x: -x[1]))

# ─── EDA Report ───────────────────────────────────────────────────────────────
print("📊 Exploratory Data Analysis Report")
print("=" * 45)
print(f"Dataset shape: {len(data['product'])} rows × {len(data)} columns")
print(f"Columns: {list(data.keys())}")
print()

print("📈 Summary Statistics:")
summarize(data["sales"],   "Sales (units)")
summarize(data["revenue"], "Revenue ($)")
summarize(data["rating"],  "Customer Rating")

print()
print("🏆 Revenue by Product:")
rev_by_product = group_sum(data["product"], data["revenue"])
for product, rev in list(rev_by_product.items())[:5]:
    bar = "■" * int(rev / 15000)
    print(f"  {product.ljust(10)} \${rev:>8,.0f}  {bar}")

print()
print("🌍 Sales by Region:")
sales_by_region = group_sum(data["region"], data["sales"])
for region, s in sales_by_region.items():
    print(f"  {region.ljust(10)} {s} units")

print()
print("✅ Key Insights:")
top_product = list(rev_by_product.keys())[0]
print(f"  1. '{top_product}' generates the highest revenue")
print(f"  2. Average customer rating: {statistics.mean(data['rating']):.2f}/5.0")
print(f"  3. Top region by sales: {list(sales_by_region.keys())[0]}")
`,
    },
    skills: ["Python", "Pandas", "SQL", "Statistics", "Matplotlib", "Machine Learning", "NumPy"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Programming & SQL", detail: "Python basics and Database querying" },
      { step: "Phase 2: Math foundations", detail: "Statistics, Probability, and Linear Algebra" },
      { step: "Phase 3: Machine Learning", detail: "Regression, Clustering, and Scikit-Learn" },
      { step: "Phase 4: Deployment", detail: "Cloud data pipelines and Model serving" }
    ],
    resources: [
      { title: "Kaggle: Learn Data Science", url: "https://www.kaggle.com/learn", type: "Platform" },
      { title: "Ken Jee: Data Science Projects", url: "https://www.youtube.com/c/KenJee1", type: "YouTube" }
    ],
    suitability: "Perfect for inquisitive, data-driven minds who enjoy hunting for stories hidden in numbers."
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    category: "Analysis",
    icon: "🤖",
    tagline: "Build intelligent systems",
    color: "#a855f7",
    gradient: "from-purple-500 to-fuchsia-600",
    about: `Artificial Intelligence and Machine Learning are the most transformative technologies of our era. AI involves creating systems that can perform tasks requiring human-like intelligence. ML is a subset where systems learn from data to make predictions and decisions without explicit programming.

Applications span every industry: self-driving cars, medical diagnosis, language translation, recommendation systems, fraud detection, and generative AI. Key areas include supervised learning, unsupervised learning, deep learning (neural networks), NLP, and computer vision. Python with TensorFlow, PyTorch, and Scikit-Learn are the core tools.`,
    basics: [
      "Python, NumPy, Pandas, and Matplotlib mastery",
      "Linear algebra and probability fundamentals",
      "Supervised learning: regression and classification",
      "Unsupervised learning: clustering, dimensionality reduction",
      "Training, validation, and test splits; cross-validation",
      "Overfitting, regularization (L1/L2), and hyperparameter tuning",
      "Deep learning: neural networks, activation functions, backpropagation",
      "CNNs for image tasks, RNNs/LSTMs for sequences",
      "Transformers and attention mechanism (GPT, BERT basics)",
      "Model deployment: APIs, cloud, edge devices",
    ],
    miniProject: {
      title: "Build a Text Sentiment Classifier",
      description:
        "Create a basic sentiment analysis model that classifies movie reviews as positive or negative. This introduces you to NLP and machine learning fundamentals.",
      steps: [
        "Install dependencies: pip install scikit-learn",
        "Create a labeled dataset of 20+ movie reviews (positive/negative)",
        "Preprocess text: lowercase, remove punctuation, tokenize",
        "Convert text to features using TF-IDF Vectorizer",
        "Split data 80/20 into training and test sets",
        "Train a Naive Bayes or Logistic Regression classifier",
        "Evaluate performance: accuracy, precision, recall",
        "Test with your own custom movie review input",
      ],
      language: "python",
      code: `# 🤖 Sentiment Classifier — No external ML libs needed for demo!
# In a real project, use: sklearn's TfidfVectorizer + LogisticRegression

import re
import math
from collections import defaultdict

# ─── Training Data ────────────────────────────────────────────────────────────
training_data = [
    # (text, label)  label: 1 = positive, 0 = negative
    ("amazing movie loved every minute", 1),
    ("fantastic performances brilliant direction", 1),
    ("great film highly recommend watching", 1),
    ("wonderful story beautiful cinematography", 1),
    ("enjoyed this film great storyline", 1),
    ("best movie seen years incredible", 1),
    ("terrible film waste of time", 0),
    ("boring slow poorly written disappointed", 0),
    ("awful acting bad script hated it", 0),
    ("worst movie ever complete disaster", 0),
    ("ugly cinematography horrible story avoid", 0),
    ("disappointing weak plot bad ending", 0),
]

# ─── Naive Bayes Classifier (from scratch!) ───────────────────────────────────
class NaiveBayesSentiment:
    def __init__(self):
        self.word_counts = {0: defaultdict(int), 1: defaultdict(int)}
        self.class_counts = {0: 0, 1: 0}
        self.vocab = set()

    def tokenize(self, text):
        """Simple word tokenizer."""
        return re.findall(r'[a-z]+', text.lower())

    def fit(self, data):
        """Train the Naive Bayes model."""
        for text, label in data:
            words = self.tokenize(text)
            self.class_counts[label] += 1
            for word in words:
                self.word_counts[label][word] += 1
                self.vocab.add(word)

    def predict(self, text):
        """Classify text using log probabilities."""
        words = self.tokenize(text)
        total = sum(self.class_counts.values())
        scores = {}

        for label in [0, 1]:
            # Prior probability (log scale)
            score = math.log(self.class_counts[label] / total)
            word_total = sum(self.word_counts[label].values())

            for word in words:
                # Laplace smoothing
                count = self.word_counts[label].get(word, 0) + 1
                score += math.log(count / (word_total + len(self.vocab)))

            scores[label] = score

        return 1 if scores[1] > scores[0] else 0, scores

# ─── Train and Test ───────────────────────────────────────────────────────────
model = NaiveBayesSentiment()
model.fit(training_data)

test_reviews = [
    "absolutely loved this movie great performances",
    "terrible story bad dialogue complete waste",
    "decent film with some good moments",
    "incredibly boring and disappointing experience",
]

print("🤖 Sentiment Classifier Results")
print("=" * 45)
for review in test_reviews:
    pred, scores = model.predict(review)
    sentiment = "😊 POSITIVE" if pred == 1 else "😞 NEGATIVE"
    confidence = abs(scores[1] - scores[0])
    print(f"Review: \\"{review[:40]}...\\"")
    print(f"  Sentiment:  {sentiment}")
    print(f"  Confidence: {confidence:.2f}")
    print()
`,
    },
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "NLP", "Deep Learning", "Computer Vision"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Python & Data Engineering", detail: "Advanced NumPy and Data manipulation" },
      { step: "Phase 2: ML Fundamentals", detail: "Supervised and Unsupervised algorithms" },
      { step: "Phase 3: Deep Learning", detail: "Neural Networks and PyTorch/TensorFlow" },
      { step: "Phase 4: SOTA Models", detail: "Transformers, GANs, and Generative AI" }
    ],
    resources: [
      { title: "Andrew Ng: Machine Learning Spec", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "Course" },
      { title: "Sentdex: ML from Scratch", url: "https://www.youtube.com/user/sentdex", type: "YouTube" }
    ],
    suitability: "Best suited for math-heavy thinkers who want to build the future of automated intelligence."
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    category: "Engineering",
    icon: "🛡️",
    tagline: "Defend the digital frontier",
    color: "#0f62fe",
    gradient: "from-blue-700 to-indigo-900",
    about: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.
    
Inspired by enterprise-grade learning standards, this path covers the full spectrum of data protection, threat intelligence, and digital defense. You'll learn to think like a defender and understand the methodologies used by professional security analysts worldwide.`,
    basics: [
      "The CIA Triad: Confidentiality, Integrity, and Availability",
      "Understanding Network Protocols (TCP/IP, HTTP, DNS)",
      "Identity and Access Management (IAM) & Least Privilege",
      "Symmetric and Asymmetric Encryption (RSA, AES)",
      "Common Threats: Phishing, Ransomware, and Social Engineering",
      "Network Security: Firewalls, IDS/IPS, and VPNs",
      "Vulnerability Management and Penetration Testing",
      "Security Operations Center (SOC) Fundamentals",
      "Governance, Risk, and Compliance (GRC) Overview",
      "Career Paths: SOC Analyst, Pentester, Security Engineer",
    ],
    miniProject: {
      title: "Simulate a Packet Sniffer (Wireshark-style)",
      description:
        "Build a Python utility that simulates network packet inspection. Understand how data flows through a network and how to spot suspicious activity in real-time.",
      steps: [
        "Install Python (if not already installed)",
        "Create a file named `packet_analyzer.py`",
        "Define a 'Packet' structure containing Source, Destination, and Payload",
        "Generate a stream of synthetic network traffic (HTTP, DNS, SSH)",
        "Implement a 'Traffic Monitor' that filters for suspicious patterns (e.g., unauthorized ports)",
        "Add an 'Alerting' system for potential port scanning activity",
        "Report and summarize the captured traffic types",
      ],
      language: "python",
      code: `# 🛡️ Cybersecurity Packet Analyzer Simulator
# Understanding Network Traffic & Intrusion Detection

import time
import random

# ─── Network Packet Class ───────────────────────────────────────────────
class Packet:
    def __init__(self, src, dest, protocol, payload, port):
        self.src = src
        self.dest = dest
        self.protocol = protocol
        self.payload = payload
        self.port = port
        self.timestamp = time.strftime("%H:%M:%S")

# ─── Intrustion Detection Logic ─────────────────────────────────────────
def analyze_packet(packet):
    print(f"[{packet.timestamp}] {packet.protocol.ljust(5)} | {packet.src} -> {packet.dest} (Port: {packet.port})")
    
    # 🚨 Suspicious Activity Detection
    suspicious = False
    if packet.port in [22, 23, 445]: # Common attack ports
        print(f"  ⚠️  [ALERT] Unauthorized Port Access Attempt (Port: {packet.port})")
        suspicious = True
    if "password" in packet.payload.lower() and packet.protocol == "HTTP":
        print(f"  🛡️  [ALERT] Plaintext Sensitive Data Detected in {packet.protocol}!")
        suspicious = True
    
    return suspicious

def start_sniffing():
    print("=" * 60)
    print("   🛡️  Cybersecurity Intrusion Detection System (IDS)")
    print("=" * 60)
    print("Monitoring Live Network Traffic... (Ctrl+C to stop)\\n")
    
    traffic_types = ["HTTP", "DNS", "HTTPS", "SSH", "ICMP", "SMB"]
    ips = ["192.168.1.10", "10.0.0.45", "172.16.254.1", "192.168.1.5"]
    
    try:
        alerts_detected = 0
        for i in range(20): # Simulate 20 packets
            protocol = random.choice(traffic_types)
            src = random.choice(ips)
            dest = "8.8.8.8" if random.random() > 0.5 else "192.168.1.1"
            port = random.choice([80, 443, 53, 22, 21, 445])
            payload = "Standard activity"
            
            if i % 7 == 0:
                payload = "admin_password=12345" # Injecting sensitivity
                
            p = Packet(src, dest, protocol, payload, port)
            if analyze_packet(p):
                alerts_detected += 1
            
            time.sleep(0.5)
            
        print("\\n" + "=" * 60)
        print(f"📡 Scan Complete. Alerts Logged: {alerts_detected}")
        print("Done.")
    except KeyboardInterrupt:
        print("\\nSniffer stopped.")

if __name__ == "__main__":
    start_sniffing()
`,
    },
    skills: ["Network Security", "Cryptography", "Penetration Testing", "GRC", "SOC Ops", "Incident Response"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Networking Basics", detail: "TCP/IP, OSI Model, and Protocols" },
      { step: "Phase 2: Security Fundamentals", detail: "Threats, Attacks, and Vulnerabilities" },
      { step: "Phase 3: Defensive Ops", detail: "Firewalls, IDS/IPS, and Identity Management" },
      { step: "Phase 4: Offensive Security", detail: "Penetration Testing and Ethical Hacking" }
    ],
    resources: [
      { title: "NetworkChuck: Cybersecurity Path", url: "https://www.youtube.com/playlist?list=PLIhvC56v6w8XvK_STm6zQzG43T0V6", type: "YouTube" },
      { title: "Cybrary: IT & Cybersecurity Training", url: "https://www.cybrary.it/", type: "Platform" }
    ],
    suitability: "Ideal for detail-oriented individuals who enjoy 'digital detective' work and defending complex systems."
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    category: "Engineering",
    icon: "☁️",
    tagline: "Master the modern infrastructure",
    color: "#0284c7",
    gradient: "from-sky-600 to-blue-800",
    about: `Cloud Computing is the delivery of computing services—including servers, storage, databases, networking, and software—over the internet ("the cloud"). Instead of owning their own computing infrastructure or data centers, companies lease access to anything from applications to storage from cloud providers like AWS, Azure, or Google Cloud.

    This domain is critical because it allows businesses to scale rapidly, reduce costs, and innovate faster without managing physical hardware. Cloud Architects and Engineers design and maintain these vast digital landscapes, ensuring high availability, security, and performance for millions of users.`,
    basics: ["Cloud Service Models (IaaS, PaaS, SaaS)", "Deployment Models (Public, Private, Hybrid)", "Virtualization and Containers", "Cloud Storage and Databases", "Serverless Computing Concepts", "Identity and Access Management in Cloud", "Cost Optimization and Scaling", "Cloud Security Best Practices", "Infrastructure as Code (IaC)", "Major Providers: AWS vs Azure vs GCP"],
    miniProject: {
      title: "Design a Scalable Web Infrastructure",
      description: "Conceptually design a highly available web application architecture using cloud patterns like Load Balancers, Auto-scaling groups, and Multi-AZ databases.",
      steps: ["Identify application requirements", "Map components to cloud services", "Design the network architecture (VPC/Subnets)", "Configure auto-scaling policies", "Implement security layers (IAM/Security Groups)", "Document the architecture diagram"],
      language: "javascript",
      code: `console.log("☁️  Cloud Architecture Blueprint Logic");
const cloudConfig = {
  provider: "AWS",
  regions: ["us-east-1", "eu-west-1"],
  services: ["EC2", "RDS", "S3", "CloudFront"],
  autoScaling: { min: 2, max: 10, cpuThreshold: 70 }
};
console.log("Initializing scalable environment...", cloudConfig);`
    },
    skills: ["AWS", "Microsoft Azure", "Google Cloud", "Terraform", "Serverless", "Security"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: IT Fundamentals", detail: "Operating Systems, Bash, and Networking" },
      { step: "Phase 2: Provider Foundation", detail: "AWS/Azure Solutions Architect Associate track" },
      { step: "Phase 3: Automation", detail: "Infrastructure as Code (Terraform, CloudFormation)" },
      { step: "Phase 4: Optimization", detail: "FinOps, Serverless, and Advanced Security" }
    ],
    resources: [
      { title: "AWS Certified Solutions Architect Course", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", type: "Course" },
      { title: "Azure Fundamentals for Beginners", url: "https://www.youtube.com/watch?v=NPEsD6n9A_I", type: "YouTube" }
    ],
    suitability: "Perfect for those who like big-picture architecture, automation, and building reliable foundations for global apps."
  },
  {
    id: "game-development",
    name: "Game Development",
    category: "Engineering",
    icon: "🎮",
    tagline: "Build immersive virtual worlds",
    color: "#f97316",
    gradient: "from-orange-500 to-red-700",
    about: `Game Development is the art and science of creating interactive games. It combines programming, art, storytelling, sound design, and player psychology to create experiences that engage and entertain. From mobile puzzles to AAA open-world epics, game dev is a multi-billion dollar industry.

    Developers use engines like Unity (using C#) or Unreal Engine (using C++ and Blueprints) to handle physics, graphics rendering, and input. It is a highly cross-disciplinary field where technical precision meets boundless creative expression.`,
    basics: ["Game Engines and Workflows", "3D Mathematics and Physics", "Scripting and Logic (C# / C++)", "Assets: Models, Textures, and Shaders", "UI/UX Design for Games", "Audio Implementation", "Level Design and Player Flow", "Optimization and Performance", "Multiplayer Architecture", "Publishing to Platforms"],
    miniProject: {
      title: "Build a Simple Physics Playground",
      description: "Create a basic 2D scene in Unity or C# where objects collide, bounce, and interact based on gravity and user input.",
      steps: ["Set up the Game Scene", "Create Player and Obstacle objects", "Apply Rigidbody components for physics", "Write a script to handle movement", "Design a simple win/loss condition", "Test and polish gameplay feel"],
      language: "javascript",
      code: `console.log("🎮 Game Engine Initialization Script");
const playerState = { x: 0, y: 0, health: 100, isJumping: false };
function updatePhysics() {
  if (playerState.isJumping) playerState.y += 10;
  console.log("Current Position:", playerState.x, playerState.y);
}
setInterval(updatePhysics, 100);`
    },
    skills: ["Unity", "Unreal Engine", "C#", "C++", "3D Modeling", "Level Design"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Programming Basics", detail: "Logic and C# for Unity" },
      { step: "Phase 2: 2D Development", detail: "Sprites, Collisions, and Score systems" },
      { step: "Phase 3: 3D Foundations", detail: "Meshes, Lighting, and 3D Vector Math" },
      { step: "Phase 4: Game Systems", detail: "AI, Inventory, and Save systems" }
    ],
    resources: [
      { title: "Brackeys: Getting Started with Unity", url: "https://www.youtube.com/user/Brackeys", type: "YouTube" },
      { title: "Unreal Engine: Beginner Series", url: "https://www.youtube.com/c/UnrealEngine", type: "Official" }
    ],
    suitability: "Ideal for creative thinkers who love combining art, logic, and storytelling into interactive experiences."
  },
  {
    id: "devops",
    name: "DevOps",
    category: "Engineering",
    icon: "♾️",
    tagline: "Bridge the gap between Dev and Ops",
    color: "#4ade80",
    gradient: "from-green-500 to-teal-700",
    about: `DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality. 

    DevOps is complementary with Agile software development; several DevOps aspects came from the Agile methodology. Engineers in this field focus on CI/CD (Continuous Integration/Continuous Deployment), monitoring, and automated infrastructure management.`,
    basics: ["Linux System Administration", "Git and Version Control", "CI/CD Pipelines (Jenkins, GitHub Actions)", "Containerization (Docker)", "Orchestration (Kubernetes)", "Monitoring and Logging", "Cloud Providers (AWS/Azure)", "Infrastructure as Code (Terraform)", "Scripting (Bash, Python)", "SRE Principles"],
    miniProject: {
      title: "Deploy a Containerized Web App",
      description: "Learn to package a simple application into a Docker container and set up a basic automated deployment pipeline.",
      steps: ["Write a simple web app", "Create a Dockerfile", "Build and tag the Docker image", "Push to a container registry", "Configure a CI/CD pipeline", "Monitor the live deployment"],
      language: "javascript",
      code: `console.log("♾️  DevOps Automation Pipeline");
const pipeline = {
  stages: ["Build", "Test", "Deploy"],
  tools: { docker: true, k8s: true, terraform: true }
};
function runPipeline() {
  pipeline.stages.forEach(s => console.log(\`Running Stage: \${s}...\`));
  console.log("Pipeline Finished Successfully!");
}
runPipeline();`
    },
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "CI/CD"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Admin Basics", detail: "Linux CLI and Networking" },
      { step: "Phase 2: CI/CD Foundations", detail: "Git and Automation scripts" },
      { step: "Phase 3: Container Era", detail: "Docker and K8s orchestration" },
      { step: "Phase 4: Scale", detail: "IaC and Monitoring systems" }
    ],
    resources: [
      { title: "DevOps Roadmap 2024", url: "https://roadmap.sh/devops", type: "Roadmap" },
      { title: "Docker & Kubernetes Course", url: "https://www.youtube.com/watch?v=bhBSlnQcq2k", type: "YouTube" }
    ],
    suitability: "Great for individuals who love automation, efficiency, and managing complex software systems."
  },
  {
    id: "blockchain",
    name: "Blockchain",
    category: "Engineering",
    icon: "🔗",
    tagline: "Build the decentralized web",
    color: "#8b5cf6",
    gradient: "from-purple-600 to-indigo-900",
    about: `Blockchain is a decentralized, distributed ledger technology that records transactions across many computers. It is the foundation of Web3, Cryptocurrencies, and Decentralized Finance (DeFi). 

    Developers in this space build "Smart Contracts" using languages like Solidity (for Ethereum) or Rust (for Solana). It's a field at the intersection of cryptography, economics, and software engineering.`,
    basics: ["Blockchain Architecture (Nodes, Blocks, Chains)", "Consensus Mechanisms (PoW, PoS)", "Cryptography: Hashing and Public Keys", "Smart Contracts and Solidity", "Ethereum and EVM Basics", "DeFi and Tokens (ERC-20, NFT)", "Web3.js and Ethers.js", "IPFS and Decentralized Storage", "Security Auditing for Contracts", "Layer 2 Solutions"],
    miniProject: {
      title: "Issue a Simple Crypto Token",
      description: "Write and deploy a basic ERC-20 smart contract on a test network to understand how value transfers work on the blockchain.",
      steps: ["Setup Remox IDE", "Write a basic Solidity contract", "Compile the contract", "Connect to a testnet (e.g., Sepolia)", "Deploy the contract", "Verify the token on a block explorer"],
      language: "javascript",
      code: `console.log("🔗 Web3 Provider Initialized");
const contract = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  balance: "1000 LINK",
  symbol: "LNY"
};
console.log("Fetching contract data...", contract);`
    },
    skills: ["Solidity", "Rust", "Web3.js", "Cryptography", "DeFi", "Smart Contracts"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Web Foundations", detail: "JS and Frontend development" },
      { step: "Phase 2: Web3 Intro", detail: "Blockchain basics and Hashing" },
      { step: "Phase 3: Smart Contracts", detail: "Solidity and Local Testing" },
      { step: "Phase 4: Full-Stack DApp", detail: "React + Solidity Integration" }
    ],
    resources: [
      { title: "Blockchain Theory for Beginners", url: "https://www.youtube.com/watch?v=yubzJw0uiE4", type: "YouTube" },
      { title: "Learn Solidity in 2 Hours", url: "https://www.youtube.com/watch?v=ipwxYa-F1uY", type: "YouTube" }
    ],
    suitability: "Ideal for those fascinated by the future of finance, security, and decentralized systems."
  },
  {
    id: "product-management",
    name: "Product Management",
    category: "Business",
    icon: "📋",
    tagline: "Define the 'What' and 'Why'",
    color: "#f43f5e",
    gradient: "from-rose-500 to-red-800",
    about: `Product Management is the organizational function that guides every step of a product’s lifecycle—from development to positioning and pricing—by focusing on the product and its customers first and foremost. 

    Product managers (PMs) advocate for customers within the organization and ensure that the business builds what is needed. They balance the needs of users, the goals of the business, and the capabilities of the technology team.`,
    basics: ["Agile and Scrum Methodologies", "User Stories and Requirements", "Product Roadmap Planning", "Market Research and Competitor Analysis", "Prioritization Frameworks (RICE, Kano)", "Stakeholder Management", "MVP (Minimum Viable Product) Definition", "Product Analytics and KPIs", "A/B Testing and User Feedback", "Design Thinking for PMs"],
    miniProject: {
      title: "Write a Product Requirement Document (PRD)",
      description: "Draft a comprehensive PRD for a new app feature, defining the problem, user goals, functional requirements, and success metrics.",
      steps: ["Identify a specific user problem", "Draft the 'Problem Statement'", "Define a 'Solution Hypothesis'", "List core functional requirements", "Set 3 clear KPIs for success", "Seek feedback and iterate"],
      language: "javascript",
      code: `console.log("📋 Product Requirement Analysis");
const feature = {
  name: "Dark Mode 2.0",
  priority: "High",
  kpis: ["Retention", "Active Minutes"],
  mvpReady: true
};
console.log("Feature Spec Initialized:", feature);`
    },
    skills: ["Agile", "Scrum", "Jira", "Strategy", "User Research", "Prioritization"],
    vmType: "creator",
    roadmap: [
      { step: "Phase 1: PM Fundamentals", detail: "Problem solving and Communications" },
      { step: "Phase 2: Execution", detail: "Sprints, Jira, and Scrum ceremonies" },
      { step: "Phase 3: Strategy", detail: "Market fit and Product-led growth" },
      { step: "Phase 4: Leadership", detail: "Vision, Roadmapping, and Team Scale" }
    ],
    resources: [
      { title: "Product School: PM Basics", url: "https://www.youtube.com/c/ProductSchoolSanFrancisco", type: "YouTube" },
      { title: "The Modern Product Manager", url: "https://www.modernproductmanager.com/", type: "Platform" }
    ],
    suitability: "Perfect for strategic thinkers who love leadership, empathy, and organizing complex ideas into reality."
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    category: "Engineering",
    icon: "🧩",
    tagline: "The core of efficient computation",
    color: "#fbbf24",
    gradient: "from-yellow-400 to-amber-600",
    about: `Data Structures and Algorithms (DSA) form the foundation of computer science. Data structures are ways of organizing and storing data so that it can be accessed and modified efficiently. Algorithms are step-by-step procedures for calculations, data processing, and automated reasoning.

    Mastering DSA is essential for becoming a top-tier software engineer and is the primary focus of technical interviews at major tech companies (FAANG). It's about learning to solve complex problems with optimal time and space complexity.`,
    basics: ["Big O Notation and Complexity", "Arrays and Strings", "Linked Lists (Single, Double)", "Stacks and Queues", "Trees (Binary, BST, AVL)", "Graphs and Traversal (BFS, DFS)", "Hash Tables and Maps", "Recursion and Backtracking", "Sorting and Searching", "Dynamic Programming"],
    miniProject: {
      title: "Analyze Algorithm Efficiency",
      description: "Measure the time complexity of different sorting algorithms (like Bubble Sort vs. Quick Sort) to understand how performance scales with data size.",
      steps: ["Implement two different sorting algorithms", "Generate datasets of varying sizes (100, 1000, 10000 items)", "Record execution time for each", "Graph the results to visualize complexity", "Summarize findings in terms of Big O"],
      language: "python",
      code: `import time
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

test_data = list(range(100, 0, -1))
start = time.time()
bubble_sort(test_data)
print(f"Sorted 100 items in {time.time() - start:.6f}s")`
    },
    skills: ["Complexity Analysis", "Sorting", "Graphs", "Dynamic Programming", "Trees", "Optimization"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Math Foundations", detail: "Logarithms, Series, and Basic Logic" },
      { step: "Phase 2: Linear Data", detail: "Arrays, Lists, Stacks, and Queues" },
      { step: "Phase 3: Nonlinear Data", detail: "Trees, Graphs, and Hash Maps" },
      { step: "Phase 4: Advanced Alg", detail: "Greedy, DP, and String Matching" }
    ],
    resources: [
      { title: "GeeksforGeeks: DSA Roadmap", url: "https://www.geeksforgeeks.org/data-structures-and-algorithms-dsa-roadmap/", type: "Roadmap" },
      { title: "NeetCode: LeetCode Practice", url: "https://neetcode.io/", type: "Practice" }
    ],
    suitability: "Mandatory for anyone aiming for senior engineering roles or high-performance systems development."
  },
  {
    id: "iot",
    name: "Internet of Things (IoT)",
    category: "Engineering",
    icon: "📟",
    tagline: "Connect the physical and digital worlds",
    color: "#2dd4bf",
    gradient: "from-teal-400 to-cyan-700",
    about: `The Internet of Things (IoT) describes the network of physical objects—"things"—that are embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the internet.

    This field ranges from ordinary household objects like smart thermostats and security cameras to sophisticated industrial tools. IoT developers must understand hardware (sensors, microcontrollers like Arduino/Raspberry Pi) and software (networking, MQTT, cloud integration).`,
    basics: ["Embedded Systems Fundamentals", "Sensors and Actuators", "Communication Protocols (MQTT, HTTP, CoAP)", "Arduino and Raspberry Pi", "Edge Computing vs Cloud", "Power Management for IoT", "Security in Connected Devices", "Data Analytics for Sensor Data", "Home Automation Standards", "IIoT (Industrial IoT)"],
    miniProject: {
      title: "Build a Virtual Smart Thermostat",
      description: "Simulate an IoT device that reads temperature data, transmits it to a gateway, and triggers an alert if thresholds are exceeded.",
      steps: ["Mock a temperature sensor sensor", "Define a threshold (e.g., 25°C)", "Implement a processing loop", "Simulate a data push to a cloud API", "Design an alert notification system", "Log the device status over time"],
      language: "javascript",
      code: `console.log("📟 IoT Device Gateway Initialized");
let temperature = 22;
function pollSensor() {
  temperature += (Math.random() - 0.5) * 5;
  console.log(\`Current Temp: \${temperature.toFixed(2)}°C\`);
  if (temperature > 28) console.warn("🚨 [ALERT] Overheating detected!");
}
setInterval(pollSensor, 2000);`
    },
    skills: ["Embedded C", "Python", "MQTT", "Hardware", "Networking", "Security"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Electronics 101", detail: "Circuits, Voltages, and Components" },
      { step: "Phase 2: Microcontrollers", detail: "Arduino and ESP32 programming" },
      { step: "Phase 3: Connectivity", detail: "Wi-Fi, Bluetooth, and LoRaWAN" },
      { step: "Phase 4: IoT Platforms", detail: "AWS IoT, ThingSpeak, and Dashboarding" }
    ],
    resources: [
      { title: "Arduino: Official Hub", url: "https://www.arduino.cc/", type: "Official" },
      { title: "IoT for Beginners (Microsoft)", url: "https://github.com/microsoft/IoT-For-Beginners", type: "Course" }
    ],
    suitability: "Ideal for hardware hackers and tinkerers who love making physical things 'smart' and connected."
  },
  {
    id: "mobile-dev",
    name: "Mobile App Development",
    category: "Engineering",
    icon: "📱",
    tagline: "Build apps for the palm of the hand",
    color: "#38bdf8",
    gradient: "from-sky-400 to-indigo-600",
    about: `Mobile Application Development is the set of processes and procedures involved in writing software for small, wireless computing devices, such as smartphones and tablets. 

    Developers specify in Native development (Swift for iOS, Kotlin for Android) or Cross-Platform development (React Native, Flutter) to build apps that leverage device hardware like cameras, GPS, and sensors. It is one of the most high-demand skills in the modern economy.`,
    basics: ["Mobile UI Patterns and UX", "Native vs Cross-Platform", "React Native and Flutter Basics", "Swift (iOS) and Kotlin (Android) Intro", "State Management in Mobile", "Consuming REST APIs", "Device Hardware Access (Camera, GPS)", "Offline Storage and Sync", "App Store & Play Store Guidelines", "Mobile App Security"],
    miniProject: {
      title: "Build a 'Daily Tasks' Mobile UI",
      description: "Create a responsive mobile app interface for a task manager, focusing on touch interactions, lists, and form inputs.",
      steps: ["Mockup the UI in a mobile frame", "Implement a scrollable List component", "Create an 'Add Task' modal", "Handle device-specific safe areas", "Add haptic feedback simulations", "Test on multiple viewport sizes"],
      language: "javascript",
      code: `console.log("📱 Mobile Runtime Initialized");
const appState = { tasks: [], user: "Learner" };
function addTask(title) {
  appState.tasks.push({ id: Date.now(), title, done: false });
  console.log("Task Added. Total:", appState.tasks.length);
}
addTask("Master React Native");`
    },
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI", "Firebase"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: Web Foundations", detail: "HTML, CSS, and Modern JavaScript" },
      { step: "Phase 2: Framework Mastery", detail: "React Native or Flutter basics" },
      { step: "Phase 3: Device Native", detail: "Camera, Storage, and Push Notifications" },
      { step: "Phase 4: Store Ready", detail: "Performance, Testing, and App Store Optimization" }
    ],
    resources: [
      { title: "React Native: Official Docs", url: "https://reactnative.dev/", type: "Official" },
      { title: "Flutter: Complete Course", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", type: "YouTube" }
    ],
    suitability: "Excellent for developers who want to build products that people use every single day on their personal devices."
  },
  {
    id: "ar-vr",
    name: "AR/VR Development",
    category: "Engineering",
    icon: "🥽",
    tagline: "Create the future of reality",
    color: "#ec4899",
    gradient: "from-pink-500 to-indigo-800",
    about: `Augmented Reality (AR) and Virtual Reality (VR) are technologies that either enhance the real world with digital overlays or create entirely immersive digital environments. 

    Developers use engines like Unity and Unreal, along with frameworks like ARKit (iOS), ARCore (Android), and OpenXR, to build experiences for headsets like Meta Quest, Apple Vision Pro, and mobile devices. It is the frontier of human-computer interaction.`,
    basics: ["AR vs VR vs Mixed Reality (MR)", "Spatial Computing Concepts", "Unity for XR Development", "3D Interaction Design", "Hand Tracking and Controllers", "World Tracking and Anchors", "Performance Optimization for XR", "Spatial Audio Principles", "Prototyping in ShapesXR", "Hardware: Quest vs Vision Pro"],
    miniProject: {
      title: "Design a 3D Interactive Gallery",
      description: "Create a virtual space where users can walk around, look at 3D objects, and trigger informational popups when interacting with them.",
      steps: ["Setup a 3D environment with Lighting", "Import 3D models of artifacts", "Configure a 'Player Controller' for VR", "Implement 'Ray Interaction' for selection", "Animate informational UI elements", "Optimize for high frame rates"],
      language: "javascript",
      code: `console.log("🥽 XR Spatial Runtime Active");
const spatialCoords = { x: 1.2, y: 0, z: -3.5 };
function onInteraction(id) {
  console.log(\`Object \${id} selected in 3D space at:\`, spatialCoords);
}
onInteraction("artifact_01");`
    },
    skills: ["Unity", "C#", "ARKit", "ARCore", "Spatial UI", "3D Modeling"],
    vmType: "terminal",
    roadmap: [
      { step: "Phase 1: 3D Foundations", detail: "Vectors, Quaternions, and 3D Modeling" },
      { step: "Phase 2: Unity XR", detail: "XR Interaction Toolkit and Passthrough" },
      { step: "Phase 3: Spatial Design", detail: "Immersive UI and Spatial Audio" },
      { step: "Phase 4: Optimization", detail: "Draw calls, Batching, and XR Performance" }
    ],
    resources: [
      { title: "Unity Learn: VR Development", url: "https://learn.unity.com/pathway/vr-development", type: "Official" },
      { title: "Circuit Stream: XR Workshop", url: "https://circuitstream.com/", type: "Platform" }
    ],
    suitability: "Perfect for visionaries and gamers who want to build 'the metaverse' or new ways to see the physical world."
  },
];

export const getDomainById = (id) => domains.find((d) => d.id === id);
