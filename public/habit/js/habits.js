// =========================================
// HABITS.JS — Data Layer
// =========================================

const STORAGE_KEY = 'habitTracker_v2';
const XP_KEY = 'habitTracker_xp';

const HabitsDB = {
  // Cloud Auth
  currentUser: null,
  
  // Load initial data (local as fallback)
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { habits: [], history: {} };
    } catch { return { habits: [], history: {} }; }
  },

  async syncCloud() {
    if (!this.currentUser) return;
    try {
      const data = this.load();
      const xp = this.getXP();
      await db.collection("users").doc(this.currentUser.uid).set({
        habits: data.habits,
        habitsHistory: data.history,
        habitsXP: xp
      }, { merge: true });
    } catch (e) {
      console.error("Cloud Sync Error:", e);
    }
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this.syncCloud();
  },

  getAll() {
    return this.load().habits;
  },

  getById(id) {
    return this.getAll().find(h => h.id === id);
  },

  add(habit) {
    const data = this.load();
    const newHabit = {
      id: 'h_' + Date.now(),
      name: habit.name || 'New Habit',
      emoji: habit.emoji || '⭐',
      goal: parseInt(habit.goal) || 1,
      color: habit.color || '#3b82f6',
      category: habit.category || 'General',
      reminder: habit.reminder || '',
      targetDate: habit.targetDate || null, // null means recurring/daily
      count: 0,
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
      completedDates: [],
      ...habit,
    };
    data.habits.push(newHabit);
    this.save(data);
    return newHabit;
  },

  update(id, updates) {
    const data = this.load();
    const idx = data.habits.findIndex(h => h.id === id);
    if (idx !== -1) {
      data.habits[idx] = { ...data.habits[idx], ...updates };
      this.save(data);
      return data.habits[idx];
    }
    return null;
  },

  delete(id) {
    const data = this.load();
    data.habits = data.habits.filter(h => h.id !== id);
    this.save(data);
  },

  // Progress for today
  getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  getTodayProgress(habitId) {
    const data = this.load();
    const key = this.getTodayKey();
    return (data.history[key] && data.history[key][habitId]) || 0;
  },

  setTodayProgress(habitId, count) {
    const data = this.load();
    const key = this.getTodayKey();
    if (!data.history[key]) data.history[key] = {};
    data.history[key][habitId] = count;

    // Update streak
    const habit = data.habits.find(h => h.id === habitId);
    if (habit) {
      const completed = count >= habit.goal;
      const wasCompleted = habit.completedDates && habit.completedDates.includes(key);

      if (completed && !wasCompleted) {
        habit.completedDates = habit.completedDates || [];
        habit.completedDates.push(key);
        habit.streak = this._calcStreak(habit.completedDates);
        habit.longestStreak = Math.max(habit.streak, habit.longestStreak || 0);
      } else if (!completed && wasCompleted) {
        habit.completedDates = (habit.completedDates || []).filter(d => d !== key);
        habit.streak = this._calcStreak(habit.completedDates);
      }
    }

    this.save(data);
  },

  _calcStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  },

  getWeekHistory(habitId) {
    const data = this.load();
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = (data.history[key] && data.history[key][habitId]) || 0;
      const habit = data.habits.find(h => h.id === habitId);
      week.push({
        date: key,
        count,
        completed: habit ? count >= habit.goal : false,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        num: d.getDate()
      });
    }
    return week;
  },

  getMonthHistory(habitId, monthOffset = 0) {
    const data = this.load();
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = [];
    const habit = data.habits.find(h => h.id === habitId);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().split('T')[0];
      const count = (data.history[key] && data.history[key][habitId]) || 0;
      result.push({
        date: key,
        day: d,
        count,
        completed: habit ? count >= habit.goal : false,
        weekday: date.getDay()
      });
    }
    return result;
  },

  getHeatmapData(habitId) {
    const data = this.load();
    const habit = data.habits.find(h => h.id === habitId);
    const result = {};
    const now = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = (data.history[key] && data.history[key][habitId]) || 0;
      const level = !habit ? 0 : count === 0 ? 0 : count >= habit.goal ? 4 : count >= habit.goal * 0.75 ? 3 : count >= habit.goal * 0.5 ? 2 : 1;
      result[key] = level;
    }
    return result;
  },

  getAllHeatmapData() {
    const data = this.load();
    const result = {};
    const now = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayHistory = data.history[key] || {};
      const habits = data.habits;
      if (!habits.length) { result[key] = 0; continue; }
      const completed = habits.filter(h => (dayHistory[h.id] || 0) >= h.goal).length;
      const ratio = completed / habits.length;
      result[key] = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 1 ? 3 : 4;
    }
    return result;
  },

  // XP & Level System
  getXP() {
    try { return JSON.parse(localStorage.getItem(XP_KEY)) || { xp: 0, level: 1 }; }
    catch { return { xp: 0, level: 1 }; }
  },

  addXP(amount) {
    const xpData = this.getXP();
    xpData.xp += amount;
    const lvl = Math.floor(xpData.xp / 100) + 1;
    const leveledUp = lvl > xpData.level;
    xpData.level = lvl;
    localStorage.setItem(XP_KEY, JSON.stringify(xpData));
    this.syncCloud();
    return { ...xpData, leveledUp };
  },

  getTodayStats(dateKey = null) {
    const today = dateKey || this.getTodayKey();
    const data = this.load();
    const dayHistory = data.history[today] || {};

    // Filter habits for this specific date
    const habits = data.habits.filter(h => !h.targetDate || h.targetDate === today);

    const total = habits.length;
    const completed = habits.filter(h => (dayHistory[h.id] || 0) >= h.goal).length;
    const totalStreak = habits.reduce((a, h) => a + (h.streak || 0), 0);
    const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);

    return { total, completed, totalStreak, bestStreak, percentage: total ? Math.round((completed / total) * 100) : 0 };
  }
};

// Initialize Cloud Connection
HabitsDB.initCloudSync = function (onUpdate) {
  if (typeof firebase !== 'undefined') {
    auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      if (user) {
        console.log("Habit Tracker: Connected as", user.email);
        try {
          const doc = await db.collection("users").doc(user.uid).get();
          if (doc.exists) {
            const data = doc.data();
            const local = this.load();
            
            // Merge or overwrite if cloud exists
            if (data.habits) local.habits = data.habits;
            if (data.habitsHistory) local.history = data.habitsHistory;
            
            this.save(local);
            
            if (data.habitsXP) {
               localStorage.setItem(XP_KEY, JSON.stringify(data.habitsXP));
            }
            
            // Refresh UI
            if (onUpdate) onUpdate();
          }
        } catch (err) {
          console.error("Error fetching cloud habits:", err);
        }
      } else {
         // Optionally handle logged out state
      }
    });
  }
};

// Export
window.HabitsDB = HabitsDB;
