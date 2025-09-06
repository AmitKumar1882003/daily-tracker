
// FIREBASE-INTEGRATED Daily Activity Tracker - FINAL HOST-READY VERSION
// Version 13.1 - Stability, Performance & Code Quality Update

// Immediately apply theme from localStorage to prevent Flash of Unstyled Content (FOUC)
(function() {
    const theme = localStorage.getItem('dailyTrackerTheme') || 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
})();

console.log('🚀 Firebase Daily Tracker Loading - v13.1 (Host Ready)');

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyC8WUvIamuDYDWd4Ws9ocxEmdY73RJ_cho",
    authDomain: "daily-tracker-1ec5b.firebaseapp.com",
    projectId: "daily-tracker-1ec5b",
    storageBucket: "daily-tracker-1ec5b.firebasestorage.app",
    messagingSenderId: "1040028029564",
    appId: "1:1040028029564:web:10c2bd4f6b1fc1990aeff9",
    measurementId: "G-ZEZBMB10SL"
};

// --- GLOBAL VARIABLES ---
let auth, db;
let currentUser = null;

class FirebaseDailyTracker {
    
    // --- CORE INITIALIZATION & STATE ---

    constructor() {
        // State
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.currentYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.currentView = 'weekly';
        
        // User Data
        this.userName = "Amit";
        this.userId = null;
        this.entries = {};
        this.habits = []; 
        this.habitColors = {};
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        this.achievements = {};
        this.theme = localStorage.getItem('dailyTrackerTheme') || 'light';
        
        // Config
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4",
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        this.motivationalQuotes = [
            "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will. Your PG seat is waiting for your will to claim it.",
            "Every late night study session, every skipped outing, is a deposit into your future as a healer. Keep investing.",
            "Don't count the days, make the days count. Each topic you master is a life you'll one day save.",
            "Medicine is a science of uncertainty and an art of probability. Your hard work now is what will tip the scales in your patient's favor.",
            "The journey to a PG seat is a marathon, not a sprint. Pace yourself, stay consistent, and remember why you started.",
            "Your competition is not the thousands of other aspirants. It's the person you were yesterday. Be better than them.",
            "Time is the most valuable asset you have. Manage it like you would a critical patient – with precision, care, and a clear plan.",
            "A doctor's journey is paved with sacrifice and dedication. The rewards are not just in the degree, but in the trust of your patients.",
            "Procrastination is the thief of dreams. Your dream is to be a specialist. Don't let a thief steal it. Study now.",
            "Master the Grand Tests, and you master the art of time management under pressure. Treat every mock like the final exam.",
            "Consistency is more important than intensity. A few hours of focused study every single day is better than a 12-hour marathon once a week.",
            "Remember that for every minute you're not studying, someone else is, and they are getting ahead.",
            "The art of medicine consists of amusing the patient while nature cures the disease. First, you must master the art of learning.",
            "Doubt kills more dreams than failure ever will. Believe in your preparation, trust your process.",
            "The pain you feel today will be the strength you feel tomorrow. Each difficult concept you grasp makes you a stronger physician.",
            "To study the phenomena of disease without books is to sail an uncharted sea. Your books are your compass; your dedication is the wind in your sails.",
            "The best way to predict your future is to create it. Your NEET PG rank is not a matter of chance, but a matter of choice.",
            "Let your passion for healing be the fuel for your dedication. This is more than an exam; it's a calling.",
            "Time management is life management. Plan your revisions, schedule your breaks, and execute with discipline.",
            "One day, all this hard work will make sense. You'll be in an OT, or a clinic, and you'll be grateful for every single page you read.",
            "The good physician treats the disease; the great physician treats the patient who has the disease.",
            "Anatomy is the foundation. Physiology is the structure. Master them, and the building of your medical knowledge will stand tall.",
            "Every patient you will ever meet is a textbook waiting to be read. Study hard now, so you can read them well.",
            "The goal isn't to be better than anyone else, but to be better than you were yesterday.",
            "A surgeon's hands are guided by a student's mind. Sharpen your mind every single day.",
            "Don't just learn the facts. Understand the 'why' behind them. That is the essence of clinical correlation.",
            "Your library of knowledge is the most powerful pharmacy you will ever have access to.",
            "Obsess over the process of learning, and the results will take care of themselves.",
            "There is no substitute for hard work. 25,000 aspirants know this. Only the ones who live it will succeed.",
            "A day of revision is a day you arm yourself for a future battle against disease.",
            "The character of a physician is just as important as their knowledge. Build both.",
            "Discipline is choosing between what you want now and what you want most. You want that PG seat more.",
            "Every question you solve is a neuron pathway forged for success.",
            "It's not about how many hours you put in, but about how much you put into the hours.",
            "The cure for burnout is not rest. It's a reconnection with 'why' you started this journey.",
            "He who studies medicine without books sails an uncharted sea, but he who studies medicine without patients does not go to sea at all.",
            "Your sweat in practice will be your blood in the battlefield of the exam hall.",
            "Small improvements daily are the key to staggering long-term results.",
            "Be so good they can't ignore you. Let your rank be the proof.",
            "The human body is the most complex machine. Respect it by studying it relentlessly."
        ];
        this.ALL_ACHIEVEMENTS = {
          'first-entry': { title: 'Getting Started', description: 'Log your very first daily entry.', icon: '🎉' },
          'one-week-streak': { title: 'Week-Long Warrior', description: 'Maintain an entry streak for 7 consecutive days.', icon: '📅' },
          '30-day-streak': { title: '30-Day Streak', description: 'Maintain an entry streak for 30 consecutive days.', icon: '🔥' },
          'quarterly-streak': { title: 'Quarterly Review', description: 'Maintain an entry streak for 90 days.', icon: '🗓️' },
          'scholar': { title: 'Scholar', description: 'Write over 10,000 words in total across all entries.', icon: '✍️' },
          'novelist': { title: 'Novelist', description: 'Write over 50,000 words in total.', icon: '📚' },
          'goal-setter': { title: 'Goal Setter', description: 'Set at least one goal in every category (weekly, monthly, and yearly).', icon: '🎯' },
          'prolific-planner': { title: 'Prolific Planner', description: 'Create a total of 20 goals across all categories.', icon: '🗒️' },
          'master-planner': { title: 'Master Planner', description: 'Create a total of 50 goals.', icon: '📈' },
          'perfect-week': { title: 'Perfect Week', description: 'Complete all defined habits for every day in a single calendar week (Sun-Sat).', icon: '⭐' },
          'habit-master': { title: 'Habit Master', description: 'Complete a single habit 50 times in total.', icon: '💪' },
          'centurion': { title: 'Centurion', description: 'Complete a single habit 100 times.', icon: '💯' }
        };
        
        // Internal state
        this.autoSaveTimer = null;
        this.firebaseSyncTimer = null;
        this.habitChartInstance = null;
        
        // Performance: Cache DOM elements
        this.elements = {};
        
        this.initializeFirebase();
    }
    
    async initializeFirebase() {
        console.log('🔥 Initializing Firebase...');
        try {
            window.firebase.initializeApp(firebaseConfig);
            auth = window.firebase.auth();
            db = window.firebase.firestore();
            console.log('✅ Firebase initialized successfully');

            this.setupLoginListeners();

            auth.onAuthStateChanged((user) => {
                if (user) {
                    this.handleUserSignedIn(user);
                } else {
                    this.handleUserSignedOut();
                }
            });
            this.showLoginScreen();
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            this.showToast('Firebase initialization failed', 'error');
            this.showLoginScreen();
        }
    }

    initializeAppUI() {
        this.cacheDOMElements();
        this.updateUserHeader();
        this.displayMotivationalQuote();
        this.setupAppEventListeners();
        this.setupKeyboardShortcuts();
        this.initializeTheme();
        this.switchView('weekly'); // Start on weekly view
        this.setupGoalsSelectors();
        this.checkAchievements(true); // Initial check on load
    }
    
    // --- AUTHENTICATION & USER STATE ---

    handleUserSignedIn(user) {
        currentUser = user;
        this.userId = user.uid;
        this.userName = user.displayName || user.email.split('@')[0] || 'User';
        
        this.loadUserDataFromFirestore().then(() => {
            this.initializeAppUI();
            this.showMainApp();
            this.startFirebaseSync();
            this.showToast(`Welcome back, ${this.userName}! 🎉`, 'success');
        });
    }
    
    handleUserSignedOut() {
        currentUser = null;
        this.userId = null;
        this.userName = "User";
        this.entries = {};
        this.habits = [];
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        this.achievements = {};
        if (this.firebaseSyncTimer) {
            clearInterval(this.firebaseSyncTimer);
        }
        this.showLoginScreen();
    }

    async signIn() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginBtn = document.getElementById('loginBtn');
        const originalBtnHTML = loginBtn.innerHTML;

        if (!email || !password) return this.showToast('Please enter both email and password', 'warning');
        
        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Signing in...';
        try {
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
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnHTML;
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

    // --- DATA SYNC (FIRESTORE) ---

    async loadUserDataFromFirestore() {
        if (!this.userId) return;
        try {
            const userDoc = await db.collection('users').doc(this.userId).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                this.userName = data.userName || this.userName;
                // Load theme from Firestore and sync it
                if (data.theme) {
                    this.theme = data.theme;
                    localStorage.setItem('dailyTrackerTheme', this.theme);
                    document.documentElement.setAttribute('data-color-scheme', this.theme);
                }
                this.entries = data.entries || {};
                this.habits = data.habits || this.getDefaultHabits();
                this.habitColors = { ...this.getDefaultHabitColors(), ...(data.habitColors || {}) };
                this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
                this.achievements = data.achievements || {};
            } else {
                this.initializeDefaultData();
                await this.saveUserDataToFirestore({ isInitial: true }); // Initial save for new user
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            this.showToast('Error loading your data, using local defaults.', 'error');
            this.initializeDefaultData();
        }
    }
    
    async saveUserDataToFirestore(options = {}) {
        const { isInitial = false, silent = false } = options;
        if (!this.userId) return;
        
        if (!silent) this.updateSyncStatus('syncing');
        
        try {
            const userData = {
                userName: this.userName,
                theme: this.theme,
                entries: this.entries,
                habits: this.habits,
                habitColors: this.habitColors,
                goals: this.goals,
                achievements: this.achievements,
                lastUpdated: new Date().toISOString(),
                version: "13.1.0"
            };
            await db.collection('users').doc(this.userId).set(userData, { merge: true });
            
            if (!isInitial && !silent) {
                this.showToast('Data synced to cloud!', 'success');
            }
            if (!silent) {
                this.updateSyncStatus('synced');
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            if (!silent) {
                this.updateSyncStatus('error');
                this.showToast('Error syncing data to cloud', 'error');
            }
        }
    }
    
    startFirebaseSync() {
        if (this.firebaseSyncTimer) clearInterval(this.firebaseSyncTimer);
        this.firebaseSyncTimer = setInterval(() => {
            if (this.userId) this.saveUserDataToFirestore();
        }, 60000); // Sync every 60 seconds
    }

    // --- DEFAULT DATA & UI STATE ---
    
    initializeDefaultData() {
        this.habits = this.getDefaultHabits();
        this.habitColors = this.getDefaultHabitColors();
        this.entries = {
            [this.formatDate(new Date())]: { "text": "Welcome to your Daily Tracker! Edit this entry to get started.", "habits": { "Planning": true, "Study/Learning": true } }
        };
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        this.achievements = {};
    }

    getDefaultHabits() {
        return ["Study/Learning", "Exercise", "Reading", "Planning", "Review Sessions", "Project Work", "Skill Development", "Health Care"];
    }

    getDefaultHabitColors() {
        return {
            "Study/Learning": "#3B82F6", "Exercise": "#10B981", "Reading": "#EF4444",
            "Planning": "#8B5CF6", "Review Sessions": "#06B6D4", "Project Work": "#F59E0B",
            "Skill Development": "#EC4899", "Health Care": "#14B8A6"
        };
    }

    showLoginScreen() {
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
    
    showMainApp() {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }
    
    updateUserHeader() {
        if (this.elements.headerTitle) {
            this.elements.headerTitle.textContent = `Hi ${this.userName}! 🩺`;
        }
    }

    displayMotivationalQuote() {
        const quoteIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
        this.elements.dailyQuote.textContent = `"${this.motivationalQuotes[quoteIndex]}"`;
        this.elements.quoteAuthor.textContent = '— Daily Motivation';
    }

    // --- EVENT LISTENERS & SETUP ---
    
    cacheDOMElements() {
        const ids = [
            'loginOverlay', 'mainApp', 'loginBtn', 'loginEmail', 'loginPassword', 'headerTitle', 
            'dailyQuote', 'quoteAuthor', 'syncStatus', 'signOutBtn', 'dashboardTab', 'weeklyTab', 
            'monthlyTab', 'yearlyTab', 'goalsTab', 'achievementsTab', 'prevWeek', 'nextWeek', 
            'prevMonth', 'nextMonth', 'prevYear', 'nextYear', 'todayBtn', 'jumpToBtn', 'exportBtn', 
            'importBtn', 'importFileInput', 'settingsToggleBtn', 'settingsBtn', 'themeToggleBtn', 'actionsToggleBtn', 'syncBtn', 
            'dailyModal', 'entryViewModal', 'jumpToModal', 'settingsModal', 'toast', 'toastMessage',
            'closeModal', 'closeEntryView', 'closeJumpToModal', 'closeSettingsModal', 'saveEntry', 
            'quickSave', 'saveSettingsBtn', 'executeJump', 'jumpToday', 'jumpYesterday', 
            'jumpWeekStart', 'jumpMonthStart', 'addWeeklyTask', 'addMonthlyTask', 'addYearlyTask', 
            'addHabit', 'newHabit', 'newWeeklyTask', 'newMonthlyTask', 'newYearlyTask', 'dailyText', 
            'weekRange', 'calendarDays', 'habitColors', 'monthYear', 'monthlyCalendarDays', 
            'monthlySummaryContent', 'yearTitle', 'yearlyCalendarGrid', 'yearlySummaryContent', 
            'weekGoalSelector', 'monthGoalSelector', 'yearGoalSelector', 'weeklyTasksList', 
            'monthlyTasksList', 'yearlyTasksList', 'achievementsGrid', 'modalDate', 'wordCount', 
            'entryStreak', 'habitsList', 'jumpDate', 'entryViewDate', 'entryViewContent', 
            'userNameInput', 'weekScore', 'weekStreak', 'monthEntries', 'monthStreak', 'yearEntries',
            'yearBestStreak', 'yearGoals', 'dashboardView', 'weeklyView', 'monthlyView', 'yearlyView', 
            'goalsView', 'achievementsView', 'heatmapYearSelector', 'heatmapContainer', 'habitChart', 
            'streakHistoryContainer'
        ];
        ids.forEach(id => { this.elements[id] = document.getElementById(id); });
        this.elements.headerTitle = document.querySelector('.app-header h1');
    }

    setupLoginListeners() {
        this.addListener('loginBtn', 'click', this.signIn.bind(this));
        this.addEnterListener('loginEmail', this.signIn.bind(this));
        this.addEnterListener('loginPassword', this.signIn.bind(this));
    }
    
    setupAppEventListeners() {
        const listeners = {
            'signOutBtn': this.signOut, 
            'dashboardTab': () => this.switchView('dashboard'),
            'weeklyTab': () => this.switchView('weekly'),
            'monthlyTab': () => this.switchView('monthly'), 
            'yearlyTab': () => this.switchView('yearly'),
            'goalsTab': () => this.switchView('goals'), 
            'achievementsTab': () => this.switchView('achievements'),
            'prevWeek': () => this.navigateWeek(-1), 'nextWeek': () => this.navigateWeek(1), 
            'prevMonth': () => this.navigateMonth(-1), 'nextMonth': () => this.navigateMonth(1), 
            'prevYear': () => this.navigateYear(-1), 'nextYear': () => this.navigateYear(1), 
            'todayBtn': this.goToToday, 'jumpToBtn': this.openJumpToModal, 
            'exportBtn': () => this.exportData('json'), 'importBtn': () => this.elements.importFileInput.click(),
            'settingsBtn': this.openSettingsModal,
            'themeToggleBtn': this.toggleTheme,
            'syncBtn': () => this.saveUserDataToFirestore(), 'closeModal': () => this.closeModal('dailyModal'),
            'closeEntryView': () => this.closeModal('entryViewModal'), 'closeJumpToModal': () => this.closeModal('jumpToModal'),
            'closeSettingsModal': () => this.closeModal('settingsModal'), 'saveEntry': this.saveEntry,
            'quickSave': this.quickSave, 'saveSettingsBtn': this.saveSettings,
            'executeJump': this.executeJump, 'jumpToday': this.jumpToToday,
            'jumpYesterday': this.jumpToYesterday, 'jumpWeekStart': this.jumpToWeekStart,
            'jumpMonthStart': this.jumpToMonthStart, 'addWeeklyTask': () => this.addGoalTask('weekly'),
            'addMonthlyTask': () => this.addGoalTask('monthly'), 'addYearlyTask': () => this.addGoalTask('yearly'),
            'addHabit': this.addHabit
        };

        for (const [id, handler] of Object.entries(listeners)) {
            this.addListener(id, 'click', handler.bind(this));
        }
        
        this.addListener('importFileInput', 'change', this.importData.bind(this));
        this.addListener('heatmapYearSelector', 'change', () => this.renderHabitHeatmap());
        
        this.addEnterListener('newHabit', this.addHabit.bind(this));
        this.addEnterListener('newWeeklyTask', () => this.addGoalTask('weekly'));
        this.addEnterListener('newMonthlyTask', () => this.addGoalTask('monthly'));
        this.addEnterListener('newYearlyTask', () => this.addGoalTask('yearly'));
        
        this.elements.dailyText?.addEventListener('input', () => {
            this.scheduleAutoSave();
            this.updateWordCount();
        });
        this.setupModalCloseHandlers();
        this.setupDropdowns();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
            const isModalOpen = !!document.querySelector('.modal:not(.hidden)');

            if (isTyping && e.ctrlKey && e.key === 's') { e.preventDefault(); this.quickSave(); return; }
            if (e.key === 'Escape' && isModalOpen) { this.closeAllModals(); return; }
            if (isTyping) return;
            
            const viewNavMap = { 'weekly': this.navigateWeek, 'monthly': this.navigateMonth, 'yearly': this.navigateYear };
            if (e.key === 'ArrowLeft') viewNavMap[this.currentView]?.call(this, -1);
            if (e.key === 'ArrowRight') viewNavMap[this.currentView]?.call(this, 1);
            if (e.key === 'Enter' && !isModalOpen) this.openTodayEntry();
            if (e.key.toLowerCase() === 'g') this.switchView('goals');
            if (e.key.toLowerCase() === 's') { e.preventDefault(); this.saveUserDataToFirestore(); }
        });
    }

    setupModalCloseHandlers() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal.id);
            });
        });
    }

    setupDropdowns() {
        const actionsBtn = document.getElementById('actionsToggleBtn');
        const settingsBtn = document.getElementById('settingsToggleBtn');
        
        actionsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('actions-dropdown').classList.toggle('open');
            document.getElementById('settings-dropdown').classList.remove('open');
        });

        settingsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('settings-dropdown').classList.toggle('open');
            document.getElementById('actions-dropdown').classList.remove('open');
        });

        window.addEventListener('click', () => {
             document.querySelectorAll('.dropdown.open').forEach(dropdown => dropdown.classList.remove('open'));
        });
    }
    
    // --- VIEW SWITCHING & RENDERING ---

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
            'dashboard': this.renderDashboard,
            'weekly': () => { this.renderWeeklyCalendar(); this.renderHabitLegend(); },
            'monthly': () => { this.renderMonthlyCalendar(); this.renderMonthlySummary(); },
            'yearly': () => { this.renderYearlyCalendar(); this.renderYearlySummary(); },
            'goals': this.renderGoals,
            'achievements': this.renderAchievementsView
        };
        viewRenderMap[this.currentView]?.call(this);
    }
    
    // --- CALENDAR & DATE NAVIGATION ---

    navigateWeek(dir) { this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (dir * 7)); this.renderWeeklyCalendar(); }
    navigateMonth(dir) { this.currentMonth.setMonth(this.currentMonth.getMonth() + dir); this.renderMonthlyCalendar(); }
    navigateYear(dir) { this.currentYear += dir; this.renderYearlyCalendar(); }
    goToToday() { this.currentDate = new Date(); this.currentWeekStart = this.getWeekStart(this.currentDate); this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); this.currentYear = this.currentDate.getFullYear(); this.renderCurrentView(); }
    
    // --- WEEKLY VIEW ---

    renderWeeklyCalendar() {
        const weekEnd = new Date(this.currentWeekStart); weekEnd.setDate(weekEnd.getDate() + 6);
        this.elements.weekRange.textContent = `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
        this.updateWeekStats();
        const calendarDays = this.elements.calendarDays; calendarDays.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart); date.setDate(date.getDate() + i);
            calendarDays.appendChild(this.createWeeklyDayElement(date));
        }
    }
    
    updateWeekStats() {
        this.elements.weekScore.textContent = `Score: ${this.calculateWeekScore()}%`;
        this.elements.weekStreak.textContent = `🔥 Current Streak: ${this.calculateCurrentEntryStreak()} days`;
    }

    createWeeklyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'calendar-day'; dayEl.dataset.date = dateString; if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { if(entry.text) { const preview = document.createElement('div'); preview.className = 'day-preview'; preview.textContent = entry.text; preview.onclick = (e) => { e.stopPropagation(); this.openEntryView(date); }; dayEl.appendChild(preview); } const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
    // --- MONTHLY VIEW ---

    renderMonthlyCalendar() { this.elements.monthYear.textContent = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); this.updateMonthStats(); const calendarDays = this.elements.monthlyCalendarDays; calendarDays.innerHTML = ''; const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1); const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'monthly-day other-month'; calendarDays.appendChild(empty); } for (let day = 1; day <= lastDay.getDate(); day++) calendarDays.appendChild(this.createMonthlyDayElement(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day))); }
    
    updateMonthStats() { const stats = this.calculateMonthlyStats(); this.elements.monthEntries.textContent = `📝 ${stats.totalEntries} entries`; this.elements.monthStreak.textContent = `🔥 Best streak: ${stats.bestStreak} days`; }

    createMonthlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'monthly-day'; dayEl.dataset.date = dateString; if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { if (entry.text) { const preview = document.createElement('div'); preview.className = 'monthly-day-preview'; preview.textContent = entry.text; preview.onclick = (e) => { e.stopPropagation(); this.openEntryView(date); }; dayEl.appendChild(preview); } const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.slice(0, 4).forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
    renderMonthlySummary() { const stats = this.calculateMonthlyStats(); this.elements.monthlySummaryContent.innerHTML = `<div class="summary-stat"><span class="summary-label">📝 Total Entries</span><span class="summary-value">${stats.totalEntries}</span></div><div class="summary-stat"><span class="summary-label">🔥 Best Streak</span><span class="summary-value">${stats.bestStreak} days</span></div>`; }
    
    // --- YEARLY VIEW ---

    renderYearlyCalendar() { this.elements.yearTitle.textContent = this.currentYear; this.updateYearStats(); const grid = this.elements.yearlyCalendarGrid; grid.innerHTML = ''; for (let m = 0; m < 12; m++) grid.appendChild(this.createYearlyMonthElement(m)); }
    
    updateYearStats() { const stats = this.calculateYearlyStats(); this.elements.yearEntries.textContent = `📝 ${stats.totalEntries} entries`; this.elements.yearBestStreak.textContent = `🔥 Best streak: ${stats.bestStreak} days`; this.elements.yearGoals.textContent = `🎯 ${stats.completedGoals}/${stats.totalGoals} goals completed`; }
    
    createYearlyMonthElement(month) { const monthEl = document.createElement('div'); monthEl.className = 'yearly-month'; const header = document.createElement('div'); header.className = 'yearly-month-header'; header.textContent = new Date(this.currentYear, month).toLocaleDateString('en-US', { month: 'long' }); monthEl.appendChild(header); const grid = document.createElement('div'); grid.className = 'yearly-month-grid'; ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => { const h = document.createElement('div'); h.className = 'yearly-day-header'; h.textContent = day; grid.appendChild(h); }); const firstDay = new Date(this.currentYear, month, 1); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'yearly-day other-month'; grid.appendChild(empty); } const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate(); for (let day = 1; day <= daysInMonth; day++) grid.appendChild(this.createYearlyDayElement(new Date(this.currentYear, month, day))); monthEl.appendChild(grid); return monthEl; }
    
    createYearlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'yearly-day'; dayEl.textContent = date.getDate(); dayEl.dataset.date = dateString; dayEl.title = this.formatDateDisplay(date); if (date.toDateString() === new Date().toDateString()) dayEl.classList.add('today'); const entry = this.entries[dateString]; if (entry) { dayEl.classList.add('has-entry'); const habitCount = Object.keys(entry.habits || {}).length; if (habitCount > 0) { const completion = Object.values(entry.habits).filter(Boolean).length / habitCount; if (completion >= 0.8) dayEl.style.backgroundColor = '#10B981'; else if (completion >= 0.5) dayEl.style.backgroundColor = '#F59E0B'; else dayEl.style.backgroundColor = '#EF4444'; dayEl.style.color = 'white'; } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
    renderYearlySummary() { const stats = this.calculateYearlyStats(); const completion = Math.round((stats.completedGoals / Math.max(stats.totalGoals, 1)) * 100); this.elements.yearlySummaryContent.innerHTML = `<div class="summary-stat"><span class="summary-label">📝 Total Entries</span><span class="summary-value">${stats.totalEntries}</span></div><div class="summary-stat"><span class="summary-label">🔥 Best Streak</span><span class="summary-value">${stats.bestStreak} days</span></div><div class="summary-stat"><span class="summary-label">🎯 Goals Completed</span><span class="summary-value">${stats.completedGoals}/${stats.totalGoals}</span></div><div class="summary-stat"><span class="summary-label">📊 Completion Rate</span><span class="summary-value">${completion}%</span></div>`; }

    // --- GOALS VIEW ---

    setupGoalsSelectors() { this.setupWeekSelector(); this.setupMonthSelector(); this.setupYearSelector(); }
    setupWeekSelector() { const sel = this.elements.weekGoalSelector; sel.innerHTML = ''; for (let i = -4; i <= 4; i++) { const d = new Date(this.currentWeekStart); d.setDate(d.getDate() + i * 7); const weekNum = this.getWeekNumber(d); const key = `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`; const opt = document.createElement('option'); opt.value = key; opt.textContent = `Week ${weekNum}`; if (i === 0) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadWeeklyGoals(); }
    setupMonthSelector() { const sel = this.elements.monthGoalSelector; sel.innerHTML = ''; for (let i = -6; i <= 6; i++) { const d = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + i, 1); const opt = document.createElement('option'); opt.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; opt.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); if (i === 0) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadMonthlyGoals(); }
    setupYearSelector() { const sel = this.elements.yearGoalSelector; sel.innerHTML = ''; const year = this.currentDate.getFullYear(); for (let y = year - 2; y <= year + 5; y++) { const opt = document.createElement('option'); opt.value = y.toString(); opt.textContent = y.toString(); if (y === year) opt.selected = true; sel.appendChild(opt); } sel.onchange = () => this.loadYearlyGoals(); }
    
    renderGoals() { this.loadWeeklyGoals(); this.loadMonthlyGoals(); this.loadYearlyGoals(); }
    loadWeeklyGoals() { const key = this.elements.weekGoalSelector.value; this.renderTasksList('weekly', key); }
    loadMonthlyGoals() { const key = this.elements.monthGoalSelector.value; this.renderTasksList('monthly', key); }
    loadYearlyGoals() { const key = this.elements.yearGoalSelector.value; this.renderTasksList('yearly', key); }
    
    renderTasksList(period, key) { const container = this.elements[`${period}TasksList`]; const tasks = this.goals[period]?.[key]?.tasks || []; if (!container) return; container.innerHTML = ''; if (tasks.length === 0) { container.innerHTML = `<div class="empty-state"><p>No goals set for this period yet. 🎯</p></div>`; return; } const completed = tasks.filter(t => t.completed).length; const progress = Math.round((completed / tasks.length) * 100); container.innerHTML = `<div class="progress-bar"><div class="progress-header"><span>Progress: ${completed}/${tasks.length}</span><span>${progress}%</span></div><div class="progress-track"><div class="progress-fill" style="width: ${progress}%"></div></div></div>`; tasks.forEach(task => container.appendChild(this.createTaskElement(task, period, key))); }
    
    createTaskElement(task, period, key) { const item = document.createElement('div'); item.className = `task-item ${task.completed ? 'completed' : ''}`; item.innerHTML = `<input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}><span class="task-text">${task.text}</span><button class="task-remove" aria-label="Remove task">×</button>`; item.querySelector('.task-checkbox').onchange = () => this.toggleTask(task.id, period, key); item.querySelector('.task-remove').onclick = () => this.removeTask(task.id, period, key); return item; }
    
    addGoalTask(period) { const input = this.elements[`new${period.charAt(0).toUpperCase() + period.slice(1)}Task`]; const text = input.value.trim(); if (!text) { this.showToast('Please enter a goal', 'warning'); return; } const key = this.elements[`${period === 'weekly' ? 'week' : period}GoalSelector`].value; if (!this.goals[period][key]) this.goals[period][key] = { tasks: [] }; this.goals[period][key].tasks.push({ id: Date.now().toString(), text, completed: false }); input.value = ''; this.renderGoals(); this.checkAchievements(); this.saveUserDataToFirestore(); this.showToast('Goal added! 🎯', 'success'); }
    
    toggleTask(id, period, key) { const task = this.goals[period]?.[key]?.tasks.find(t => t.id === id); if (task) { task.completed = !task.completed; this.renderGoals(); this.saveUserDataToFirestore(); if (task.completed) this.showToast('Goal completed! 🎉', 'success'); } }
    
    removeTask(id, period, key) { if (this.goals[period]?.[key]) { this.goals[period][key].tasks = this.goals[period][key].tasks.filter(t => t.id !== id); this.renderGoals(); this.saveUserDataToFirestore(); this.showToast('Goal removed', 'warning'); } }

    // --- MODAL HANDLING & ENTRY MANAGEMENT ---

    openTodayEntry() { this.openDayEntry(new Date()); }
    
    openDayEntry(date) { this.selectedDate = date; const dateString = this.formatDate(date); const entry = this.entries[dateString] || { text: '', habits: {} }; this.elements.modalDate.textContent = `📝 ${this.formatDateDisplay(date)}`; this.elements.dailyText.value = entry.text || ''; this.updateWordCount(); this.updateEntryStreak(); this.renderHabits(entry.habits || {}); this.elements.dailyModal.classList.remove('hidden'); setTimeout(() => this.elements.dailyText.focus(), 50); }
    
    openEntryView(date) { const entry = this.entries[this.formatDate(date)]; if (!entry) return; this.elements.entryViewDate.textContent = `📖 Entry for ${this.formatDateDisplay(date)}`; const content = this.elements.entryViewContent; content.innerHTML = ''; if (entry.text) content.innerHTML += `<div><h4>📝 Daily Entry</h4><div class="entry-full-text">${entry.text}</div></div>`; if (entry.habits) { let habitsHtml = '<div><h4>✅ Habits</h4><div class="entry-habits-list">'; this.habits.forEach(habit => { const completed = entry.habits[habit]; habitsHtml += `<div class="entry-habit-item"><div class="entry-habit-status ${completed ? 'completed' : 'not-completed'}" style="${completed ? 'background-color:' + (this.habitColors[habit] || '#ccc') : ''}"></div><div class="entry-habit-name">${habit}</div></div>`; }); habitsHtml += '</div></div>'; content.innerHTML += habitsHtml; } this.elements.entryViewModal.classList.remove('hidden'); }

    openJumpToModal() { this.elements.jumpDate.value = this.formatDate(new Date()); this.elements.jumpToModal.classList.remove('hidden'); }
    openSettingsModal() { this.closeAllModals(); this.elements.userNameInput.value = this.userName; this.elements.settingsModal.classList.remove('hidden'); }

    closeModal(id) { document.getElementById(id)?.classList.add('hidden'); if (id === 'dailyModal') this.selectedDate = null; }
    closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); this.selectedDate = null; }

    saveCurrentEntry(isAutoSave = false) {
        if (!this.selectedDate) return;
        const dateString = this.formatDate(this.selectedDate);
        const text = this.elements.dailyText.value || '';
        const habits = {};
        this.habits.forEach((habit, index) => { habits[habit] = document.getElementById(`habit-${index}`)?.checked; });
        this.entries[dateString] = { text, habits, timestamp: new Date().toISOString() };
        if (isAutoSave) { this.updateAutoSaveStatus(); }
    }
    
    quickSave() { this.saveCurrentEntry(); this.checkAchievements(); this.saveUserDataToFirestore(); this.showToast('Entry saved and synced! 💾', 'success'); }
    saveEntry() { this.saveCurrentEntry(); this.closeModal('dailyModal'); this.checkAchievements(); this.renderCurrentView(); this.saveUserDataToFirestore(); this.showToast('Entry saved successfully! 🎉', 'success'); }
    saveSettings() { const newName = this.elements.userNameInput.value.trim(); if (newName && newName !== this.userName) { this.userName = newName; this.updateUserHeader(); this.saveUserDataToFirestore(); this.showToast('Settings saved!', 'success'); } this.closeModal('settingsModal'); }
    
    // --- HABIT MANAGEMENT ---

    renderHabits(completedHabits = {}) {
        const habitsList = this.elements.habitsList;
        habitsList.innerHTML = '';
        this.habits.forEach((habit, index) => {
            habitsList.appendChild(this.createHabitElement(habit, index, completedHabits[habit]));
        });
    }
    
    createHabitElement(habit, index, isCompleted) {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';

        if (habitItem.dataset.isEditing === 'true') {
            // Render edit form (this logic is now inside editHabit)
        } else {
            const details = document.createElement('div');
            details.className = 'habit-details';
            details.innerHTML = `
                <input type="checkbox" class="habit-checkbox" id="habit-${index}" ${isCompleted ? 'checked' : ''}>
                <label for="habit-${index}" class="habit-label">${habit}</label>
            `;
            details.querySelector('input').addEventListener('change', () => this.scheduleAutoSave());

            const actions = document.createElement('div');
            actions.className = 'habit-actions';
            actions.innerHTML = `
                <button class="habit-action-btn edit-habit-btn" aria-label="Edit habit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L18.5 2.5z"></path></svg>
                </button>
                <button class="habit-action-btn remove-habit-btn" aria-label="Remove habit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            actions.querySelector('.edit-habit-btn').onclick = () => this.editHabit(habit, habitItem);
            actions.querySelector('.remove-habit-btn').onclick = () => this.removeHabit(habit);
            
            habitItem.appendChild(details);
            habitItem.appendChild(actions);
        }
        return habitItem;
    }

    addHabit() {
        const newHabitInput = this.elements.newHabit;
        const habitName = newHabitInput.value.trim();
        if (habitName && !this.habits.includes(habitName)) {
            this.habits.push(habitName);
            if (!this.habitColors[habitName]) {
                const available = this.availableColors.filter(c => !Object.values(this.habitColors).includes(c));
                this.habitColors[habitName] = available.length > 0 ? available[0] : this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
            }
            newHabitInput.value = '';
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.saveUserDataToFirestore();
            this.showToast('Habit added!', 'success');
        } else if (this.habits.includes(habitName)) {
            this.showToast('Habit already exists', 'warning');
        }
    }
    
    editHabit(oldName, habitItemElement) {
        habitItemElement.dataset.isEditing = 'true';
        const originalCompleted = this.getCurrentCompletedHabits()[oldName] || false;
        habitItemElement.innerHTML = `
            <div class="habit-edit-form">
                <div class="habit-edit-controls">
                    <input type="text" class="form-control form-control--sm habit-edit-input" value="${oldName}">
                    <button class="btn btn--primary btn--sm save-edit-btn">Save</button>
                    <button class="btn btn--outline btn--sm cancel-edit-btn">Cancel</button>
                </div>
                <div class="habit-edit-colors">
                    ${this.availableColors.map(color => `
                        <div class="habit-edit-swatch ${this.habitColors[oldName] === color ? 'selected' : ''}" 
                             style="background-color: ${color};" data-color="${color}"></div>
                    `).join('')}
                </div>
            </div>`;

        const input = habitItemElement.querySelector('.habit-edit-input');
        const colorSwatches = habitItemElement.querySelectorAll('.habit-edit-swatch');
        let selectedColor = this.habitColors[oldName];

        colorSwatches.forEach(swatch => {
            swatch.onclick = () => {
                colorSwatches.forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                selectedColor = swatch.dataset.color;
            };
        });

        const cancelEditing = () => {
            habitItemElement.dataset.isEditing = 'false';
            this.renderHabits(this.getCurrentCompletedHabits());
        };

        habitItemElement.querySelector('.save-edit-btn').onclick = () => {
            const newName = input.value.trim();
            if (newName && newName !== oldName && this.habits.includes(newName)) {
                this.showToast('A habit with this name already exists.', 'error');
                return;
            }
            if (!newName) {
                this.showToast('Habit name cannot be empty.', 'error');
                return;
            }

            // Update data structures
            const index = this.habits.indexOf(oldName);
            if (index > -1) this.habits[index] = newName;
            
            delete this.habitColors[oldName];
            this.habitColors[newName] = selectedColor;

            Object.values(this.entries).forEach(entry => {
                if (entry.habits && entry.habits.hasOwnProperty(oldName)) {
                    entry.habits[newName] = entry.habits[oldName];
                    delete entry.habits[oldName];
                }
            });

            habitItemElement.dataset.isEditing = 'false';
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.renderCurrentView();
            this.saveUserDataToFirestore();
            this.showToast('Habit updated!', 'success');
        };
        habitItemElement.querySelector('.cancel-edit-btn').onclick = cancelEditing;
    }

    removeHabit(habitName) {
        if (confirm(`Are you sure you want to remove the habit "${habitName}"? This will remove it from all past entries.`)) {
            this.habits = this.habits.filter(h => h !== habitName);
            delete this.habitColors[habitName];
            Object.values(this.entries).forEach(entry => {
                if (entry.habits) delete entry.habits[habitName];
            });
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.renderCurrentView();
            this.saveUserDataToFirestore();
            this.showToast('Habit removed.', 'warning');
        }
    }
    
    renderHabitLegend() {
        const container = this.elements.habitColors;
        container.innerHTML = '';
        this.habits.forEach(habit => {
            const item = document.createElement('div');
            item.className = 'habit-color-item';
            const streak = this.calculateHabitStreak(habit);
            item.innerHTML = `
                <div class="habit-color-dot" style="background-color: ${this.habitColors[habit] || '#ccc'}"></div>
                <span class="habit-color-name">${habit}</span>
                ${streak > 1 ? `<span class="habit-streak">🔥 ${streak}</span>` : ''}
            `;
            container.appendChild(item);
        });
    }

    // --- DASHBOARD RENDERING ---

    renderDashboard() {
        this.renderHabitHeatmap();
        this.renderHabitFrequencyChart();
        this.renderStreakHistory();
    }
    
    renderHabitHeatmap() {
        this.setupHeatmapYearSelector();
        const year = parseInt(this.elements.heatmapYearSelector.value, 10);
        const container = this.elements.heatmapContainer;
        container.innerHTML = '';

        const heatmapEl = document.createElement('div');
        heatmapEl.className = 'heatmap';
        
        const daysOfWeekEl = document.createElement('div');
        daysOfWeekEl.className = 'heatmap-days-of-week';
        ['', 'M', '', 'W', '', 'F', ''].forEach(d => daysOfWeekEl.innerHTML += `<div class="heatmap-day-header">${d}</div>`);
        
        const gridEl = document.createElement('div');
        gridEl.className = 'heatmap-grid';

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        // Add padding for the first day of the week
        for (let i = 0; i < startDate.getDay(); i++) {
            gridEl.appendChild(document.createElement('div'));
        }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateString = this.formatDate(d);
            const entry = this.entries[dateString];
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            let level = 0;
            if (entry) {
                const habitCount = Object.keys(entry.habits || {}).length;
                if (habitCount > 0) {
                    const completion = Object.values(entry.habits).filter(Boolean).length / habitCount;
                    if (completion >= 0.9) level = 4;
                    else if (completion >= 0.6) level = 3;
                    else if (completion >= 0.3) level = 2;
                    else if (completion > 0) level = 1;
                } else if (entry.text) {
                     level = 1; // Has text but no habits
                }
            }
            
            cell.dataset.level = level;
            cell.title = `${this.formatDateDisplay(d)}: Level ${level}`;
            cell.onclick = () => this.openDayEntry(d);
            gridEl.appendChild(cell);
        }
        
        heatmapEl.appendChild(daysOfWeekEl);
        heatmapEl.appendChild(gridEl);
        container.appendChild(heatmapEl);
    }
    
    renderHabitFrequencyChart() {
        const counts = this.habits.reduce((acc, habit) => ({...acc, [habit]: 0}), {});
        Object.values(this.entries).forEach(entry => {
            if (entry.habits) {
                Object.keys(entry.habits).forEach(habit => {
                    if (entry.habits[habit] && counts.hasOwnProperty(habit)) {
                        counts[habit]++;
                    }
                });
            }
        });

        const sortedHabits = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const labels = sortedHabits.map(h => h[0]);
        const data = sortedHabits.map(h => h[1]);
        const colors = sortedHabits.map(h => this.habitColors[h[0]] || '#ccc');

        const ctx = this.elements.habitChart.getContext('2d');
        if (this.habitChartInstance) {
            this.habitChartInstance.destroy();
        }
        this.habitChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completion Count',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c + 'B3'), // Add some opacity for border
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(128, 128, 128, 0.1)' },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim(),
                            precision: 0
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
                        }
                    }
                }
            }
        });
    }
    
    renderStreakHistory() {
        const container = this.elements.streakHistoryContainer;
        container.innerHTML = '';
        const allStreaks = this.calculateAllEntryStreaks();
        const currentStreak = this.calculateCurrentEntryStreak();

        if (allStreaks.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No streaks recorded yet. Keep logging daily entries!</p></div>`;
            return;
        }

        const bestStreak = Math.max(...allStreaks.map(s => s.length), 0);
        
        allStreaks.sort((a, b) => b.length - a.length).slice(0, 5).forEach((streak, index) => {
            const item = document.createElement('div');
            item.className = 'streak-history-item';

            const isBest = streak.length === bestStreak;
            const isCurrent = streak.isCurrent && streak.length === currentStreak;
            
            item.innerHTML = `
                <div class="streak-length">🔥 ${streak.length} days</div>
                <div class="streak-details">
                    <div class="streak-dates">${this.formatDateDisplay(streak.start)} - ${this.formatDateDisplay(streak.end)}</div>
                    <div class="streak-badges">
                        ${isBest ? `<span class="streak-badge best">🏆 BEST</span>` : ''}
                        ${isCurrent ? `<span class="streak-badge current">CURRENT</span>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // --- ACHIEVEMENTS ---
    
    checkAchievements(isInitialLoad = false) {
        const stats = this.getGlobalStats();
        
        // Conditions
        if (stats.totalEntries > 0) this.awardAchievement('first-entry');
        if (stats.currentStreak >= 7) this.awardAchievement('one-week-streak');
        if (stats.currentStreak >= 30) this.awardAchievement('30-day-streak');
        if (stats.bestStreak >= 90) this.awardAchievement('quarterly-streak');
        if (stats.totalWords >= 10000) this.awardAchievement('scholar');
        if (stats.totalWords >= 50000) this.awardAchievement('novelist');
        if (stats.hasWeeklyGoal && stats.hasMonthlyGoal && stats.hasYearlyGoal) this.awardAchievement('goal-setter');
        if (stats.totalGoals >= 20) this.awardAchievement('prolific-planner');
        if (stats.totalGoals >= 50) this.awardAchievement('master-planner');
        if (stats.hasPerfectWeek) this.awardAchievement('perfect-week');

        const habitCompletions = this.calculateAllHabitCompletions();
        if (Object.values(habitCompletions).some(count => count >= 50)) this.awardAchievement('habit-master');
        if (Object.values(habitCompletions).some(count => count >= 100)) this.awardAchievement('centurion');
        
        if (!isInitialLoad && this.currentView === 'achievements') {
            this.renderAchievementsView();
        }
    }

    awardAchievement(id) {
        if (!this.achievements[id]) {
            this.achievements[id] = { unlockedAt: new Date().toISOString() };
            const achievement = this.ALL_ACHIEVEMENTS[id];
            this.showToast(`🏆 Achievement Unlocked: ${achievement.title}`, 'success');
            this.saveUserDataToFirestore();
        }
    }
    
    renderAchievementsView() {
        const grid = this.elements.achievementsGrid;
        grid.innerHTML = '';
        for (const [id, ach] of Object.entries(this.ALL_ACHIEVEMENTS)) {
            const unlockedData = this.achievements[id];
            const card = document.createElement('div');
            card.className = `achievement-card ${unlockedData ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-details">
                    <h3 class="achievement-title">${ach.title}</h3>
                    <p class="achievement-desc">${ach.description}</p>
                    ${unlockedData ? `<div class="achievement-unlocked-date">Unlocked on ${this.formatDateDisplay(new Date(unlockedData.unlockedAt))}</div>` : ''}
                </div>
            `;
            grid.appendChild(card);
        }
    }

    // --- DATA CALCULATIONS & STATISTICS ---
    
    calculateWeekScore() {
        let totalHabits = 0; let completedHabits = 0;
        for (let i = 0; i < 7; i++) { const d = new Date(this.currentWeekStart); d.setDate(d.getDate() + i); const entry = this.entries[this.formatDate(d)]; if (entry?.habits) { totalHabits += this.habits.length; completedHabits += Object.values(entry.habits).filter(Boolean).length; } }
        return totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
    }

    calculateMonthlyStats() {
        let totalEntries = 0;
        const daysWithEntries = Object.keys(this.entries)
            .filter(d => d.startsWith(`${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`))
            .sort();
        
        totalEntries = daysWithEntries.length;
        const bestStreak = this.calculateBestEntryStreak(daysWithEntries);
        
        return { totalEntries, bestStreak };
    }

    calculateYearlyStats() {
        let totalEntries = 0;
        const daysWithEntries = Object.keys(this.entries)
            .filter(d => d.startsWith(this.currentYear.toString()))
            .sort();
            
        totalEntries = daysWithEntries.length;
        const bestStreak = this.calculateBestEntryStreak(daysWithEntries);
        
        const yearGoals = this.goals.yearly[this.currentYear]?.tasks || [];
        const totalGoals = yearGoals.length;
        const completedGoals = yearGoals.filter(g => g.completed).length;
        
        return { totalEntries, bestStreak, totalGoals, completedGoals };
    }

    calculateCurrentEntryStreak() {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365 * 5; i++) { // Check up to 5 years back
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            if (this.entries[this.formatDate(d)]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
    
    calculateBestEntryStreak(dateStrings) {
        if (!dateStrings || dateStrings.length === 0) return 0;
        let bestStreak = 0;
        let currentStreak = 0;
        for (let i = 0; i < dateStrings.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prevDate = new Date(dateStrings[i - 1]);
                const currDate = new Date(dateStrings[i]);
                prevDate.setDate(prevDate.getDate() + 1);
                if (prevDate.toDateString() === currDate.toDateString()) {
                    currentStreak++;
                } else {
                    bestStreak = Math.max(bestStreak, currentStreak);
                    currentStreak = 1;
                }
            }
        }
        return Math.max(bestStreak, currentStreak);
    }
    
    calculateAllEntryStreaks() {
        const sortedDates = Object.keys(this.entries).sort().map(ds => new Date(ds));
        if (sortedDates.length === 0) return [];

        const streaks = [];
        let currentStreak = { start: sortedDates[0], end: sortedDates[0], length: 1, isCurrent: false };

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = sortedDates[i - 1];
            const currDate = sortedDates[i];
            const expectedNextDate = new Date(prevDate);
            expectedNextDate.setDate(expectedNextDate.getDate() + 1);

            if (expectedNextDate.toDateString() === currDate.toDateString()) {
                currentStreak.length++;
                currentStreak.end = currDate;
            } else {
                streaks.push(currentStreak);
                currentStreak = { start: currDate, end: currDate, length: 1 };
            }
        }
        streaks.push(currentStreak);
        
        // Check if the latest streak is current
        const lastEntryDate = sortedDates[sortedDates.length - 1];
        const today = new Date();
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        if (lastEntryDate.toDateString() === today.toDateString() || lastEntryDate.toDateString() === yesterday.toDateString()) {
             streaks[streaks.length - 1].isCurrent = true;
        }

        return streaks;
    }
    
    calculateHabitStreak(habitName) {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365 * 5; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const entry = this.entries[this.formatDate(d)];
            if (entry && entry.habits && entry.habits[habitName]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    getGlobalStats() {
        const totalEntries = Object.keys(this.entries).length;
        const totalWords = Object.values(this.entries).reduce((sum, entry) => sum + (entry.text?.split(/\s+/).filter(Boolean).length || 0), 0);
        const streaks = this.calculateAllEntryStreaks();
        const currentStreak = streaks.find(s => s.isCurrent)?.length || 0;
        const bestStreak = Math.max(...streaks.map(s => s.length), 0);
        const totalGoals = Object.values(this.goals).flatMap(p => Object.values(p)).flatMap(g => g.tasks).length;

        const hasWeeklyGoal = Object.values(this.goals.weekly).some(w => w.tasks && w.tasks.length > 0);
        const hasMonthlyGoal = Object.values(this.goals.monthly).some(m => m.tasks && m.tasks.length > 0);
        const hasYearlyGoal = Object.values(this.goals.yearly).some(y => y.tasks && y.tasks.length > 0);
        
        const hasPerfectWeek = this.checkForPerfectWeek();

        return { totalEntries, totalWords, currentStreak, bestStreak, totalGoals, hasWeeklyGoal, hasMonthlyGoal, hasYearlyGoal, hasPerfectWeek };
    }

    checkForPerfectWeek() {
        if (this.habits.length === 0) return false;
        const sortedDates = Object.keys(this.entries).sort();
        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            if (date.getDay() === 6) { // It's a Saturday, check the preceding week
                let isPerfect = true;
                for (let i = 0; i < 7; i++) {
                    const checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() - i);
                    const entry = this.entries[this.formatDate(checkDate)];
                    if (!entry || !entry.habits || !this.habits.every(h => entry.habits[h])) {
                        isPerfect = false;
                        break;
                    }
                }
                if (isPerfect) return true;
            }
        }
        return false;
    }

    calculateAllHabitCompletions() {
        const counts = this.habits.reduce((acc, habit) => ({...acc, [habit]: 0}), {});
        Object.values(this.entries).forEach(entry => {
            if (entry.habits) {
                Object.keys(entry.habits).forEach(habit => {
                    if (entry.habits[habit] && counts.hasOwnProperty(habit)) {
                        counts[habit]++;
                    }
                });
            }
        });
        return counts;
    }

    // --- UTILITIES & HELPERS ---
    
    addListener(id, event, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    }
    
    addEnterListener(id, handler) {
        const el = document.getElementById(id);
        if(el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') handler(); });
    }

    formatDate(date) { return date.toISOString().split('T')[0]; }
    formatDateDisplay(date) { return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
    getWeekStart(d) { d = new Date(d); const day = d.getDay(); const diff = d.getDate() - day; return new Date(d.setDate(diff)); }
    getWeekNumber(d) { d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7); return weekNo; }
    
    getCurrentCompletedHabits() {
        if (!this.selectedDate) return {};
        const entry = this.entries[this.formatDate(this.selectedDate)];
        return entry ? entry.habits : {};
    }

    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimer);
        this.updateAutoSaveStatus('saving');
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentEntry(true);
        }, 1500);
    }

    updateAutoSaveStatus(status = 'saved') {
        const autoSaveEl = document.querySelector('.auto-save-status');
        if (autoSaveEl) {
            if (status === 'saving') {
                autoSaveEl.textContent = 'Saving...';
                autoSaveEl.style.color = 'var(--color-warning)';
            } else {
                autoSaveEl.textContent = 'Auto-saved!';
                autoSaveEl.style.color = 'var(--color-success)';
                setTimeout(() => { autoSaveEl.textContent = 'Auto-save enabled'; }, 2000);
            }
        }
    }

    updateWordCount() {
        const text = this.elements.dailyText.value;
        const count = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
        this.elements.wordCount.textContent = `${count} words`;
    }

    updateEntryStreak() {
        const streak = this.calculateCurrentEntryStreak();
        this.elements.entryStreak.textContent = `🔥 ${streak} day streak`;
    }
    
    updateSyncStatus(status) { // ready, syncing, synced, error
        const syncStatusEl = this.elements.syncStatus;
        if (syncStatusEl) {
            syncStatusEl.className = `sync-status ${status}`;
            syncStatusEl.querySelector('.status-text').textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    }

    executeJump() { this.currentDate = new Date(this.elements.jumpDate.value + 'T12:00:00'); this.goToToday(); this.closeModal('jumpToModal'); }
    jumpToToday() { this.currentDate = new Date(); this.goToToday(); this.closeModal('jumpToModal'); }
    jumpToYesterday() { const d = new Date(); d.setDate(d.getDate() - 1); this.currentDate = d; this.goToToday(); this.closeModal('jumpToModal'); }
    jumpToWeekStart() { this.currentDate = this.getWeekStart(new Date()); this.goToToday(); this.closeModal('jumpToModal'); }
    jumpToMonthStart() { const d = new Date(); this.currentDate = new Date(d.getFullYear(), d.getMonth(), 1); this.goToToday(); this.closeModal('jumpToModal'); }
    
    setupHeatmapYearSelector() {
        const selector = this.elements.heatmapYearSelector;
        const currentYear = new Date().getFullYear();
        if (selector.options.length > 0) return; // Already populated
        for (let year = currentYear; year >= currentYear - 5; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selector.appendChild(option);
        }
    }

    exportData(format = 'json') {
        const data = {
            version: "13.1.0",
            exportedAt: new Date().toISOString(),
            userData: { entries: this.entries, habits: this.habits, habitColors: this.habitColors, goals: this.goals, achievements: this.achievements }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('Are you sure you want to import this data? This will overwrite your current data.')) {
                    const userData = data.userData;
                    this.entries = userData.entries || {};
                    this.habits = userData.habits || [];
                    this.habitColors = userData.habitColors || {};
                    this.goals = userData.goals || {};
                    this.achievements = userData.achievements || {};
                    this.saveUserDataToFirestore().then(() => {
                        this.renderCurrentView();
                        this.showToast('Data imported successfully!', 'success');
                    });
                }
            } catch (error) {
                this.showToast('Failed to parse import file.', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    initializeTheme() {
        this.updateThemeButton(this.theme);
        document.documentElement.setAttribute('data-color-scheme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('dailyTrackerTheme', this.theme);
        this.initializeTheme();
        this.saveUserDataToFirestore({ silent: true }); // Sync theme change
    }
    
    updateThemeButton(theme) {
        const btn = this.elements.themeToggleBtn;
        if(btn) btn.innerHTML = theme === 'light'
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Dark Mode`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> Light Mode`;
    }

    showToast(message, type = 'success') { // success, error, warning
        const toast = this.elements.toast;
        this.elements.toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => { toast.className = 'toast hidden'; }, 4000);
    }
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    new FirebaseDailyTracker();
});