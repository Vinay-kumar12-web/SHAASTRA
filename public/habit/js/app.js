// =========================================
// APP.JS — Main Application Controller
// =========================================

const App = {
  // Local date key helper: YYYY-MM-DD in LOCAL timezone (avoids UTC shift)
  _localDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  currentPage: 'dashboard',
  editingHabitId: null,
  contextMenuTarget: null,
  selectedEmoji: '⭐',
  selectedColor: '#f43c00',
  pomodoroState: { running: false, mode: 'work', timeLeft: 25 * 60, total: 25 * 60, interval: null },
  calendarOffset: 0,
  get selectedDate() {
    return this._selectedDate || this._localDateKey(new Date());
  },
  set selectedDate(v) {
    this._selectedDate = v;
  },

  init() {
    this.bindNavigation();
    this.bindTopbar();
    this.bindModal();
    this.bindContextMenu();
    this.bindPomodoro();
    this.updateDate();
    this.checkNotificationPermission();
    this.scheduleReminders();
    this.navigateTo('dashboard');
    Analytics.init();
    
    // Connect to Firebase Cloud Database for real-time habit syncing
    if (typeof HabitsDB !== "undefined" && HabitsDB.initCloudSync) {
      HabitsDB.initCloudSync(() => this.renderDashboard());
    }

    setInterval(() => this.updateDate(), 60000);
  },

  // =========================================
  // NAVIGATION
  // =========================================
  bindNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => this.navigateTo(item.dataset.page));
    });
  },

  navigateTo(page) {
    this.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const pageEl = document.getElementById('page-' + page);
    const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);

    if (pageEl) pageEl.classList.add('active');
    if (navEl) navEl.classList.add('active');

    const pageActions = {
      dashboard: () => this.renderDashboard(),
      analytics: () => this.renderAnalytics(),
      history: () => this.renderHistory(),
      achievements: () => this.renderAchievements(),
      settings: () => this.renderSettings(),
    };

    if (pageActions[page]) pageActions[page]();
  },

  // =========================================
  // TOPBAR
  // =========================================
  bindTopbar() {
    document.getElementById('btn-add-habit')?.addEventListener('click', () => this.openModal());
  },

  updateDate() {
    this.updateTopbarDate();
  },

  // Central helper — always reads from this.selectedDate
  updateTopbarDate() {
    const el = document.getElementById('topbar-date');
    if (!el) return;
    // Append time to avoid UTC-to-local shift
    const d = new Date(this.selectedDate + 'T00:00:00');
    el.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  },

  // =========================================
  // DASHBOARD
  // =========================================
  renderDashboard() {
    this.renderCalendarStrip();
    this.renderHabits();
    this.updateBanner();
  },

  updateBanner() {
    const stats = HabitsDB.getTodayStats(this.selectedDate);
    const el = document.getElementById('banner-completed');
    const bannerEl = document.getElementById('banner-total');
    const streakEl = document.getElementById('banner-streak');
    const pctEl = document.getElementById('banner-pct');
    const ringFill = document.getElementById('banner-ring-fill');

    if (el) el.textContent = stats.completed;
    if (bannerEl) bannerEl.textContent = stats.total;
    if (streakEl) streakEl.textContent = stats.totalStreak + '🔥';
    if (pctEl) pctEl.textContent = stats.percentage + '%';

    if (ringFill) {
      const r = 34, c = 2 * Math.PI * r;
      ringFill.setAttribute('stroke-dasharray', c);
      ringFill.setAttribute('stroke-dashoffset', c - (stats.percentage / 100) * c);
    }
  },

  renderCalendarStrip() {
    const container = document.getElementById('week-days-container');
    if (!container) return;

    const days = [];
    const today = new Date();

    for (let i = 6 + this.calendarOffset; i >= 0 + this.calendarOffset; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.unshift(d);
    }

    const habits = HabitsDB.getAll();
    const data = HabitsDB.load();
    const todayKey = this._localDateKey(today);

    container.innerHTML = days.map(d => {
      const key = this._localDateKey(d);
      const isToday = key === todayKey;
      const dayH = data.history[key] || {};
      const completed = habits.length > 0 && habits.every(h => (dayH[h.id] || 0) >= h.goal);
      const partial = !completed && habits.some(h => (dayH[h.id] || 0) > 0);

      let cls = 'day-cell';
      if (isToday) cls += ' today';
      else if (completed) cls += ' completed';

      return `<div class="${cls}" data-date="${key}">
        <span class="day-label">${d.toLocaleDateString('en', { weekday: 'short' })}</span>
        <span class="day-num">${d.getDate()}</span>
        <div class="day-indicator"></div>
      </div>`;
    }).join('');

    container.querySelectorAll('.day-cell').forEach(cell => {
      if (cell.dataset.date === this.selectedDate) cell.classList.add('selected');

      cell.addEventListener('click', () => {
        container.querySelectorAll('.day-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        this.selectedDate = cell.dataset.date;
        this.renderHabits();
        this.updateBanner();
        this.updateTopbarDate(); // Sync topbar date
        this.showDayChip(cell); // Tiny inline chip instead of toast
      });
    });
  },

  onDatePicked(dateString) {
    if (!dateString) return;
    this.selectedDate = dateString;
    const diff = Math.floor((new Date() - new Date(dateString + 'T00:00:00')) / (1000 * 60 * 60 * 24));
    this.calendarOffset = Math.max(-60, diff);
    this.renderDashboard();
    this.updateTopbarDate(); // Sync topbar
  },

  // Show a tiny glassmorphism chip anchored near the clicked cell
  showDayChip(cell) {
    // Remove any existing chip
    const old = document.getElementById('day-chip');
    if (old) old.remove();

    const d = new Date(this.selectedDate + 'T00:00:00');
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const isToday = this.selectedDate === HabitsDB.getTodayKey();

    const chip = document.createElement('div');
    chip.id = 'day-chip';
    chip.textContent = (isToday ? '★ Today — ' : '📅 ') + label;
    chip.className = 'day-chip';
    document.body.appendChild(chip);

    // Position near cell
    const rect = cell.getBoundingClientRect();
    chip.style.top  = (rect.bottom + window.scrollY + 6) + 'px';
    chip.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 180) + 'px';

    // Auto remove after 1.8s
    setTimeout(() => {
      chip.classList.add('day-chip-out');
      setTimeout(() => chip.remove(), 300);
    }, 1800);
  },

  renderHabits() {
    const grid = document.getElementById('habits-grid');
    if (!grid) return;

    // Filter habits: Recurring OR specific to this date
    const allHabits = HabitsDB.getAll();
    const habits = allHabits.filter(h => !h.targetDate || h.targetDate === this.selectedDate);

    if (!habits.length) {
      const isFuture = this.selectedDate > HabitsDB.getTodayKey();
      grid.innerHTML = `<div class="empty-state">
        <span class="empty-state-icon">${isFuture ? '📅' : '🌱'}</span>
        <h3>${isFuture ? 'No plans for this day' : 'No habits yet'}</h3>
        <p>${isFuture ? 'Start planning your future tasks.' : 'Start building your routines.'}</p>
        <button class="btn-save" style="display:inline-block;padding:10px 24px;border-radius:10px;cursor:pointer;border:none;width:auto" onclick="App.openModalForSelectedDate()">
          ${isFuture ? '+ Plan for this day' : '+ Add First Habit'}
        </button>
      </div>`;
      return;
    }

    grid.innerHTML = habits.map((h, idx) => this.renderHabitCard(h, idx)).join('');

    // Add "Plan more" button if viewing future
    if (this.selectedDate > HabitsDB.getTodayKey()) {
      const btn = document.createElement('div');
      btn.className = 'habit-card plan-extra';
      btn.style.cssText = 'border: 2px dashed rgba(255,255,255,0.1); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; min-height: 100px; order: 999;';
      btn.innerHTML = `<div style="text-align:center; opacity: 0.6;">
         <div style="font-size:24px; margin-bottom:4px;">➕</div>
         <div style="font-size:12px; font-weight:600;">Plan more for this day</div>
       </div>`;
      btn.onclick = () => this.openModalForSelectedDate();
      grid.appendChild(btn);
    }

    this.bindCardControls();
  },

  openModalForSelectedDate() {
    this.openModal();
    // Add a hidden info or just set a temporary property
    this.modalTargetDate = this.selectedDate === HabitsDB.getTodayKey() ? null : this.selectedDate;
  },

  renderHabitCard(habit, idx) {
    const isToday = this.selectedDate === HabitsDB.getTodayKey();
    const data = HabitsDB.load();
    const dayH = data.history[this.selectedDate] || {};
    const count = dayH[habit.id] || 0;

    const pct = Math.min(100, Math.round((count / habit.goal) * 100));
    const completed = count >= habit.goal;
    const weekHistory = HabitsDB.getWeekHistory(habit.id);

    const r = 56, c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    const streak = habit.streak || 0;
    const todayCount = count; // Fixed reference

    const weekDots = weekHistory.map((d, i) => {
      let cls = 'week-dot';
      if (d.completed) cls += ' done';
      else if (d.count > 0) cls += ' partial';
      const isToday = i === weekHistory.length - 1;
      if (isToday && !d.completed) cls += ' today';
      return `<div class="${cls}" title="${d.date}"></div>`;
    }).join('');

    return `<div class="habit-card${completed ? ' completed' : ''}" data-id="${habit.id}" style="animation-delay:${idx * 0.06}s">
      <div class="card-header">
        <div class="card-category">
          <div class="category-dot" style="background:${habit.color || '#3b82f6'}"></div>
          <span class="category-label">${habit.category || 'General'}</span>
        </div>
        <button class="card-menu-btn" data-id="${habit.id}">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
      </div>
      
      <div class="card-body">
        <div class="habit-name" style="margin-bottom:4px">${habit.emoji || '⭐'} ${habit.name}</div>
        <div style="font-size:10px; color:var(--text-muted); margin-bottom:12px; font-weight:500; opacity:0.7">
          Created ${new Date(habit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div class="streak-badge${streak === 0 ? ' cold' : ''}" style="margin-bottom:16px;">
          <span class="flame">${streak > 0 ? '🔥' : '💤'}</span>
          <span>${streak} day${streak !== 1 ? 's' : ''}</span>
        </div>
        
        <div class="ring-row" style="flex-direction:column; gap:12px;">
          <div class="progress-ring-container">
            <div class="ring-inner-glow"></div>
            <svg class="progress-ring-svg" viewBox="0 0 140 140">
              <circle class="progress-ring-bg" cx="70" cy="70" r="${r}"/>
              <circle class="progress-ring-fill${completed ? ' completed' : ''}" 
                cx="70" cy="70" r="${r}"
                stroke="${completed ? '#22c55e' : (habit.color || '#f59e0b')}"
                stroke-dasharray="${c}"
                stroke-dashoffset="${offset}"
              />
            </svg>
            <div class="ring-center">
              <span class="ring-value">${todayCount}</span>
              <span class="ring-goal">/ ${habit.goal}</span>
              <span class="ring-percent" style="display:none">${pct}%</span>
            </div>
          </div>

          <button class="timer-trigger-btn" data-id="${habit.id}" 
            style="background: ${habit.color}15; border: 1px solid ${habit.color}40; color: ${habit.color}; 
            padding: 10px 24px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-family: var(--font-main); transition: var(--transition); width: 100%; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            START FOCUS
          </button>
        </div>

        <div class="bottom-controls">
          <button class="ctrl-icon-btn done" data-id="${habit.id}" data-action="done" title="Complete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          </button>
          <button class="ctrl-icon-btn return" data-id="${habit.id}" data-action="reset" title="Undo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>
      </div>

      <div class="card-footer">
        <div class="card-reminder">
          ${habit.reminder ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span>${habit.reminder}</span>` : '<span style="opacity:0.4">No reminder</span>'}
        </div>
        <div class="card-week-dots">${weekDots}</div>
      </div>
    </div>`;
  },

  bindCardControls() {
    document.querySelectorAll('.timer-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerHabitTimer(btn.dataset.id);
      });
    });

    document.querySelectorAll('.ctrl-icon-btn[data-action="reset"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetHabit(btn.dataset.id);
      });
    });

    document.querySelectorAll('.ctrl-icon-btn[data-action="done"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.completeHabit(btn.dataset.id);
      });
    });

    document.querySelectorAll('.card-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showContextMenu(e, btn.dataset.id);
      });
    });
  },

  // =========================================
  // HABIT ACTIONS
  // =========================================
  incrementHabit(id) {
    const habit = HabitsDB.getById(id);
    if (!habit) return;

    const data = HabitsDB.load();
    const dayH = data.history[this.selectedDate] || {};
    const current = dayH[id] || 0;

    const newCount = current + 1;

    // Save locally
    if (!data.history[this.selectedDate]) data.history[this.selectedDate] = {};
    data.history[this.selectedDate][id] = newCount;

    // Only update streak if it's today
    if (this.selectedDate === HabitsDB.getTodayKey()) {
      const completed = newCount >= habit.goal;
      const wasCompleted = habit.completedDates && habit.completedDates.includes(this.selectedDate);
      if (completed && !wasCompleted) {
        habit.completedDates = habit.completedDates || [];
        habit.completedDates.push(this.selectedDate);
        habit.streak = HabitsDB._calcStreak(habit.completedDates);
        habit.longestStreak = Math.max(habit.streak, habit.longestStreak || 0);
      }
    }

    HabitsDB.save(data);

    const xp = HabitsDB.addXP(5);
    this.animateRing(id);

    if (newCount >= habit.goal && current < habit.goal) {
      this.showToast('🎉', 'Goal Reached!', `${habit.emoji} ${habit.name} done!`, 'success');
      this.triggerConfetti(id);
      HabitsDB.addXP(20);
    } else {
      this.showToast('➕', 'Progress Updated', `${newCount}/${habit.goal} — Keep going!`);
    }

    if (xp.leveledUp) {
      setTimeout(() => this.showToast('⭐', `Level Up!`, `You reached Level ${xp.level}! 🚀`, 'success'), 500);
    }

    this.updateCardUI(id);
    this.updateBanner();
  },

  decrementHabit(id) {
    const data = HabitsDB.load();
    const dayH = data.history[this.selectedDate] || {};
    const current = dayH[id] || 0;
    if (current <= 0) return;

    data.history[this.selectedDate][id] = current - 1;
    HabitsDB.save(data);

    this.updateCardUI(id);
    this.updateBanner();
  },

  resetHabit(id) {
    const data = HabitsDB.load();
    if (!data.history[this.selectedDate]) data.history[this.selectedDate] = {};
    data.history[this.selectedDate][id] = 0;
    HabitsDB.save(data);

    this.showToast('🔄', 'Reset', 'Progress reset to 0');
    this.updateCardUI(id);
    this.updateBanner();
  },

  completeHabit(id) {
    const habit = HabitsDB.getById(id);
    if (!habit) return;

    const data = HabitsDB.load();
    if (!data.history[this.selectedDate]) data.history[this.selectedDate] = {};
    const wasCompleted = (data.history[this.selectedDate][id] || 0) >= habit.goal;

    data.history[this.selectedDate][id] = habit.goal;

    // Streak update
    if (this.selectedDate === HabitsDB.getTodayKey() && !wasCompleted) {
      habit.completedDates = habit.completedDates || [];
      habit.completedDates.push(this.selectedDate);
      habit.streak = HabitsDB._calcStreak(habit.completedDates);
      habit.longestStreak = Math.max(habit.streak, habit.longestStreak || 0);
    }

    HabitsDB.save(data);

    this.showToast('⚡', 'Fast Forward!', `${habit.emoji} ${habit.name} marked complete!`, 'success');
    this.triggerConfetti(id);
    this.updateCardUI(id);
    this.updateBanner();
    HabitsDB.addXP(25);
  },

  updateCardUI(id) {
    const habit = HabitsDB.getById(id);
    if (!habit) return;
    const card = document.querySelector(`.habit-card[data-id="${id}"]`);
    if (!card) return;

    const todayCount = HabitsDB.getTodayProgress(id);
    const pct = Math.min(100, Math.round((todayCount / habit.goal) * 100));
    const completed = todayCount >= habit.goal;
    const streak = HabitsDB.getById(id)?.streak || 0;

    // Update ring
    const r = 56, c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    const fill = card.querySelector('.progress-ring-fill');
    if (fill) {
      fill.setAttribute('stroke-dashoffset', offset);
      fill.setAttribute('stroke', completed ? '#22c55e' : (habit.color || '#f43c00'));
      fill.classList.toggle('completed', completed);
    }

    // Update text
    const valEl = card.querySelector('.ring-value');
    const pctEl = card.querySelector('.ring-percent');
    if (valEl) { valEl.textContent = todayCount; valEl.classList.add('bump'); setTimeout(() => valEl.classList.remove('bump'), 300); }
    if (pctEl) pctEl.textContent = pct + '%';

    // Update streak
    const badgeEl = card.querySelector('.streak-badge');
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="flame">${streak > 0 ? '🔥' : '💤'}</span><span>${streak} day${streak !== 1 ? 's' : ''}</span>`;
      badgeEl.classList.toggle('cold', streak === 0);
    }

    // Toggle completed class
    card.classList.toggle('completed', completed);
    if (completed) card.classList.add('complete-pulse');
    setTimeout(() => card.classList.remove('complete-pulse'), 600);
  },

  animateRing(id) {
    const card = document.querySelector(`.habit-card[data-id="${id}"]`);
    if (!card) return;
    const ring = card.querySelector('.progress-ring-fill');
    if (ring) {
      ring.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    }
  },

  triggerConfetti(id) {
    const card = document.querySelector(`.habit-card[data-id="${id}"]`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const colors = ['#f43c00', '#ff8c42', '#22c55e', '#fbbf24', '#60a5fa'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = `
        left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px;
        top: ${rect.top + rect.height / 2}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        position: fixed;
        z-index: 9999;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay: ${Math.random() * 200}ms;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  },

  // =========================================
  // CONTEXT MENU
  // =========================================
  bindContextMenu() {
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('context-menu');
      if (menu && !menu.contains(e.target)) {
        menu.remove();
      }
    });
  },

  showContextMenu(e, habitId) {
    const existing = document.getElementById('context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.className = 'context-menu';
    menu.innerHTML = `
      <div class="menu-item" data-action="edit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit Habit
      </div>
      <div class="menu-item" data-action="analytics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        View Analytics
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item danger" data-action="delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        Delete Habit
      </div>
    `;

    menu.style.cssText = `left:${Math.min(e.clientX, window.innerWidth - 200)}px;top:${Math.min(e.clientY, window.innerHeight - 160)}px`;
    document.body.appendChild(menu);

    menu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        menu.remove();
        if (action === 'edit') this.openModal(habitId);
        else if (action === 'delete') this.deleteHabit(habitId);
        else if (action === 'analytics') this.navigateTo('analytics');
      });
    });
  },

  deleteHabit(id) {
    if (confirm('Delete this habit? This cannot be undone.')) {
      HabitsDB.delete(id);
      this.renderHabits();
      this.updateBanner();
      this.showToast('🗑️', 'Habit Deleted', 'Habit removed successfully');
    }
  },

  // =========================================
  // MODAL
  // =========================================
  bindModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('btn-cancel');
    const saveBtn = document.getElementById('btn-save');
    const nameInput = document.getElementById('habit-name');

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    saveBtn?.addEventListener('click', () => this.saveHabit());

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });

    // Emoji picker
    document.querySelectorAll('.emoji-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.emoji-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.selectedEmoji = opt.dataset.emoji;
      });
    });

    // Color picker
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.selectedColor = swatch.dataset.color;
      });
    });

    // AI Goal suggestions
    document.getElementById('ai-goal-btn')?.addEventListener('click', async () => {
      const goalInput = document.getElementById('habit-goal-text');
      const goal = goalInput?.value || nameInput?.value;
      if (!goal) { this.showToast('💡', 'Tip', 'Type your goal first'); return; }

      const btn = document.getElementById('ai-goal-btn');
      btn.textContent = '⏳ Thinking...';
      btn.disabled = true;

      const suggestions = await Analytics.getAISuggestions(goal);
      this.showAISuggestions(suggestions);

      btn.textContent = '✨ AI Suggest';
      btn.disabled = false;
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  openModal(habitId = null) {
    this.editingHabitId = habitId;
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title-text');

    if (habitId) {
      const habit = HabitsDB.getById(habitId);
      if (habit) {
        document.getElementById('habit-name').value = habit.name;
        document.getElementById('habit-goal').value = habit.goal;
        document.getElementById('habit-reminder').value = habit.reminder || '';
        document.getElementById('habit-category').value = habit.category || '';
        title.innerHTML = 'Edit <span>Habit</span>';
        this.selectedEmoji = habit.emoji || '⭐';
        this.selectedColor = habit.color || '#f43c00';

        document.querySelectorAll('.emoji-opt').forEach(o => {
          o.classList.toggle('active', o.dataset.emoji === this.selectedEmoji);
        });
        document.querySelectorAll('.color-swatch').forEach(s => {
          s.classList.toggle('active', s.dataset.color === this.selectedColor);
        });
      }
    } else {
      document.getElementById('habit-name').value = '';
      document.getElementById('habit-goal').value = '';
      document.getElementById('habit-reminder').value = '';
      document.getElementById('habit-category').value = '';
      title.innerHTML = 'New <span>Habit</span>';
      
      // Auto-set target date if planning for the future
      this.modalTargetDate = this.selectedDate === HabitsDB.getTodayKey() ? null : this.selectedDate;
      
      if (this.modalTargetDate) {
        title.innerHTML = `Plan for <span>${this.modalTargetDate}</span>`;
      }
      
      document.getElementById('ai-suggestions-box').classList.remove('visible');
    }

    overlay?.classList.add('open');
    setTimeout(() => document.getElementById('habit-name')?.focus(), 100);
  },

  closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('open');
    this.editingHabitId = null;
  },

  saveHabit() {
    const name = document.getElementById('habit-name')?.value.trim();
    const goal = parseInt(document.getElementById('habit-goal')?.value) || 1;
    const reminder = document.getElementById('habit-reminder')?.value;
    const category = document.getElementById('habit-category')?.value.trim() || 'General';

    if (!name) {
      document.getElementById('habit-name')?.focus();
      document.getElementById('habit-name')?.style.setProperty('border-color', 'var(--status-blocked)');
      return;
    }

    const habitData = {
      name, goal, reminder, category,
      emoji: this.selectedEmoji,
      color: this.selectedColor,
      targetDate: this.modalTargetDate // This is set by openModalForSelectedDate
    };

    if (this.editingHabitId) {
      HabitsDB.update(this.editingHabitId, habitData);
      this.showToast('✅', 'Updated', `${name} updated!`, 'success');
    } else {
      HabitsDB.add(habitData);
      this.showToast('🌱', 'Habit Added', `${name} added to your tracker!`, 'success');
      HabitsDB.addXP(10);
    }

    this.closeModal();
    this.renderHabits();
    this.updateBanner();
  },

  showAISuggestions(suggestions) {
    const box = document.getElementById('ai-suggestions-box');
    const container = document.getElementById('ai-pills');
    if (!box || !container) return;

    container.innerHTML = suggestions.map(s =>
      `<div class="ai-suggestion-pill" data-name="${s.name}" data-emoji="${s.emoji}" data-goal="${s.goal}" data-category="${s.category}">
        ${s.emoji} ${s.name}
      </div>`
    ).join('');

    container.querySelectorAll('.ai-suggestion-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.getElementById('habit-name').value = pill.dataset.name;
        document.getElementById('habit-goal').value = pill.dataset.goal;
        document.getElementById('habit-category').value = pill.dataset.category;
        this.selectedEmoji = pill.dataset.emoji;
        document.querySelectorAll('.emoji-opt').forEach(o => {
          o.classList.toggle('active', o.dataset.emoji === this.selectedEmoji);
        });
        this.showToast('✨', 'AI Suggestion', `${pill.dataset.name} loaded!`);
      });
    });

    box.classList.add('visible');
  },

  // =========================================
  // ANALYTICS
  // =========================================
  renderAnalytics() {
    const stats = HabitsDB.getTodayStats();
    const habits = HabitsDB.getAll();

    // Update stat cards
    document.getElementById('stat-total')?.setAttribute('data-val', stats.total);
    document.getElementById('stat-completed-val')?.setAttribute('data-val', stats.completed);

    const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);
    document.getElementById('stat-streak-val') && (document.getElementById('stat-streak-val').textContent = bestStreak);
    document.getElementById('stat-pct-val') && (document.getElementById('stat-pct-val').textContent = stats.percentage + '%');

    // Render charts
    setTimeout(() => {
      Analytics.renderWeeklyChart('chart-weekly');
      Analytics.renderCompletionRadar('chart-radar');
      Analytics.renderMonthlyLine('chart-monthly');
      Analytics.renderHabitBreakdown('chart-breakdown');
    }, 50);

    // Heatmap
    this.renderHeatmap();
  },

  renderHeatmap() {
    const container = document.getElementById('heatmap-grid');
    if (!container) return;

    const data = HabitsDB.getAllHeatmapData();
    const entries = Object.entries(data);

    // Group by weeks
    const weeks = [];
    let currentWeek = [];

    entries.forEach(([date, level], i) => {
      const d = new Date(date);
      currentWeek.push({ date, level, d });
      if (d.getDay() === 6 || i === entries.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    container.innerHTML = weeks.map(week => `
      <div class="heatmap-week">
        ${week.map(cell => `<div class="heatmap-cell l${cell.level}" title="${cell.date}: ${['None', 'Low', 'Some', 'Good', 'Full'][cell.level]}"></div>`).join('')}
      </div>
    `).join('');
  },

  // =========================================
  // HISTORY
  // =========================================
  renderHistory() {
    const habits = HabitsDB.getAll();
    const select = document.getElementById('history-habit-select');
    if (select) {
      select.innerHTML = `<option value="all">All Habits</option>` + habits.map(h =>
        `<option value="${h.id}">${h.emoji} ${h.name}</option>`
      ).join('');
      select.onchange = () => this.renderCalendarFull(select.value);
    }
    this.renderCalendarFull('all');
  },

  renderCalendarFull(habitId) {
    const container = document.getElementById('calendar-full-grid');
    if (!container) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = HabitsDB.load();
    const habits = HabitsDB.getAll();

    let cells = '';
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      cells += '<div class="cal-day empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().split('T')[0];
      const isToday = key === HabitsDB.getTodayKey();
      const dayH = data.history[key] || {};

      let completion = 0;
      if (habitId === 'all') {
        if (habits.length) {
          const comp = habits.filter(h => (dayH[h.id] || 0) >= h.goal).length;
          completion = comp / habits.length;
        }
      } else {
        const habit = habits.find(h => h.id === habitId);
        if (habit) completion = (dayH[habitId] || 0) >= habit.goal ? 1 : 0;
      }

      const cls = `cal-day${isToday ? ' current' : ''}${completion === 1 ? ' has-data full' : completion > 0 ? ' has-data partial' : ''}`;
      const dots = completion > 0 ? `<div class="cal-dots"><div class="cal-dot${completion === 1 ? ' green' : ''}"></div></div>` : '';

      cells += `<div class="${cls}"><span class="cal-num">${d}</span>${dots}</div>`;
    }

    container.innerHTML = cells;
  },

  // =========================================
  // ACHIEVEMENTS
  // =========================================
  renderAchievements() {
    const xpData = HabitsDB.getXP();
    const stats = HabitsDB.getTodayStats();
    const habits = HabitsDB.getAll();
    const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);

    // Level
    const levelBadge = document.getElementById('level-badge');
    const levelName = document.getElementById('level-name');
    const levelXP = document.getElementById('level-xp');
    const xpFill = document.getElementById('xp-fill');

    if (levelBadge) { levelBadge.innerHTML = `<span>${xpData.level}</span><small>LVL</small>`; }

    const levelNames = ['Seed', 'Sprout', 'Sapling', 'Tree', 'Forest', 'Champion', 'Legend', 'Mythic'];
    if (levelName) levelName.textContent = levelNames[Math.min(xpData.level - 1, levelNames.length - 1)] || 'Habit Master';
    if (levelXP) levelXP.textContent = `${xpData.xp} XP — ${100 - (xpData.xp % 100)} XP to next level`;
    if (xpFill) xpFill.style.width = (xpData.xp % 100) + '%';

    // Achievements
    const achievements = [
      { icon: '🌱', name: 'First Habit', desc: 'Add your first habit', unlocked: habits.length >= 1 },
      { icon: '🔥', name: 'On Fire', desc: 'Reach a 3-day streak', unlocked: bestStreak >= 3 },
      { icon: '💎', name: 'Diamond', desc: 'Reach a 7-day streak', unlocked: bestStreak >= 7 },
      { icon: '👑', name: 'Royalty', desc: 'Reach a 30-day streak', unlocked: bestStreak >= 30 },
      { icon: '⚡', name: 'Overachiever', desc: 'Complete all habits', unlocked: stats.total > 0 && stats.completed === stats.total },
      { icon: '🎯', name: 'Focused', desc: 'Track 5 habits', unlocked: habits.length >= 5 },
      { icon: '🏆', name: 'Champion', desc: 'Earn 100 XP', unlocked: xpData.xp >= 100 },
      { icon: '🌙', name: 'Night Owl', desc: 'Set a reminder', unlocked: habits.some(h => h.reminder) },
    ];

    const grid = document.getElementById('achievements-grid');
    if (grid) {
      grid.innerHTML = achievements.map(a => `
        <div class="achievement-card${a.unlocked ? ' unlocked' : ' locked'}">
          <span class="achievement-icon">${a.icon}</span>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>
      `).join('');
    }
  },

  // =========================================
  // SETTINGS
  // =========================================
  renderSettings() {
    const settings = JSON.parse(localStorage.getItem('habitSettings') || '{}');
    this.applySettings(settings);

    document.querySelectorAll('.toggle[data-setting]').forEach(toggle => {
      toggle.classList.toggle('on', !!settings[toggle.dataset.setting]);
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        settings[toggle.dataset.setting] = toggle.classList.contains('on');
        localStorage.setItem('habitSettings', JSON.stringify(settings));
        this.applySettings(settings);
      });
    });

    document.getElementById('btn-export')?.addEventListener('click', () => this.exportData());
    document.getElementById('btn-clear')?.addEventListener('click', () => this.clearData());
  },

  applySettings(settings) {
    // 1. Compact Mode
    const layout = document.querySelector('.app-layout');
    if (layout) {
      layout.classList.toggle('compact-mode', !!settings.compact);
    }

    // 2. Animations (handled in logic below)
    this.animationsEnabled = settings.animations !== false;

    // 3. Notifications (handled in scheduleReminders)
    this.notificationsEnabled = !!settings.notifications;
  },

  exportData() {
    const data = HabitsDB.load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'habits-backup.json'; a.click();
    this.showToast('💾', 'Exported', 'Data downloaded as JSON', 'success');
  },

  clearData() {
    if (confirm('Clear all data? This cannot be undone!')) {
      localStorage.removeItem('habitTracker_v2');
      localStorage.removeItem('habitTracker_xp');
      this.renderDashboard();
      this.showToast('🗑️', 'Cleared', 'All data has been removed');
    }
  },

  // =========================================
  // POMODORO
  // =========================================
  bindPomodoro() {
    document.querySelectorAll('.pomo-mode:not(#btn-pomo-manual)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pomo-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.dataset.mode);
        this.pomodoroState.mode = mins;
        this.pomodoroState.timeLeft = mins * 60;
        this.pomodoroState.total = mins * 60;
        if (this.pomodoroState.interval) {
          clearInterval(this.pomodoroState.interval);
          this.pomodoroState.running = false;
          const startBtn = document.getElementById('btn-pomo-start');
          if (startBtn) startBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start</span>';
        }
        this.updatePomodoroDisplay();
      });
    });

    document.getElementById('btn-pomo-manual')?.addEventListener('click', () => {
      const val = prompt('Enter minutes (e.g. 45):', '45');
      const mins = parseInt(val);
      if (isNaN(mins) || mins <= 0) return;

      document.querySelectorAll('.pomo-mode').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-pomo-manual').classList.add('active');

      this.pomodoroState.mode = 'custom';
      this.pomodoroState.timeLeft = mins * 60;
      this.pomodoroState.total = mins * 60;
      if (this.pomodoroState.interval) {
        clearInterval(this.pomodoroState.interval);
        this.pomodoroState.running = false;
        const startBtn = document.getElementById('btn-pomo-start');
        if (startBtn) startBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start</span>';
      }
      this.updatePomodoroDisplay();
      this.showToast('⏱', 'Timer Set', `Custom focus set to ${mins} minutes`);
    });

    document.getElementById('btn-pomo-start')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (this.pomodoroState.running) {
        clearInterval(this.pomodoroState.interval);
        this.pomodoroState.running = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start</span>';
      } else {
        this.pomodoroState.running = true;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
        this.pomodoroState.interval = setInterval(() => {
          this.pomodoroState.timeLeft--;
          this.updatePomodoroDisplay();
          if (this.pomodoroState.timeLeft <= 0) {
            clearInterval(this.pomodoroState.interval);
            this.pomodoroState.running = false;
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start</span>';
            this.showToast('⏰', 'Pomodoro Done!', 'Time for a break!', 'success');

            // IF linked to a habit, increment it
            if (this.pomodoroTargetHabitId) {
              this.incrementHabit(this.pomodoroTargetHabitId);
              this.pomodoroTargetHabitId = null;
              const pomoLabel = document.querySelector('.pomodoro-header div:first-child');
              if (pomoLabel) pomoLabel.innerHTML = `<span>⏱</span> Wake Up on Time`;
            }

            // Trigger beautiful completion animation
            this.triggerPlantCelebration();

            this.pomodoroState.timeLeft = this.pomodoroState.total;
            setTimeout(() => this.updatePomodoroDisplay(), 4000); // Wait for celebration to end before resetting
          }
        }, 1000);
      }
    });

    document.getElementById('btn-pomo-reset')?.addEventListener('click', () => {
      clearInterval(this.pomodoroState.interval);
      this.pomodoroState.running = false;
      this.pomodoroState.timeLeft = this.pomodoroState.total;
      const startBtn = document.getElementById('btn-pomo-start');
      if (startBtn) startBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start</span>';
      this.updatePomodoroDisplay();
    });

    document.getElementById('btn-pomo-manual')?.addEventListener('click', () => {
      const mins = prompt("Enter custom duration in minutes:", "25");
      if (mins && !isNaN(mins)) {
        const realSecs = Math.max(1, parseInt(mins)) * 60;
        this.pomodoroState.total = realSecs;
        this.pomodoroState.timeLeft = realSecs;
        this.updatePomodoroDisplay();
        this.showToast('⏱️', 'Timer Set', `Custom duration: ${mins} minutes`);
      }
    });

    document.querySelector('.timer-plus')?.addEventListener('click', () => {
      if (!this.pomodoroState.running) {
        this.pomodoroState.total += 60; // add 1 minute
        this.pomodoroState.timeLeft += 60;
        this.updatePomodoroDisplay();
      }
    });

    document.querySelector('.timer-minus')?.addEventListener('click', () => {
      if (!this.pomodoroState.running && this.pomodoroState.total > 60) {
        this.pomodoroState.total -= 60; // subtract 1 minute
        this.pomodoroState.timeLeft -= 60;
        this.updatePomodoroDisplay();
      }
    });

    this.updatePomodoroDisplay();
  },

  updatePomodoroDisplay() {
    const m = Math.floor(this.pomodoroState.timeLeft / 60).toString().padStart(2, '0');
    const s = (this.pomodoroState.timeLeft % 60).toString().padStart(2, '0');
    const el = document.querySelector('.pomodoro-display');
    if (el) el.textContent = `${m}:${s}`;

    const pct = this.pomodoroState.timeLeft / this.pomodoroState.total;
    const fill = document.querySelector('.pomodoro-ring-fill');
    if (fill) {
      const r = 68, c = 2 * Math.PI * r;
      fill.setAttribute('stroke-dasharray', c);
      fill.setAttribute('stroke-dashoffset', c - pct * c);
    }

    // Plant Animation Logic
    if (this.animationsEnabled === false) return;

    const progress = 1 - pct; // 0 to 1
    const stem = document.querySelector('.plant-stem');
    const branches = document.querySelectorAll('.plant-branch');
    const groups = document.querySelectorAll('.leaf-group');
    const blossoms = document.querySelectorAll('.blossom');

    if (stem) {
      if (progress < 0.01 && !this.pomodoroState.running && this.pomodoroState.timeLeft === this.pomodoroState.total) {
        // Reset state
        stem.style.setProperty('--stem-scale', 0);
        stem.style.opacity = '0';
        [...branches, ...groups, ...blossoms].forEach(el => {
          el.style.transform = 'scale(0)';
          el.style.opacity = '0';
        });
      } else {
        // Grow based on progress
        const stemScale = Math.max(0.1, progress * 1.2);
        stem.style.setProperty('--stem-scale', Math.min(1, stemScale));
        stem.style.opacity = '1';

        // 1. Branches at 30% and 50%
        branches.forEach((b, idx) => {
          const threshold = 0.3 + (idx * 0.2);
          if (progress > threshold) {
            const scale = Math.min(1, (progress - threshold) * 4);
            b.style.transform = `scale(${scale})`;
            b.style.opacity = '1';
          }
        });

        // 2. Leaf groups staggered
        groups.forEach((g, idx) => {
          const threshold = 0.1 + (idx * 0.15);
          if (progress > threshold) {
            const scale = Math.min(1, (progress - threshold) * 5);
            g.style.transform = `scale(${scale})`;
            g.style.opacity = '1';
          }
        });

        // 3. Blossoms at the very end
        if (progress > 0.9) {
          blossoms.forEach(b => {
            const scale = Math.min(1, (progress - 0.9) * 10);
            b.style.transform = `scale(${scale})`;
            b.style.opacity = '1';
          });
        }
      }
    }
  },

  triggerPlantCelebration() {
    if (this.animationsEnabled === false) return;

    let overlay = document.getElementById('completion-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'completion-overlay';
      overlay.className = 'completion-celebration';
      overlay.innerHTML = `
        <div class="tree-popup">
          <div style="font-size:100px; filter:drop-shadow(0 0 30px rgba(34,197,94,0.8)); animation: bounce 1s infinite">🌳</div>
          <div class="tree-popup-text" style="font-size:32px; margin-top:20px">Magnificent Growth!</div>
          <div style="color:rgba(255,255,255,0.9); margin-top:10px; font-size:16px; font-weight:500;">Your focus has yielded a beautiful tree.</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Trigger Confetti but make it look like leaves
    const colors = ['#22c55e', '#16a34a', '#4ade80', '#15803d', '#86efac', '#fb7185'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const size = 10 + Math.random() * 15;
      p.style.cssText = `
        left: ${window.innerWidth / 2 + (Math.random() - 0.5) * 400}px;
        top: ${window.innerHeight / 2 + (Math.random() - 0.5) * 400}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        position: fixed;
        z-index: 10000;
        width: ${size}px;
        height: ${size}px;
        border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
        animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }

    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 5000);
  },

  // =========================================
  // NOTIFICATIONS
  // =========================================
  checkNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
    }
  },

  scheduleReminders() {
    setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const habits = HabitsDB.getAll();
      habits.forEach(habit => {
        if (habit.reminder === timeStr) {
          const count = HabitsDB.getTodayProgress(habit.id);
          if (count < habit.goal) {
            this.sendNotification(habit);
          }
        }
      });
    }, 60000);
  },

  sendNotification(habit) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Time for: ${habit.name}`, {
        body: `${habit.emoji} Complete your habit to keep your streak! 🔥`,
        icon: '/favicon.ico'
      });
    }
    this.showToast('🔔', 'Reminder', `Time to complete: ${habit.name} ${habit.emoji}`);
  },

  // =========================================
  // TOAST NOTIFICATIONS
  // =========================================
  triggerHabitTimer(id) {
    const habit = HabitsDB.getById(id);
    if (!habit) return;

    this.pomodoroTargetHabitId = id;
    
    // Default to 25m or habit specific? Let's stick to 25m focus
    const duration = 25 * 60; 
    this.pomodoroState.total = duration;
    this.pomodoroState.timeLeft = duration;
    this.pomodoroState.running = false; // Stop existing
    clearInterval(this.pomodoroState.interval);
    
    this.updatePomodoroDisplay();

    // Scroll to pomodoro widget
    document.querySelector('.pomodoro-widget')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    this.showToast('⏱️', 'Focus Mode', `Focusing on ${habit.emoji} ${habit.name}`);
    
    // Update the label in the Pomodoro widget
    const pomoLabel = document.querySelector('.pomodoro-header div:first-child');
    if (pomoLabel) pomoLabel.innerHTML = `<span>⏱</span> Focus: <strong>${habit.name}</strong>`;
    
    // Highlight
    const widget = document.querySelector('.pomodoro-widget');
    widget.style.borderColor = habit.color;
    widget.style.boxShadow = `0 0 20px ${habit.color}20`;
    setTimeout(() => {
        widget.style.borderColor = '';
        widget.style.boxShadow = '';
    }, 3000);
  },

  showToast(icon, title, msg, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast${type ? ' ' + type : ''}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
