// FIREBASE-INTEGRATED Daily Activity Tracker - COMPLETE VERSION
// Version 6.2 - Full Habit Control

console.log('🚀 Firebase Daily Tracker Loading - v6.2');

// Firebase Configuration and Imports
const firebaseConfig = {
    apiKey: "AIzaSyC8WUvIamuDYDWd4Ws9ocxEmdY73RJ_cho",
    authDomain: "daily-tracker-1ec5b.firebaseapp.com",
    projectId: "daily-tracker-1ec5b",
    storageBucket: "daily-tracker-1ec5b.firebasestorage.app",
    messagingSenderId: "1040028029564",
    appId: "1:1040028029564:web:10c2bd4f6b1fc1990aeff9",
    measurementId: "G-ZEZBMB10SL"
};

// Initialize Firebase (these will be available globally via CDN)
let auth, db;
let currentUser = null;

class FirebaseDailyTracker {
    constructor() {
        // Initialize immediately
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.currentYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.currentView = 'weekly';
        
        // User profile
        this.userName = "Amit";
        this.userEmail = null;
        this.userId = null;
        
        // ALL habits are now stored in a single list for full control
        this.habits = []; 
        
        this.habitColors = {
            "Study/Learning": "#3B82F6", "Exercise": "#10B981", "Reading": "#EF4444",
            "Planning": "#8B5CF6", "Review Sessions": "#06B6D4", "Project Work": "#F59E0B",
            "Skill Development": "#EC4899", "Health Care": "#14B8A6"
        };
        
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4",
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        
        this.motivationalQuotes = [
            "Success is the sum of small efforts repeated day in and day out.",
            "The way to get started is to quit talking and begin doing.", "Don't wish it were easier; wish you were better.",
            "Discipline is choosing between what you want now and what you want most.", "Excellence is not a skill, it's an attitude.",
            "Progress, not perfection.", "Small daily improvements lead to staggering yearly results.",
            "The secret of getting ahead is getting started.", "You don't have to be great to get started, but you have to get started to be great.",
            "The only impossible journey is the one you never begin.", "Quality is not an act, it is a habit.",
            "Champions keep playing until they get it right.", "The difference between ordinary and extraordinary is that little extra.",
            "Success is where preparation and opportunity meet.", "Believe you can and you're halfway there.",
            "The future depends on what you do today.", "Your limitation—it's only your imagination.",
            "Push yourself, because no one else is going to do it for you.", "Great things never come from comfort zones.",
            "Success doesn't just find you. You have to go out and get it."
        ];
        
        this.autoSaveTimer = null;
        this.firebaseSyncTimer = null;
        
        this.entries = {};
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        
        this.initializeFirebase();
    }
    
    async initializeFirebase() {
        console.log('🔥 Initializing Firebase...');
        try {
            const app = window.firebase.initializeApp(firebaseConfig);
            auth = window.firebase.auth();
            db = window.firebase.firestore();
            console.log('✅ Firebase initialized successfully');
            auth.onAuthStateChanged((user) => {
                if (user) {
                    this.handleUserSignedIn(user);
                } else {
                    this.handleUserSignedOut();
                }
            });
            this.showLoadingScreen();
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            this.showToast('Firebase initialization failed', 'error');
            this.hideLoadingScreen();
        }
    }
    
    showLoadingScreen() {
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
    
    hideLoadingScreen() {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }
    
    async handleUserSignedIn(user) {
        currentUser = user;
        this.userId = user.uid;
        this.userEmail = user.email;
        this.userName = user.displayName || user.email.split('@')[0] || 'User';
        this.hideLoadingScreen();
        await this.loadUserDataFromFirestore();
        this.initializeApp();
        this.updateUserHeader();
        this.startFirebaseSync();
        this.showToast(`Welcome back, ${this.userName}! 🎉`, 'success');
    }
    
    handleUserSignedOut() {
        currentUser = null;
        this.userId = null;
        this.userEmail = null;
        this.userName = "User";
        this.entries = {};
        this.habits = [];
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        if (this.firebaseSyncTimer) {
            clearInterval(this.firebaseSyncTimer);
        }
        this.showLoadingScreen();
    }
    
    updateUserHeader() {
        const headerTitle = document.querySelector('.app-header h1');
        if (headerTitle) {
            headerTitle.textContent = `Hi ${this.userName}! 🩺`;
        }
        this.updateSyncStatus('firebase');
    }
    
    async signIn() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
            this.showToast('Please enter both email and password', 'warning');
            return;
        }
        try {
            document.getElementById('loginBtn').disabled = true;
            document.getElementById('loginBtn').textContent = 'Signing in...';
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    await auth.createUserWithEmailAndPassword(email, password);
                    this.showToast('Account created successfully! 🎉', 'success');
                } catch (createError) {
                    this.showToast(`Error creating account: ${createError.message}`, 'error');
                }
            } else {
                this.showToast(`Sign in error: ${error.message}`, 'error');
            }
        } finally {
            document.getElementById('loginBtn').disabled = false;
            document.getElementById('loginBtn').textContent = 'Sign In';
        }
    }
    
    async signOut() {
        try {
            await auth.signOut();
            this.showToast('Signed out successfully', 'success');
        } catch (error) {
            this.showToast('Error signing out', 'error');
        }
    }
    
    async loadUserDataFromFirestore() {
        if (!this.userId) return;
        try {
            const userDoc = await db.collection('users').doc(this.userId).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                this.entries = data.entries || {};
                
                // Logic to handle both new and old habit data structures
                if (data.habits) {
                    this.habits = data.habits; // New unified structure
                } else {
                    // Migration for old data: combine default and custom
                    const defaultHabits = [
                        "Study/Learning", "Exercise", "Reading", "Planning",
                        "Review Sessions", "Project Work", "Skill Development", "Health Care"
                    ];
                    this.habits = [...defaultHabits, ...(data.customHabits || [])];
                }

                this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
                this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
            } else {
                await this.initializeSampleData();
                await this.saveUserDataToFirestore();
            }
        } catch (error) {
            this.showToast('Error loading your data', 'error');
            this.initializeSampleData();
        }
    }
    
    async saveUserDataToFirestore() {
        if (!this.userId) return;
        try {
            const userData = {
                entries: this.entries,
                habits: this.habits, // Save the new unified list
                habitColors: this.habitColors,
                goals: this.goals,
                lastUpdated: new Date().toISOString(),
                version: "6.2.0"
            };
            await db.collection('users').doc(this.userId).set(userData, { merge: true });
            this.updateSyncStatus('synced');
        } catch (error) {
            this.updateSyncStatus('error');
            this.showToast('Error syncing data', 'error');
        }
    }
    
    startFirebaseSync() {
        this.firebaseSyncTimer = setInterval(async () => {
            if (this.userId) await this.saveUserDataToFirestore();
        }, 30000);
    }
    
    initializeSampleData() {
        // New users start with the original 8 habits, which they can now delete/edit
        this.habits = [
            "Study/Learning", "Exercise", "Reading", "Planning",
            "Review Sessions", "Project Work", "Skill Development", "Health Care"
        ];
        this.entries = {
            "2025-09-06": { "text": "Welcome! This is a sample entry. You can edit or delete it. You can also delete any of these default habits to customize your tracker!", "habits": { "Planning": true, "Study/Learning": true } }
        };
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
    }
    
    initializeApp() {
        this.displayMotivationalQuote();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.renderCurrentView();
        this.setupGoalsSelectors();
    }
    
    setupEventListeners() {
        this.addListener('loginBtn', 'click', () => this.signIn());
        this.addListener('signOutBtn', 'click', () => this.signOut());
        this.addEnterListener('loginEmail', () => this.signIn());
        this.addEnterListener('loginPassword', () => this.signIn());
        this.addListener('weeklyTab', 'click', () => this.switchView('weekly'));
        this.addListener('monthlyTab', 'click', () => this.switchView('monthly'));
        this.addListener('yearlyTab', 'click', () => this.switchView('yearly'));
        this.addListener('goalsTab', 'click', () => this.switchView('goals'));
        this.addListener('prevWeek', 'click', () => this.navigateWeek(-1));
        this.addListener('nextWeek', 'click', () => this.navigateWeek(1));
        this.addListener('prevMonth', 'click', () => this.navigateMonth(-1));
        this.addListener('nextMonth', 'click', () => this.navigateMonth(1));
        this.addListener('prevYear', 'click', () => this.navigateYear(-1));
        this.addListener('nextYear', 'click', () => this.navigateYear(1));
        this.addListener('todayBtn', 'click', () => this.goToToday());
        this.addListener('jumpToBtn', 'click', () => this.openJumpToModal());
        this.addListener('exportBtn', 'click', () => this.exportData('json'));
        this.addListener('syncBtn', 'click', () => this.handleSyncButton());
        this.addListener('closeModal', 'click', () => this.closeModal('dailyModal'));
        this.addListener('closeEntryView', 'click', () => this.closeModal('entryViewModal'));
        this.addListener('closeJumpToModal', 'click', () => this.closeModal('jumpToModal'));
        this.addListener('saveEntry', 'click', () => this.saveEntry());
        this.addListener('quickSave', 'click', () => this.quickSave());
        this.addListener('executeJump', 'click', () => this.executeJump());
        this.addListener('jumpToday', 'click', () => this.jumpToToday());
        this.addListener('jumpYesterday', 'click', () => this.jumpToYesterday());
        this.addListener('jumpWeekStart', 'click', () => this.jumpToWeekStart());
        this.addListener('jumpMonthStart', 'click', () => this.jumpToMonthStart());
        this.addListener('addWeeklyTask', 'click', () => this.addGoalTask('weekly'));
        this.addListener('addMonthlyTask', 'click', () => this.addGoalTask('monthly'));
        this.addListener('addYearlyTask', 'click', () => this.addGoalTask('yearly'));
        this.addListener('addHabit', 'click', () => this.addHabit());
        this.addEnterListener('newHabit', () => this.addHabit());
        this.addEnterListener('newWeeklyTask', () => this.addGoalTask('weekly'));
        this.addEnterListener('newMonthlyTask', () => this.addGoalTask('monthly'));
        this.addEnterListener('newYearlyTask', () => this.addGoalTask('yearly'));
        document.getElementById('dailyText')?.addEventListener('input', () => {
            this.scheduleAutoSave();
            this.updateWordCount();
        });
        this.setupModalCloseHandlers();
    }
    
    addListener(id, evt, handler) {
        document.getElementById(id)?.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); handler(e); });
    }
    
    addEnterListener(id, handler) {
        document.getElementById(id)?.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handler(); } });
    }
    
    setupModalCloseHandlers() {
        ['dailyModal', 'entryViewModal', 'jumpToModal'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', (e) => { if (e.target.id === id) this.closeModal(id); });
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            const isModalOpen = !!document.querySelector('.modal:not(.hidden)');
            if (isTyping && e.ctrlKey && e.key === 's') { e.preventDefault(); this.quickSave(); return; }
            if (isTyping) return;
            if (isModalOpen) { if (e.key === 'Escape') this.closeAllModals(); return; }
            const viewNavMap = { 'weekly': this.navigateWeek, 'monthly': this.navigateMonth, 'yearly': this.navigateYear };
            if (e.key === 'ArrowLeft') viewNavMap[this.currentView]?.call(this, -1);
            if (e.key === 'ArrowRight') viewNavMap[this.currentView]?.call(this, 1);
            if (e.key === 'Enter') this.openTodayEntry();
            if (e.key.toLowerCase() === 'g') this.switchView('goals');
        });
    }

    displayMotivationalQuote() {
        const today = new Date().toDateString();
        const quoteKey = `dailyQuoteDate_${this.userId}`;
        const indexKey = `dailyQuoteIndex_${this.userId}`;
        let quoteIndex;
        if (localStorage.getItem(quoteKey) === today) {
            quoteIndex = parseInt(localStorage.getItem(indexKey));
        } else {
            quoteIndex = this.hashCode(this.formatDate(new Date()) + this.userId) % this.motivationalQuotes.length;
            if (this.userId) {
                localStorage.setItem(quoteKey, today);
                localStorage.setItem(indexKey, quoteIndex.toString());
            }
        }
        document.getElementById('dailyQuote').textContent = `"${this.motivationalQuotes[quoteIndex]}"`;
        document.getElementById('quoteAuthor').textContent = '— Daily Motivation';
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
        return Math.abs(hash & hash);
    }
    
    switchView(view) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('tab-btn--active'));
        document.getElementById(`${view}Tab`)?.classList.add('tab-btn--active');
        document.querySelectorAll('.main-view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${view}View`)?.classList.remove('hidden');
        this.currentView = view;
        this.renderCurrentView();
    }
    
    renderCurrentView() {
        const viewRenderMap = {
            'weekly': () => { this.renderWeeklyCalendar(); this.renderHabitLegend(); },
            'monthly': () => { this.renderMonthlyCalendar(); this.renderMonthlySummary(); },
            'yearly': () => { this.renderYearlyCalendar(); this.renderYearlySummary(); },
            'goals': () => this.renderGoals()
        };
        viewRenderMap[this.currentView]?.();
    }
    
    getWeekStart(date) {
        const d = new Date(date);
        return new Date(d.setDate(d.getDate() - d.getDay()));
    }
    
    navigateWeek(dir) { this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (dir * 7)); this.renderWeeklyCalendar(); this.renderHabitLegend(); }
    navigateMonth(dir) { this.currentMonth.setMonth(this.currentMonth.getMonth() + dir); this.renderMonthlyCalendar(); this.renderMonthlySummary(); }
    navigateYear(dir) { this.currentYear += dir; this.renderYearlyCalendar(); this.renderYearlySummary(); }
    
    renderWeeklyCalendar() {
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        document.getElementById('weekRange').textContent = `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
        this.updateWeekStats();
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            calendarDays.appendChild(this.createWeeklyDayElement(date));
        }
        this.highlightToday();
    }
    
    // ... Other calendar rendering, stats, and navigation methods (unchanged) ...
    getWeekNumber(date) { const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); const dayNum = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - dayNum); const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); return Math.ceil((((d - yearStart) / 86400000) + 1) / 7); }
    updateWeekStats() { document.getElementById('weekScore').textContent = `Score: ${this.calculateWeekScore()}%`; document.getElementById('weekStreak').textContent = `🔥 Streak: ${this.calculateCurrentStreak()} days`; }
    calculateWeekScore() { let total = 0, completed = 0; for (let i = 0; i < 7; i++) { const date = new Date(this.currentWeekStart); date.setDate(date.getDate() + i); if (date > new Date()) continue; total++; const entry = this.entries[this.formatDate(date)]; if (entry && entry.habits) { const habitCount = Object.keys(entry.habits).length; const completedCount = Object.values(entry.habits).filter(Boolean).length; if (habitCount > 0 && completedCount / habitCount >= 0.6) completed++; } } return total > 0 ? Math.round((completed / total) * 100) : 0; }
    calculateCurrentStreak() { let streak = 0; let d = new Date(); while (true) { const entry = this.entries[this.formatDate(d)]; if (entry && entry.habits) { const habitCount = Object.keys(entry.habits).length; const completedCount = Object.values(entry.habits).filter(Boolean).length; if (habitCount > 0 && completedCount / habitCount >= 0.5) { streak++; d.setDate(d.getDate() - 1); } else break; } else break; } return streak; }
    createWeeklyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'calendar-day'; dayEl.dataset.date = dateString; if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { const preview = document.createElement('div'); preview.className = 'day-preview'; preview.textContent = entry.text; preview.onclick = (e) => { e.stopPropagation(); this.openEntryView(date); }; dayEl.appendChild(preview); const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    renderMonthlyCalendar() { document.getElementById('monthYear').textContent = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); this.updateMonthStats(); const calendarDays = document.getElementById('monthlyCalendarDays'); calendarDays.innerHTML = ''; const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1); const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'monthly-day other-month'; calendarDays.appendChild(empty); } for (let day = 1; day <= lastDay.getDate(); day++) calendarDays.appendChild(this.createMonthlyDayElement(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day))); this.highlightToday(); }
    updateMonthStats() { const stats = this.calculateMonthlyStats(); document.getElementById('monthEntries').textContent = `📝 ${stats.totalEntries} entries`; document.getElementById('monthStreak').textContent = `🔥 Best streak: ${stats.bestStreak} days`; }
    calculateMonthlyStats() { let entries = 0, bestStreak = 0, currentStreak = 0; const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0); const d = new Date(this.currentMonth); while (d <= end) { const entry = this.entries[this.formatDate(d)]; if (entry) { entries++; const habitCount = Object.keys(entry.habits || {}).length; const completedCount = Object.values(entry.habits || {}).filter(Boolean).length; if (habitCount > 0 && completedCount / habitCount >= 0.5) currentStreak++; else currentStreak = 0; bestStreak = Math.max(bestStreak, currentStreak); } else currentStreak = 0; d.setDate(d.getDate() + 1); } return { totalEntries: entries, bestStreak }; }
    createMonthlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'monthly-day'; dayEl.dataset.date = dateString; if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.slice(0, 6).forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    renderMonthlySummary() { const stats = this.calculateMonthlyStats(); document.getElementById('monthlySummaryContent').innerHTML = `<div class="summary-stat"><span class="summary-label">📝 Total Entries</span><span class="summary-value">${stats.totalEntries}</span></div><div class="summary-stat"><span class="summary-label">🔥 Best Streak</span><span class="summary-value">${stats.bestStreak} days</span></div>`; }
    renderYearlyCalendar() { document.getElementById('yearTitle').textContent = this.currentYear; this.updateYearStats(); const grid = document.getElementById('yearlyCalendarGrid'); grid.innerHTML = ''; for (let m = 0; m < 12; m++) grid.appendChild(this.createYearlyMonthElement(m)); }
    updateYearStats() { const stats = this.calculateYearlyStats(); document.getElementById('yearEntries').textContent = `📝 ${stats.totalEntries} entries`; document.getElementById('yearBestStreak').textContent = `🔥 Best streak: ${stats.bestStreak} days`; document.getElementById('yearGoals').textContent = `🎯 ${stats.completedGoals}/${stats.totalGoals} goals completed`; }
    calculateYearlyStats() { let entries = 0, bestStreak = 0, currentStreak = 0; const d = new Date(this.currentYear, 0, 1); while (d.getFullYear() === this.currentYear && d <= new Date()) { const entry = this.entries[this.formatDate(d)]; if (entry) { entries++; const habitCount = Object.keys(entry.habits || {}).length; const completedCount = Object.values(entry.habits || {}).filter(Boolean).length; if (habitCount > 0 && completedCount / habitCount >= 0.5) currentStreak++; else currentStreak = 0; bestStreak = Math.max(bestStreak, currentStreak); } else currentStreak = 0; d.setDate(d.getDate() + 1); } const yearlyGoals = this.goals.yearly[this.currentYear.toString()]?.tasks || []; return { totalEntries: entries, bestStreak, completedGoals: yearlyGoals.filter(t => t.completed).length, totalGoals: yearlyGoals.length }; }
    createYearlyMonthElement(month) { const monthEl = document.createElement('div'); monthEl.className = 'yearly-month'; const header = document.createElement('div'); header.className = 'yearly-month-header'; header.textContent = new Date(this.currentYear, month).toLocaleDateString('en-US', { month: 'long' }); monthEl.appendChild(header); const grid = document.createElement('div'); grid.className = 'yearly-month-grid'; ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => { const h = document.createElement('div'); h.className = 'yearly-day-header'; h.textContent = day; grid.appendChild(h); }); const firstDay = new Date(this.currentYear, month, 1); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'yearly-day other-month'; grid.appendChild(empty); } const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate(); for (let day = 1; day <= daysInMonth; day++) grid.appendChild(this.createYearlyDayElement(new Date(this.currentYear, month, day))); monthEl.appendChild(grid); return monthEl; }
    createYearlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'yearly-day'; dayEl.textContent = date.getDate(); dayEl.dataset.date = dateString; dayEl.title = this.formatDateDisplay(date); if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const entry = this.entries[dateString]; if (entry) { dayEl.classList.add('has-entry'); const habitCount = Object.keys(entry.habits || {}).length; if (habitCount > 0) { const completion = Object.values(entry.habits).filter(Boolean).length / habitCount; if (completion >= 0.8) dayEl.style.backgroundColor = '#10B981'; else if (completion >= 0.5) dayEl.style.backgroundColor = '#F59E0B'; else dayEl.style.backgroundColor = '#EF4444'; dayEl.style.color = 'white'; } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    renderYearlySummary() { const stats = this.calculateYearlyStats(); const completion = Math.round((stats.completedGoals / Math.max(stats.totalGoals, 1)) * 100); document.getElementById('yearlySummaryContent').innerHTML = `<div class="summary-stat"><span class="summary-label">📝 Total Entries</span><span class="summary-value">${stats.totalEntries}</span></div><div class="summary-stat"><span class="summary-label">🔥 Best Streak</span><span class="summary-value">${stats.bestStreak} days</span></div><div class="summary-stat"><span class="summary-label">🎯 Goals Completed</span><span class="summary-value">${stats.completedGoals}/${stats.totalGoals}</span></div><div class="summary-stat"><span class="summary-label">📊 Completion Rate</span><span class="summary-value">${completion}%</span></div>`; }
    
    // ... Goal management methods (unchanged) ...
    setupGoalsSelectors() { this.setupWeekSelector(); this.setupMonthSelector(); this.setupYearSelector(); }
    setupWeekSelector() { const sel = document.getElementById('weekGoalSelector'); sel.innerHTML = ''; for (let i = -4; i <= 4; i++) { const d = new Date(this.currentWeekStart); d.setDate(d.getDate() + i * 7); const weekNum = this.getWeekNumber(d); const key = `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`; const opt = document.createElement('option'); opt.value = key; opt.textContent = `Week ${weekNum}`; if (i === 0) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadWeeklyGoals(); }
    setupMonthSelector() { const sel = document.getElementById('monthGoalSelector'); sel.innerHTML = ''; for (let i = -6; i <= 6; i++) { const d = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + i, 1); const opt = document.createElement('option'); opt.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; opt.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); if (i === 0) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadMonthlyGoals(); }
    setupYearSelector() { const sel = document.getElementById('yearGoalSelector'); sel.innerHTML = ''; const year = this.currentDate.getFullYear(); for (let y = year - 2; y <= year + 5; y++) { const opt = document.createElement('option'); opt.value = y.toString(); opt.textContent = y.toString(); if (y === year) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadYearlyGoals(); }
    renderGoals() { this.loadWeeklyGoals(); this.loadMonthlyGoals(); this.loadYearlyGoals(); }
    loadWeeklyGoals() { const sel = document.getElementById('weekGoalSelector'); const key = sel.value; const goals = this.goals.weekly[key] || { tasks: [] }; this.renderTasksList(document.getElementById('weeklyTasksList'), goals.tasks, 'weekly', key); }
    loadMonthlyGoals() { const sel = document.getElementById('monthGoalSelector'); const key = sel.value; const goals = this.goals.monthly[key] || { tasks: [] }; this.renderTasksList(document.getElementById('monthlyTasksList'), goals.tasks, 'monthly', key); }
    loadYearlyGoals() { const sel = document.getElementById('yearGoalSelector'); const key = sel.value; const goals = this.goals.yearly[key] || { tasks: [] }; this.renderTasksList(document.getElementById('yearlyTasksList'), goals.tasks, 'yearly', key); }
    renderTasksList(container, tasks, period, key) { container.innerHTML = ''; if (tasks.length === 0) { container.innerHTML = `<div class="empty-state"><p>No goals set for this period yet. 🎯</p></div>`; return; } const completed = tasks.filter(t => t.completed).length; const progress = Math.round((completed / tasks.length) * 100); container.innerHTML = `<div class="progress-bar"><div class="progress-header"><span>Progress: ${completed}/${tasks.length}</span><span>${progress}%</span></div><div class="progress-track"><div class="progress-fill" style="width: ${progress}%"></div></div></div>`; tasks.forEach(task => container.appendChild(this.createTaskElement(task, period, key))); }
    createTaskElement(task, period, key) { const item = document.createElement('div'); item.className = `task-item ${task.completed ? 'completed' : ''}`; item.innerHTML = `<input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}><span class="task-text">${task.text}</span><button class="task-remove">×</button>`; item.querySelector('.task-checkbox').onchange = () => this.toggleTask(task.id, period, key); item.querySelector('.task-remove').onclick = () => this.removeTask(task.id, period, key); return item; }
    addGoalTask(period) { const input = document.getElementById(`new${period.charAt(0).toUpperCase() + period.slice(1)}Task`); const text = input.value.trim(); if (!text) { this.showToast('Please enter a goal', 'warning'); return; } const key = document.getElementById(`${period === 'weekly' ? 'week' : period}GoalSelector`).value; if (!this.goals[period]) this.goals[period] = {}; if (!this.goals[period][key]) this.goals[period][key] = { tasks: [] }; this.goals[period][key].tasks.push({ id: Date.now().toString(), text, completed: false }); input.value = ''; this.saveUserDataToFirestore(); this.renderGoals(); this.showToast('Goal added! 🎯', 'success'); }
    toggleTask(id, period, key) { const task = this.goals[period]?.[key]?.tasks.find(t => t.id === id); if (task) { task.completed = !task.completed; this.saveUserDataToFirestore(); this.renderGoals(); if (task.completed) this.showToast('Goal completed! 🎉', 'success'); } }
    removeTask(id, period, key) { const goalPeriod = this.goals[period]?.[key]; if (goalPeriod) { goalPeriod.tasks = goalPeriod.tasks.filter(t => t.id !== id); this.saveUserDataToFirestore(); this.renderGoals(); this.showToast('Goal removed', 'warning'); } }
    
    // ... Entry Management (open, highlight, etc.) ...
    goToToday() { this.currentDate = new Date(); this.currentWeekStart = this.getWeekStart(this.currentDate); this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); this.currentYear = this.currentDate.getFullYear(); this.renderCurrentView(); }
    openTodayEntry() { this.openDayEntry(new Date()); }
    highlightToday() { const today = this.formatDate(new Date()); document.querySelectorAll('[data-date]').forEach(el => { el.classList.remove('today'); if (el.dataset.date === today) el.classList.add('today'); }); }
    openDayEntry(date) { this.selectedDate = date; const entry = this.entries[this.formatDate(date)] || { text: '', habits: {} }; document.getElementById('modalDate').textContent = `📝 ${this.formatDateDisplay(date)}`; document.getElementById('dailyText').value = entry.text || ''; this.updateWordCount(); this.updateEntryStreak(); this.renderHabits(entry.habits || {}); document.getElementById('dailyModal').classList.remove('hidden'); setTimeout(() => document.getElementById('dailyText').focus(), 100); }
    updateWordCount() { const text = document.getElementById('dailyText').value; document.getElementById('wordCount').textContent = `${text.trim().split(/\s+/).filter(Boolean).length} words`; }
    updateEntryStreak() { document.getElementById('entryStreak').textContent = `🔥 ${this.calculateCurrentStreak()} day streak`; }
    openEntryView(date) { const entry = this.entries[this.formatDate(date)]; if (!entry) return; document.getElementById('entryViewDate').textContent = `📖 Entry for ${this.formatDateDisplay(date)}`; const content = document.getElementById('entryViewContent'); content.innerHTML = ''; if (entry.text) content.innerHTML += `<div><h4>📝 Daily Entry</h4><div class="entry-full-text">${entry.text}</div></div>`; if (entry.habits) { let habitsHtml = '<div><h4>✅ Habits</h4><div class="entry-habits-list">'; this.getAllHabits().forEach(habit => { const completed = entry.habits[habit]; habitsHtml += `<div class="entry-habit-item"><div class="entry-habit-status ${completed ? 'completed' : 'not-completed'}" style="${completed ? 'background-color:' + (this.habitColors[habit] || '#ccc') : ''}"></div><div class="entry-habit-name">${habit}</div></div>`; }); habitsHtml += '</div></div>'; content.innerHTML += habitsHtml; } document.getElementById('entryViewModal').classList.remove('hidden'); }

    // Renders habits in the modal with full controls
    renderHabits(completedHabits = {}) {
        const habitsList = document.getElementById('habitsList');
        habitsList.innerHTML = '';
        this.getAllHabits().forEach((habit, index) => {
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            const details = document.createElement('div');
            details.className = 'habit-details';
            details.innerHTML = `<input type="checkbox" class="habit-checkbox" id="habit-${index}" ${completedHabits[habit] ? 'checked' : ''}><label for="habit-${index}" class="habit-label">${habit}</label>`;
            details.querySelector('input').addEventListener('change', () => this.scheduleAutoSave());
            const actions = document.createElement('div');
            actions.className = 'habit-actions';
            actions.innerHTML = `<button class="habit-action-btn" title="Change color">🎨</button><button class="habit-action-btn" title="Edit habit name">✏️</button><button class="habit-action-btn" title="Delete habit">🗑️</button>`;
            actions.children[0].onclick = (e) => { e.stopPropagation(); this.showColorPalette(habit, e.target); };
            actions.children[1].onclick = (e) => { e.stopPropagation(); this.showHabitEditor(habit, habitItem, details, actions); };
            actions.children[2].onclick = (e) => { e.stopPropagation(); this.removeHabit(habit); };
            habitItem.appendChild(details);
            habitItem.appendChild(actions);
            habitsList.appendChild(habitItem);
        });
    }
    
    // Add a new habit
    addHabit() {
        const input = document.getElementById('newHabit');
        const habitName = input.value.trim();
        if (habitName && !this.getAllHabits().includes(habitName)) {
            this.habits.push(habitName);
            this.habitColors[habitName] = this.getRandomColor();
            input.value = '';
            this.saveUserDataToFirestore();
            if (this.selectedDate) this.renderHabits(this.entries[this.formatDate(this.selectedDate)]?.habits || {});
            this.renderHabitLegend();
            this.showToast('Habit added! ✅', 'success');
        }
    }
    
    // Remove ANY habit
    removeHabit(habitName) {
        if (!confirm(`Are you sure you want to delete "${habitName}"? This will remove it from all past entries.`)) return;
        this.habits = this.habits.filter(h => h !== habitName);
        delete this.habitColors[habitName];
        Object.values(this.entries).forEach(entry => delete entry.habits?.[habitName]);
        this.saveUserDataToFirestore();
        if (this.selectedDate) this.renderHabits(this.entries[this.formatDate(this.selectedDate)]?.habits || {});
        this.renderHabitLegend();
        this.renderCurrentView();
        this.showToast('Habit removed', 'warning');
    }

    // Edit ANY habit's name
    editHabit(oldName, newName) {
        newName = newName.trim();
        if (!newName || newName === oldName) return;
        if (this.getAllHabits().includes(newName)) { this.showToast('Habit name already exists', 'error'); return; }
        const index = this.habits.indexOf(oldName);
        if (index > -1) this.habits[index] = newName;
        this.habitColors[newName] = this.habitColors[oldName];
        delete this.habitColors[oldName];
        Object.values(this.entries).forEach(entry => {
            if (entry.habits && entry.habits[oldName] !== undefined) {
                entry.habits[newName] = entry.habits[oldName];
                delete entry.habits[oldName];
            }
        });
        this.saveUserDataToFirestore();
        this.renderHabitLegend();
        if (this.selectedDate) this.renderHabits(this.entries[this.formatDate(this.selectedDate)]?.habits || {});
        this.showToast(`Habit renamed to "${newName}"`, 'success');
    }

    // Update ANY habit's color
    updateHabitColor(habitName, newColor) {
        this.habitColors[habitName] = newColor;
        this.saveUserDataToFirestore();
        this.renderHabitLegend();
        if (this.selectedDate) this.renderHabits(this.entries[this.formatDate(this.selectedDate)]?.habits || {});
        this.renderCurrentView();
        this.showToast(`Color updated for ${habitName}`, 'success');
    }
    
    getAllHabits() { return [...this.habits]; }
    
    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => { this.saveCurrentEntry(); this.updateAutoSaveStatus(); }, 2000);
        this.updateWordCount();
    }
    
    saveCurrentEntry() {
        if (!this.selectedDate) return;
        const dateString = this.formatDate(this.selectedDate);
        const text = document.getElementById('dailyText').value || '';
        const habits = {};
        this.getAllHabits().forEach((habit, index) => {
            const checkbox = document.getElementById(`habit-${index}`);
            if (checkbox) habits[habit] = checkbox.checked;
        });
        this.entries[dateString] = { text, habits, timestamp: new Date().toISOString() };
        this.saveUserDataToFirestore();
    }
    
    quickSave() { this.saveCurrentEntry(); this.showToast('Entry saved! 💾', 'success'); }
    saveEntry() { this.saveCurrentEntry(); this.closeModal('dailyModal'); this.renderCurrentView(); this.showToast('Entry saved successfully! 🎉', 'success'); }
    
    updateAutoSaveStatus() {
        const el = document.querySelector('.auto-save-status');
        if (el) { el.textContent = '✓ Auto-saved'; el.style.opacity = '1'; setTimeout(() => el.style.opacity = '0.7', 2000); }
    }
    
    // Renders the legend with streaks and full controls
    renderHabitLegend() {
        const list = document.getElementById('habitColors');
        list.innerHTML = '';
        this.getAllHabits().forEach(habit => {
            const item = document.createElement('div');
            item.className = 'habit-color-item';
            const details = document.createElement('div');
            details.className = 'habit-details';
            details.innerHTML = `<div class="habit-color-dot" style="background-color: ${this.habitColors[habit] || '#ccc'}"></div><div class="habit-color-name">${habit}</div>`;
            const streak = this.calculateHabitStreak(habit);
            if (streak > 0) {
                const streakEl = document.createElement('div');
                streakEl.className = 'habit-streak';
                streakEl.textContent = `🔥 ${streak}`;
                details.appendChild(streakEl);
            }
            const actions = document.createElement('div');
            actions.className = 'habit-actions';
            actions.innerHTML = `<button class="habit-action-btn" title="Change color">🎨</button><button class="habit-action-btn" title="Edit habit name">✏️</button><button class="habit-action-btn" title="Delete habit">🗑️</button>`;
            actions.children[0].onclick = (e) => { e.stopPropagation(); this.showColorPalette(habit, e.target); };
            actions.children[1].onclick = (e) => { e.stopPropagation(); this.showHabitEditor(habit, item, details, actions); };
            actions.children[2].onclick = (e) => { e.stopPropagation(); this.removeHabit(habit); };
            item.appendChild(details);
            item.appendChild(actions);
            list.appendChild(item);
        });
    }

    calculateHabitStreak(habitName) {
        let streak = 0;
        let d = new Date();
        while (true) {
            const entry = this.entries[this.formatDate(d)];
            if (entry && entry.habits && entry.habits[habitName]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else break;
        }
        return streak;
    }

    showColorPalette(habit, target) {
        document.querySelector('.color-palette-popup')?.remove();
        const palette = document.createElement('div');
        palette.className = 'color-palette-popup';
        this.availableColors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.onclick = (e) => { e.stopPropagation(); this.updateHabitColor(habit, color); palette.remove(); };
            palette.appendChild(swatch);
        });
        document.body.appendChild(palette);
        const rect = target.getBoundingClientRect();
        palette.style.top = `${rect.bottom + window.scrollY + 5}px`;
        palette.style.left = `${rect.left + window.scrollX}px`;
        setTimeout(() => document.addEventListener('click', e => { if (!palette.contains(e.target)) palette.remove(); }, { once: true }), 0);
    }

    showHabitEditor(habit, item, details, actions) {
        details.style.display = 'none';
        actions.style.display = 'none';
        const form = document.createElement('form');
        form.className = 'habit-edit-form';
        form.innerHTML = `<input type="text" class="form-control habit-edit-input" value="${habit}"><button type="submit" class="btn btn--primary btn--sm">Save</button><button type="button" class="btn btn--outline btn--sm">Cancel</button>`;
        item.prepend(form);
        const input = form.querySelector('input');
        input.focus();
        input.select();
        const close = () => { form.remove(); details.style.display = 'flex'; actions.style.display = 'flex'; };
        form.onsubmit = (e) => { e.preventDefault(); this.editHabit(habit, input.value); close(); };
        form.children[2].onclick = close;
    }
    
    getRandomColor() { return this.availableColors[Math.floor(Math.random() * this.availableColors.length)]; }
    
    closeModal(id) { document.getElementById(id)?.classList.add('hidden'); if (id === 'dailyModal') this.selectedDate = null; }
    closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); document.querySelector('.color-palette-popup')?.remove(); this.selectedDate = null; }
    
    // ... Jump-To, Sync, Export, and Utility methods (unchanged) ...
    openJumpToModal() { document.getElementById('jumpDate').value = this.formatDate(new Date()); document.getElementById('jumpToModal').classList.remove('hidden'); }
    executeJump() { const val = document.getElementById('jumpDate').value; if (val) this.jumpToDate(new Date(val)); this.closeModal('jumpToModal'); }
    jumpToToday() { this.jumpToDate(new Date()); this.closeModal('jumpToModal'); }
    jumpToYesterday() { const d = new Date(); d.setDate(d.getDate() - 1); this.jumpToDate(d); this.closeModal('jumpToModal'); }
    jumpToWeekStart() { this.jumpToDate(this.getWeekStart(new Date())); this.closeModal('jumpToModal'); }
    jumpToMonthStart() { this.jumpToDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); this.closeModal('jumpToModal'); }
    jumpToDate(date) { this.currentDate = date; this.currentWeekStart = this.getWeekStart(date); this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1); this.currentYear = date.getFullYear(); this.switchView(this.currentView === 'monthly' ? 'monthly' : this.currentView === 'yearly' ? 'yearly' : 'weekly'); this.showToast(`Jumped to ${this.formatDateDisplay(date)} 🚀`, 'success'); }
    handleSyncButton() { this.saveUserDataToFirestore(); this.showToast('Syncing data...', 'success'); }
    updateSyncStatus(status) { const el = document.getElementById('syncStatus'); if (!el) return; el.classList.remove('online', 'syncing', 'error'); const text = el.querySelector('.status-text'); if (status === 'syncing') { text.textContent = 'Syncing...'; el.classList.add('syncing'); } else if (status === 'synced') { text.textContent = 'Synced'; el.classList.add('online'); } else if (status === 'error') { text.textContent = 'Sync Error'; el.classList.add('error'); } else if (status === 'firebase') { text.textContent = 'Firebase Connected'; el.classList.add('online'); } }
    exportData(format = 'json') { const data = { entries: this.entries, habits: this.habits, habitColors: this.habitColors, goals: this.goals, exportDate: new Date().toISOString(), version: "6.2.0", userName: this.userName, userEmail: this.userEmail }; const timestamp = new Date().toISOString().split('T')[0]; if (format === 'json') this.downloadFile(JSON.stringify(data, null, 2), `${this.userName.toLowerCase()}-tracker-${timestamp}.json`, 'application/json'); this.showToast(`Data exported as ${format.toUpperCase()}!`, 'success'); }
    downloadFile(content, filename, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    formatDate(date) { return date.toISOString().split('T')[0]; }
    formatDateDisplay(date) { return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
    showToast(message, type = 'success') { const toast = document.getElementById('toast'); const msg = document.getElementById('toastMessage'); if (!toast || !msg) return; msg.textContent = message; toast.className = `toast ${type}`; toast.classList.remove('hidden'); setTimeout(() => toast.classList.add('hidden'), 4000); }
}

if (document.readyState !== 'loading') {
    window.tracker = new FirebaseDailyTracker();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.tracker = new FirebaseDailyTracker();
    });
}