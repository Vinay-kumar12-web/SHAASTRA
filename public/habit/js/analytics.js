// =========================================
// ANALYTICS.JS — Charts & Stats
// =========================================

const Analytics = {
  charts: {},

  init() {
    this.setupChartDefaults();
  },

  setupChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = '#5a5450';
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  },

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  },

  renderWeeklyChart(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const habits = HabitsDB.getAll();
    const labels = [];
    const dataCompleted = [];
    const dataTotal = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en', { weekday: 'short' }));

      const data = HabitsDB.load();
      const dayH = data.history[key] || {};
      const comp = habits.filter(h => (dayH[h.id] || 0) >= h.goal).length;
      dataCompleted.push(comp);
      dataTotal.push(habits.length);
    }

    this.charts[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completed',
            data: dataCompleted,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Total',
            data: dataTotal,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#a09890', font: { size: 12 }, boxWidth: 10, boxHeight: 10 }
          },
          tooltip: {
            backgroundColor: '#1e1e1e',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f0ece6',
            bodyColor: '#a09890',
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#5a5450' },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#5a5450', stepSize: 1 },
            border: { display: false },
            min: 0
          }
        }
      }
    });
  },

  renderCompletionRadar(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const habits = HabitsDB.getAll().slice(0, 6);
    if (!habits.length) return;

    const data = HabitsDB.load();
    const todayKey = HabitsDB.getTodayKey();
    const dayH = data.history[todayKey] || {};

    const values = habits.map(h => {
      const count = dayH[h.id] || 0;
      return Math.min(100, Math.round((count / h.goal) * 100));
    });

    this.charts[canvasId] = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: habits.map(h => h.emoji + ' ' + h.name.slice(0, 10)),
        datasets: [{
          label: "Today's Progress",
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e1e1e',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f0ece6',
            bodyColor: '#a09890',
            callbacks: { label: ctx => ctx.raw + '%' }
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            ticks: { display: false },
            pointLabels: { color: '#5a5450', font: { size: 11 } },
            suggestedMin: 0,
            suggestedMax: 100,
          }
        }
      }
    });
  },

  renderMonthlyLine(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const data = HabitsDB.load();
    const habits = HabitsDB.getAll();
    const labels = [];
    const completedData = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(now.getFullYear(), now.getMonth(), d);
      if (date > now) break;
      const key = date.toISOString().split('T')[0];
      labels.push(d);
      const dayH = data.history[key] || {};
      const comp = habits.filter(h => (dayH[h.id] || 0) >= h.goal).length;
      completedData.push(habits.length ? Math.round((comp / habits.length) * 100) : 0);
    }

    this.charts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Completion %',
          data: completedData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 3,
          pointHoverRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e1e1e',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f0ece6',
            bodyColor: '#a09890',
            callbacks: { label: ctx => ctx.raw + '% completed' }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#5a5450' },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#5a5450', callback: v => v + '%' },
            border: { display: false },
            min: 0, max: 100,
          }
        }
      }
    });
  },

  renderHabitBreakdown(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const habits = HabitsDB.getAll();
    if (!habits.length) return;

    const data = HabitsDB.load();
    const todayKey = HabitsDB.getTodayKey();
    const dayH = data.history[todayKey] || {};

    const completedHabits = habits.filter(h => (dayH[h.id] || 0) >= h.goal);
    const incomplete = habits.length - completedHabits.length;

    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

    this.charts[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: habits.map(h => h.emoji + ' ' + h.name),
        datasets: [{
          data: habits.map(h => {
            const count = dayH[h.id] || 0;
            return Math.min(100, Math.round((count / h.goal) * 100));
          }),
          backgroundColor: habits.map((_, i) => colors[i % colors.length] + 'cc'),
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 2,
          hoverBorderColor: '#1e1e1e',
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#a09890', font: { size: 12 }, boxWidth: 10, boxHeight: 10, padding: 12 }
          },
          tooltip: {
            backgroundColor: '#1e1e1e',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f0ece6',
            bodyColor: '#a09890',
            callbacks: { label: ctx => ctx.raw + '% progress' }
          }
        }
      }
    });
  },

  // AI Suggestions
  async getAISuggestions(goal) {
    const prompt = `A user wants to achieve: "${goal}". Suggest exactly 5 specific daily habits to help them. Reply ONLY with a JSON array like: [{"name": "habit name", "emoji": "emoji", "goal": number, "category": "category"}]. No explanation, pure JSON.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content.map(b => b.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      return [
        { name: "Morning Meditation", emoji: "🧘", goal: 1, category: "Wellness" },
        { name: "Read 30 minutes", emoji: "📚", goal: 1, category: "Learning" },
        { name: "Exercise", emoji: "💪", goal: 1, category: "Fitness" },
        { name: "Drink water", emoji: "💧", goal: 8, category: "Health" },
        { name: "Journal", emoji: "✍️", goal: 1, category: "Mindfulness" }
      ];
    }
  }
};

window.Analytics = Analytics;
