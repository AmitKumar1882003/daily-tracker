// FIREBASE-INTEGRATED Daily Activity Tracker - FINAL HOST-READY VERSION
// Version 17.0 - PWA & Habit Editor Modal

// Immediately apply theme from localStorage to prevent Flash of Unstyled Content (FOUC)
(function() {
    const theme = localStorage.getItem('dailyTrackerTheme') || 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    // Note: Palette is applied after the main app object is instantiated.
})();

console.log('🚀 Firebase Daily Tracker Loading - v17.0 (PWA & Habit Editor Modal)');

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
        this.changeLog = [];
        
        // Config
        this.setupPalettes();
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
        this.currentTheme = 'light';
        this.currentPalette = 'default-teal';
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
        this.initializeTheme(); // Apply themes and palettes first
        this.updateUserHeader();
        this.displayMotivationalQuote();
        this.setupAppEventListeners();
        this.setupKeyboardShortcuts();
        this.switchView('weekly'); // Start on weekly view
        this.setupGoalsSelectors();
        this.checkAchievements(true); // Initial check on load
    }
    
    // --- AUTHENTICATION & USER STATE ---

    handleUserSignedIn(user) {
        currentUser = user;
        this.userId = user.uid;
        this.userName = user.displayName || user.email.split('@')[0] || 'User';
        
        this.downloadDataFromFirestore(true).then(() => {
            this.initializeAppUI();
            this.showMainApp();
            this.startFirebaseSync();
            this.showToast(`Welcome back, ${this.userName}! Synced from cloud.`, 'success');
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
        this.changeLog = [];
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
                    this.showToast('Account created successfully!', 'success');
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

    async confirmAndDownloadData() {
        if (confirm('Are you sure you want to download from the cloud? This will overwrite any unsaved local changes.')) {
            await this.downloadDataFromFirestore();
        }
    }

    async downloadDataFromFirestore(isInitial = false) {
        if (!this.userId) return;
        this.updateSyncStatus('syncing');
        try {
            const userDoc = await db.collection('users').doc(this.userId).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                this.userName = data.userName || this.userName;
                this.entries = data.entries || {};
                this.habits = data.habits || [];
                this.habitColors = data.habitColors || {};
                this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
                this.achievements = data.achievements || {};
                this.changeLog = data.changeLog || [];
                
                if (!isInitial) {
                    this.logChange('📥', 'Downloaded latest data from cloud.');
                    this.showToast('Data downloaded from cloud.', 'success');
                    this.initializeAppUI(); // Full re-render after manual download
                }
            } else {
                // This is a new user, initialize defaults and do an initial upload
                this.initializeDefaultData();
                await this.uploadDataToFirestore(true); 
            }
             this.updateSyncStatus('synced');
        } catch (error) {
            console.error("Error loading user data:", error);
            this.updateSyncStatus('error');
            this.showToast('Error downloading data from cloud.', 'error');
            if (isInitial) {
                // If initial load fails, use local defaults to not block the user
                this.initializeDefaultData();
            }
        }
    }
    
    async uploadDataToFirestore(isSilent = false) {
        if (!this.userId) return;
        this.updateSyncStatus('syncing');
        try {
            const userData = {
                userName: this.userName,
                entries: this.entries,
                habits: this.habits,
                habitColors: this.habitColors,
                goals: this.goals,
                achievements: this.achievements,
                changeLog: this.changeLog,
                lastUpdated: new Date().toISOString(),
                version: "17.0.0"
            };
            await db.collection('users').doc(this.userId).set(userData, { merge: true });
            if (!isSilent) {
                this.logChange('☁️', 'Data uploaded to the cloud.');
                this.showToast('Data uploaded to cloud!', 'success');
            }
            this.updateSyncStatus('synced');
        } catch (error) {
            console.error("Error saving user data:", error);
            this.updateSyncStatus('error');
            this.showToast('Error uploading data to cloud', 'error');
        }
    }
    
    startFirebaseSync() {
        if (this.firebaseSyncTimer) clearInterval(this.firebaseSyncTimer);
        // Automatic upload every 3 minutes
        this.firebaseSyncTimer = setInterval(() => {
            if (this.userId) this.uploadDataToFirestore(true); // Run silently in the background
        }, 180000); 
    }

    // --- DEFAULT DATA & UI STATE ---
    
    initializeDefaultData() {
        this.habits = [];
        this.habitColors = {};
        this.entries = {};
        this.goals = { weekly: {}, monthly: {}, yearly: {} };
        this.achievements = {};
        this.changeLog = [{ icon: '🎉', description: 'Account created!', timestamp: new Date().toISOString() }];
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
            this.elements.headerTitle.textContent = `Hi, ${this.userName}.`;
        }
    }

    async fetchMotivationalQuote() {
        try {
            const response = await fetch('https://type.fit/api/quotes');
            if (!response.ok) throw new Error('Network response was not ok');
            const quotes = await response.json();
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            let author = quote.author || 'Unknown';
            if (author === 'type.fit') author = 'Unknown';
            return { text: `"${quote.text}"`, author: `— ${author}` };
        } catch (error) {
            console.error('Failed to fetch motivational quote:', error);
            return null; // Return null to indicate failure
        }
    }

    async displayMotivationalQuote() {
        const quoteContainer = this.elements.motivationalQuote;
        quoteContainer.classList.add('loading');

        try {
            const quote = await this.fetchMotivationalQuote();
            if (quote) {
                this.elements.dailyQuote.textContent = quote.text;
                this.elements.quoteAuthor.textContent = quote.author;
            } else {
                // Fallback to internal quotes
                const fallbackQuoteIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
                this.elements.dailyQuote.textContent = `"${this.motivationalQuotes[fallbackQuoteIndex]}"`;
                this.elements.quoteAuthor.textContent = '— Daily Motivation';
            }
        } finally {
            quoteContainer.classList.remove('loading');
        }
    }

    // --- EVENT LISTENERS & SETUP ---
    
    cacheDOMElements() {
        const ids = [
            'loginOverlay', 'mainApp', 'loginBtn', 'loginEmail', 'loginPassword', 'headerTitle', 
            'motivationalQuote', 'dailyQuote', 'quoteAuthor', 'quoteLoader', 'syncStatus', 'signOutBtn', 'dashboardTab', 'weeklyTab', 
            'monthlyTab', 'yearlyTab', 'goalsTab', 'achievementsTab', 'prevWeek', 'nextWeek', 
            'prevMonth', 'nextMonth', 'prevYear', 'nextYear', 'todayBtn', 'jumpToBtn', 'exportBtn', 
            'importBtn', 'importFileInput', 'settingsToggleBtn', 'settingsBtn', 'themeToggleBtn', 'actionsToggleBtn', 'uploadBtn', 'downloadBtn', 'syncHistoryBtn',
            'dailyModal', 'entryViewModal', 'jumpToModal', 'settingsModal', 'syncHistoryModal', 'habitEditModal', 'toast', 'toastMessage',
            'closeModal', 'closeEntryView', 'closeJumpToModal', 'closeSettingsModal', 'closeSyncHistoryModal', 'closeHabitEditModal', 'saveEntry', 
            'quickSave', 'saveSettingsBtn', 'executeJump', 'jumpToday', 'jumpYesterday', 
            'jumpWeekStart', 'jumpMonthStart', 'addWeeklyTask', 'addMonthlyTask', 'addYearlyTask', 
            'addHabit', 'newHabit', 'newWeeklyTask', 'newMonthlyTask', 'newYearlyTask', 'dailyText', 
            'weekRange', 'calendarDays', 'habitColors', 'monthYear', 'monthlyCalendarDays', 
            'monthlySummaryContent', 'yearTitle', 'yearlyCalendarGrid', 'yearlySummaryContent', 
            'weekGoalSelector', 'monthGoalSelector', 'yearGoalSelector', 'weeklyTasksList', 
            'monthlyTasksList', 'yearlyTasksList', 'achievementsGrid', 'modalDate', 'wordCount', 
            'entryStreak', 'habitsList', 'jumpDate', 'entryViewDate', 'entryViewContent', 
            'userNameInput', 'paletteSelector', 'syncHistoryList', 'weekScore', 'weekStreak', 'monthEntries', 'monthStreak', 'yearEntries',
            'yearBestStreak', 'yearGoals', 'dashboardView', 'weeklyView', 'monthlyView', 'yearlyView', 
            'goalsView', 'achievementsView', 'heatmapYearSelector', 'heatmapContainer', 'habitChart', 
            'streakHistoryContainer', 'originalHabitName', 'habitEditName', 'habitEditColorSwatches',
            'habitEditColorPicker', 'deleteHabitBtn', 'saveHabitChangesBtn'
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
            'syncHistoryBtn': this.openSyncHistoryModal,
            'themeToggleBtn': this.toggleTheme,
            'uploadBtn': () => this.uploadDataToFirestore(),
            'downloadBtn': this.confirmAndDownloadData,
            'closeModal': () => this.closeModal('dailyModal'),
            'closeEntryView': () => this.closeModal('entryViewModal'), 'closeJumpToModal': () => this.closeModal('jumpToModal'),
            'closeSettingsModal': () => this.closeModal('settingsModal'), 'closeSyncHistoryModal': () => this.closeModal('syncHistoryModal'),
            'closeHabitEditModal': () => this.closeModal('habitEditModal'),
            'saveEntry': this.saveEntry,
            'quickSave': this.quickSave, 'saveSettingsBtn': this.saveSettings,
            'executeJump': this.executeJump, 'jumpToday': this.jumpToToday,
            'jumpYesterday': this.jumpToYesterday, 'jumpWeekStart': this.jumpToWeekStart,
            'jumpMonthStart': this.jumpToMonthStart, 'addWeeklyTask': () => this.addGoalTask('weekly'),
            'addMonthlyTask': () => this.addGoalTask('monthly'), 'addYearlyTask': () => this.addGoalTask('yearly'),
            'addHabit': this.addHabit,
            'saveHabitChangesBtn': this.saveHabitChanges,
            'deleteHabitBtn': this.deleteHabit
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
        this.setupDragAndDropHabits();
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
            if (e.key.toLowerCase() === 's' && e.ctrlKey) { e.preventDefault(); this.uploadDataToFirestore(); }
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

    createWeeklyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'calendar-day'; dayEl.dataset.date = dateString; if (this.isSameDay(date, new Date())) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { if(entry.text) { const preview = document.createElement('div'); preview.className = 'day-preview'; preview.textContent = entry.text; preview.onclick = (e) => { e.stopPropagation(); this.openEntryView(date); }; dayEl.appendChild(preview); } const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
    // --- MONTHLY VIEW ---

    renderMonthlyCalendar() { this.elements.monthYear.textContent = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); this.updateMonthStats(); const calendarDays = this.elements.monthlyCalendarDays; calendarDays.innerHTML = ''; const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1); const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'monthly-day other-month'; calendarDays.appendChild(empty); } for (let day = 1; day <= lastDay.getDate(); day++) calendarDays.appendChild(this.createMonthlyDayElement(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day))); }
    
    updateMonthStats() { const stats = this.calculateMonthlyStats(); this.elements.monthEntries.textContent = `📝 ${stats.totalEntries} entries`; this.elements.monthStreak.textContent = `🔥 Best streak: ${stats.bestStreak} days`; }

    createMonthlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'monthly-day'; dayEl.dataset.date = dateString; if (this.isSameDay(date, new Date())) dayEl.classList.add('today'); const dayNum = document.createElement('div'); dayNum.className = 'day-number'; dayNum.textContent = date.getDate(); dayEl.appendChild(dayNum); const entry = this.entries[dateString]; if (entry) { if (entry.text) { const preview = document.createElement('div'); preview.className = 'monthly-day-preview'; preview.textContent = entry.text; preview.onclick = (e) => { e.stopPropagation(); this.openEntryView(date); }; dayEl.appendChild(preview); } const completed = Object.keys(entry.habits || {}).filter(h => entry.habits[h]); if (completed.length > 0) { const indicator = document.createElement('div'); indicator.className = 'habits-indicator'; completed.slice(0, 4).forEach(habit => { const dot = document.createElement('div'); dot.className = 'habit-dot'; dot.style.backgroundColor = this.habitColors[habit] || '#ccc'; dot.title = habit; indicator.appendChild(dot); }); dayEl.appendChild(indicator); } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
    renderMonthlySummary() { const stats = this.calculateMonthlyStats(); this.elements.monthlySummaryContent.innerHTML = `<div class="summary-stat"><span class="summary-label">📝 Total Entries</span><span class="summary-value">${stats.totalEntries}</span></div><div class="summary-stat"><span class="summary-label">🔥 Best Streak</span><span class="summary-value">${stats.bestStreak} days</span></div>`; }
    
    // --- YEARLY VIEW ---

    renderYearlyCalendar() { this.elements.yearTitle.textContent = this.currentYear; this.updateYearStats(); const grid = this.elements.yearlyCalendarGrid; grid.innerHTML = ''; for (let m = 0; m < 12; m++) grid.appendChild(this.createYearlyMonthElement(m)); }
    
    updateYearStats() { const stats = this.calculateYearlyStats(); this.elements.yearEntries.textContent = `📝 ${stats.totalEntries} entries`; this.elements.yearBestStreak.textContent = `🔥 Best streak: ${stats.bestStreak} days`; this.elements.yearGoals.textContent = `🎯 ${stats.completedGoals}/${stats.totalGoals} goals completed`; }
    
    createYearlyMonthElement(month) { const monthEl = document.createElement('div'); monthEl.className = 'yearly-month'; const header = document.createElement('div'); header.className = 'yearly-month-header'; header.textContent = new Date(this.currentYear, month).toLocaleDateString('en-US', { month: 'long' }); monthEl.appendChild(header); const grid = document.createElement('div'); grid.className = 'yearly-month-grid'; ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => { const h = document.createElement('div'); h.className = 'yearly-day-header'; h.textContent = day; grid.appendChild(h); }); const firstDay = new Date(this.currentYear, month, 1); for (let i = 0; i < firstDay.getDay(); i++) { const empty = document.createElement('div'); empty.className = 'yearly-day other-month'; grid.appendChild(empty); } const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate(); for (let day = 1; day <= daysInMonth; day++) grid.appendChild(this.createYearlyDayElement(new Date(this.currentYear, month, day))); monthEl.appendChild(grid); return monthEl; }
    
    createYearlyDayElement(date) { const dateString = this.formatDate(date); const dayEl = document.createElement('div'); dayEl.className = 'yearly-day'; dayEl.textContent = date.getDate(); dayEl.dataset.date = dateString; dayEl.title = this.formatDateDisplay(date); if (this.isSameDay(date, new Date())) dayEl.classList.add('today'); const entry = this.entries[dateString]; if (entry) { dayEl.classList.add('has-entry'); const habitCount = Object.keys(entry.habits || {}).length; if (habitCount > 0) { const completion = Object.values(entry.habits).filter(Boolean).length / habitCount; if (completion >= 0.8) dayEl.style.backgroundColor = 'var(--color-primary)'; else if (completion >= 0.5) dayEl.style.backgroundColor = 'var(--color-warning)'; else dayEl.style.backgroundColor = 'var(--color-error)'; dayEl.style.color = 'white'; } } dayEl.onclick = () => this.openDayEntry(date); return dayEl; }
    
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
    
    addGoalTask(period) {
        const input = this.elements[`new${period.charAt(0).toUpperCase() + period.slice(1)}Task`];
        const text = input.value.trim();
        if (!text) { this.showToast('Please enter a goal', 'warning'); return; }
        const key = this.elements[`${period === 'weekly' ? 'week' : period}GoalSelector`].value;
        if (!this.goals[period][key]) this.goals[period][key] = { tasks: [] };
        this.goals[period][key].tasks.push({ id: Date.now().toString(), text, completed: false });
        input.value = '';
        this.logChange('🎯', `Added ${period} goal: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
        this.renderGoals();
        this.checkAchievements();
        this.uploadDataToFirestore(true);
        this.showToast('Goal added! 🎯', 'success');
    }
    
    toggleTask(id, period, key) {
        const task = this.goals[period]?.[key]?.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            const logText = `${task.completed ? 'Completed' : 'Marked goal incomplete'}: "${task.text.substring(0, 30)}${task.text.length > 30 ? '...' : ''}"`;
            this.logChange(task.completed ? '✔️' : '🔄', logText);
            this.renderGoals();
            this.uploadDataToFirestore(true);
            if (task.completed) this.showToast('Goal completed! 🎉', 'success');
        }
    }
    
    removeTask(id, period, key) {
        if (this.goals[period]?.[key]) {
            const taskText = this.goals[period][key].tasks.find(t => t.id === id)?.text || 'a goal';
            this.goals[period][key].tasks = this.goals[period][key].tasks.filter(t => t.id !== id);
            this.logChange('❌', `Removed goal: "${taskText.substring(0, 30)}${taskText.length > 30 ? '...' : ''}"`);
            this.renderGoals();
            this.uploadDataToFirestore(true);
            this.showToast('Goal removed', 'warning');
        }
    }

    // --- MODAL HANDLING & ENTRY MANAGEMENT ---

    openTodayEntry() { this.openDayEntry(new Date()); }
    
    openDayEntry(date) { this.selectedDate = date; const dateString = this.formatDate(date); const entry = this.entries[dateString] || { text: '', habits: {} }; this.elements.modalDate.textContent = `📝 ${this.formatDateDisplay(date)}`; this.elements.dailyText.value = entry.text || ''; this.updateWordCount(); this.updateEntryStreak(); this.renderHabits(entry.habits || {}); this.elements.dailyModal.classList.remove('hidden'); setTimeout(() => this.elements.dailyText.focus(), 50); }
    
    openEntryView(date) { const entry = this.entries[this.formatDate(date)]; if (!entry) return; this.elements.entryViewDate.textContent = `📖 Entry for ${this.formatDateDisplay(date)}`; const content = this.elements.entryViewContent; content.innerHTML = ''; if (entry.text) content.innerHTML += `<div><h4>📝 Daily Entry</h4><div class="entry-full-text">${entry.text}</div></div>`; if (entry.habits) { let habitsHtml = '<div><h4>✅ Habits</h4><div class="entry-habits-list">'; this.habits.forEach(habit => { const completed = entry.habits[habit]; habitsHtml += `<div class="entry-habit-item"><div class="entry-habit-status ${completed ? 'completed' : 'not-completed'}" style="${completed ? 'background-color:' + (this.habitColors[habit] || '#ccc') : ''}"></div><div class="entry-habit-name">${habit}</div></div>`; }); habitsHtml += '</div></div>'; content.innerHTML += habitsHtml; } this.elements.entryViewModal.classList.remove('hidden'); }

    openJumpToModal() { this.elements.jumpDate.value = this.formatDate(new Date()); this.elements.jumpToModal.classList.remove('hidden'); }
    openSettingsModal() { this.closeAllModals(); this.elements.userNameInput.value = this.userName; this.renderPaletteSelector(); this.elements.settingsModal.classList.remove('hidden'); }
    openSyncHistoryModal() { this.renderSyncHistory(); this.elements.syncHistoryModal.classList.remove('hidden'); }

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
    
    quickSave() { this.saveCurrentEntry(); this.logChange('💾', `Quick saved entry for ${this.formatDateDisplay(this.selectedDate)}`); this.checkAchievements(); this.uploadDataToFirestore(); this.showToast('Entry saved and synced! 💾', 'success'); }
    saveEntry() { this.saveCurrentEntry(); this.closeModal('dailyModal'); this.logChange('📝', `Saved entry for ${this.formatDateDisplay(this.selectedDate)}`); this.checkAchievements(); this.renderCurrentView(); this.uploadDataToFirestore(); this.showToast('Entry saved successfully! 🎉', 'success'); }
    saveSettings() { const newName = this.elements.userNameInput.value.trim(); if (newName && newName !== this.userName) { this.userName = newName; this.updateUserHeader(); this.logChange('👤', `Display name changed to "${newName}"`); this.uploadDataToFirestore(); this.showToast('Settings saved!', 'success'); } this.closeModal('settingsModal'); }
    
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
        habitItem.setAttribute('draggable', 'true');

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
        `;
        actions.querySelector('.edit-habit-btn').onclick = () => this.openHabitEditor(habit);
        
        habitItem.appendChild(details);
        habitItem.appendChild(actions);
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
            this.logChange('➕', `Added habit: "${habitName}"`);
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.uploadDataToFirestore(true);
            this.showToast('Habit added!', 'success');
        } else if (this.habits.includes(habitName)) {
            this.showToast('Habit already exists', 'warning');
        }
    }
    
    openHabitEditor(habitName) {
        this.elements.originalHabitName.value = habitName;
        this.elements.habitEditName.value = habitName;
        const currentColor = this.habitColors[habitName] || '#cccccc';
        this.elements.habitEditColorPicker.value = currentColor;

        const swatchesContainer = this.elements.habitEditColorSwatches;
        swatchesContainer.innerHTML = '';
        this.availableColors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'habit-edit-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            if (color === currentColor) {
                swatch.classList.add('selected');
            }
            swatch.onclick = () => {
                this.elements.habitEditColorPicker.value = color;
                swatchesContainer.querySelector('.selected')?.classList.remove('selected');
                swatch.classList.add('selected');
            };
            swatchesContainer.appendChild(swatch);
        });

        this.elements.habitEditColorPicker.oninput = () => {
             swatchesContainer.querySelector('.selected')?.classList.remove('selected');
        }

        this.elements.habitEditModal.classList.remove('hidden');
    }

    saveHabitChanges() {
        const oldName = this.elements.originalHabitName.value;
        const newName = this.elements.habitEditName.value.trim();
        const newColor = this.elements.habitEditColorPicker.value;

        if (!newName) {
            this.showToast('Habit name cannot be empty.', 'error');
            return;
        }

        if (newName !== oldName && this.habits.includes(newName)) {
            this.showToast('A habit with this name already exists.', 'error');
            return;
        }

        // Update data structures
        const index = this.habits.indexOf(oldName);
        if (index > -1) this.habits[index] = newName;
        
        delete this.habitColors[oldName];
        this.habitColors[newName] = newColor;

        Object.values(this.entries).forEach(entry => {
            if (entry.habits && entry.habits.hasOwnProperty(oldName)) {
                entry.habits[newName] = entry.habits[oldName];
                delete entry.habits[oldName];
            }
        });

        this.logChange('✏️', `Updated habit: "${oldName}" to "${newName}"`);
        this.closeModal('habitEditModal');
        this.renderHabits(this.getCurrentCompletedHabits());
        this.renderHabitLegend();
        this.renderCurrentView();
        this.uploadDataToFirestore(true);
        this.showToast('Habit updated!', 'success');
    }
    
    deleteHabit() {
        const habitName = this.elements.originalHabitName.value;
        if (confirm(`Are you sure you want to permanently delete the habit "${habitName}"? This will remove it from all past and future entries.`)) {
            this.habits = this.habits.filter(h => h !== habitName);
            delete this.habitColors[habitName];
            Object.values(this.entries).forEach(entry => {
                if (entry.habits) delete entry.habits[habitName];
            });
            this.logChange('🗑️', `Deleted habit: "${habitName}"`);
            this.closeModal('habitEditModal');
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.renderCurrentView();
            this.uploadDataToFirestore(true);
            this.showToast('Habit deleted.', 'warning');
        }
    }
    
    setupDragAndDropHabits() {
        const list = this.elements.habitsList;
        let draggedHabitName = null;

        list.addEventListener('dragstart', (e) => {
            const habitItem = e.target.closest('.habit-item');
            if (habitItem && habitItem.getAttribute('draggable') === 'true') {
                draggedHabitName = habitItem.querySelector('.habit-label').textContent;
                setTimeout(() => {
                    habitItem.classList.add('dragging');
                }, 0);
            }
        });

        list.addEventListener('dragend', (e) => {
            const habitItem = e.target.closest('.habit-item');
            if (habitItem) {
                habitItem.classList.remove('dragging');
            }
            draggedHabitName = null;
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const targetItem = e.target.closest('.habit-item');
            list.querySelectorAll('.habit-item').forEach(item => {
                item.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            if (targetItem && targetItem.querySelector('.habit-label').textContent !== draggedHabitName) {
                const rect = targetItem.getBoundingClientRect();
                const offset = e.clientY - rect.top - (rect.height / 2);
                if (offset < 0) {
                    targetItem.classList.add('drag-over-top');
                } else {
                    targetItem.classList.add('drag-over-bottom');
                }
            }
        });

        list.addEventListener('dragleave', (e) => {
            e.target.closest('.habit-item')?.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetItem = e.target.closest('.habit-item');
            list.querySelectorAll('.habit-item').forEach(item => {
                item.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            
            if (!targetItem || !draggedHabitName) return;

            const targetHabitName = targetItem.querySelector('.habit-label').textContent;
            if (targetHabitName === draggedHabitName) return;

            const oldIndex = this.habits.indexOf(draggedHabitName);
            let targetIndex = this.habits.indexOf(targetHabitName);
            
            if (oldIndex === -1 || targetIndex === -1) return;
            
            const [movedHabit] = this.habits.splice(oldIndex, 1);
            
            // Recalculate targetIndex after splice
            targetIndex = this.habits.indexOf(targetHabitName);

            const rect = targetItem.getBoundingClientRect();
            const offset = e.clientY - rect.top - (rect.height / 2);
            const insertionIndex = (offset < 0) ? targetIndex : targetIndex + 1;
            
            this.habits.splice(insertionIndex, 0, movedHabit);
            
            this.logChange('↕️', 'Reordered habits.');
            this.renderHabits(this.getCurrentCompletedHabits());
            this.renderHabitLegend();
            this.uploadDataToFirestore(true);
        });
    }

    renderHabitLegend() {
        const container = this.elements.habitColors;
        if (!container) return;
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
                const habitCount = this.habits.length;
                if (habitCount > 0) {
                    const completedCount = Object.values(entry.habits || {}).filter(Boolean).length;
                    const completion = completedCount / habitCount;
                    if (completion >= 0.9) level = 4;
                    else if (completion >= 0.6) level = 3;
                    else if (completion >= 0.3) level = 2;
                    else if (completion > 0) level = 1;
                } else if (entry.text) {
                     level = 1; // Has text but no habits
                }
            }
            
            cell.dataset.level = level;
            cell.title = `${this.formatDateDisplay(d)}: ${Object.values(entry?.habits || {}).filter(Boolean).length} habits`;
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
            this.logChange('🏆', `Unlocked achievement: ${achievement.title}`);
            this.showToast(`🏆 Achievement Unlocked: ${achievement.title}`, 'success');
            this.uploadDataToFirestore(true);
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
            d.setHours(12, 0, 0, 0); // Normalize time
            d.setDate(d.getDate() - i);
            if (this.entries[this.formatDate(d)]) {
                streak++;
            } else {
                if (i === 0) continue; // Allow skipping today
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
                const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

                if (dayDiff === 1) {
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
        if (sortedDates.length > 0) {
            let currentStreak = { start: sortedDates[0], end: sortedDates[0], length: 1 };
            for (let i = 1; i < sortedDates.length; i++) {
                const dayDiff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 3600 * 24);
                if (dayDiff === 1) {
                    currentStreak.length++;
                    currentStreak.end = sortedDates[i];
                } else {
                    streaks.push(currentStreak);
                    currentStreak = { start: sortedDates[i], end: sortedDates[i], length: 1 };
                }
            }
            streaks.push(currentStreak);
        }
        
        // Check if the latest streak is current
        const lastStreak = streaks[streaks.length - 1];
        if (lastStreak) {
            const today = new Date();
            const lastEntryDate = lastStreak.end;
            const dayDiffFromToday = (today.getTime() - lastEntryDate.getTime()) / (1000 * 3600 * 24);
            if (dayDiffFromToday < 2) {
                 lastStreak.isCurrent = true;
            }
        }

        return streaks;
    }
    
    calculateHabitStreak(habitName) {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365 * 5; i++) {
            const d = new Date(today);
            d.setHours(12, 0, 0, 0);
            d.setDate(d.getDate() - i);
            const entry = this.entries[this.formatDate(d)];
            if (entry && entry.habits && entry.habits[habitName]) {
                streak++;
            } else {
                 if (i === 0 && !entry) continue; // Allow skipping today if no entry
                break;
            }
        }
        return streak;
    }

    getGlobalStats() {
        const totalEntries = Object.keys(this.entries).length;
        const totalWords = Object.values(this.entries).reduce((sum, entry) => sum + (entry.text?.split(/\s+/).filter(Boolean).length || 0), 0);
        const streaks = this.calculateAllEntryStreaks();
        const currentStreak = streaks.find(s => s.isCurrent)?.length || this.calculateCurrentEntryStreak();
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
        if (el) el.addEventListener(event, handler.bind(this));
    }
    
    addEnterListener(id, handler) {
        const el = document.getElementById(id);
        if(el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') handler.call(this); });
    }

    formatDate(date) { 
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    }
    formatDateDisplay(date) { return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
    isSameDay(d1, d2) { return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); }
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
            this.uploadDataToFirestore(true); // Auto-save also triggers a silent upload
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
                setTimeout(() => { autoSaveEl.textContent = 'Auto-save enabled'; autoSaveEl.style.color = 'var(--color-text-secondary)';}, 2000);
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

    executeJump() { this.currentDate = new Date(this.elements.jumpDate.value); this.goToToday(); this.closeModal('jumpToModal'); }
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
            version: "17.0.0",
            exportedAt: new Date().toISOString(),
            userData: { entries: this.entries, habits: this.habits, habitColors: this.habitColors, goals: this.goals, achievements: this.achievements, changeLog: this.changeLog }
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
                    this.changeLog = userData.changeLog || [];
                    this.logChange('📥', `Imported data from file: ${file.name}`);
                    this.uploadDataToFirestore().then(() => {
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
    
    // --- THEME & PALETTE MANAGEMENT ---
    
    initializeTheme() {
        this.currentTheme = localStorage.getItem('dailyTrackerTheme') || 'light';
        this.currentPalette = localStorage.getItem('dailyTrackerPalette') || 'default-teal';
        this.updateThemeButton(this.currentTheme);
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.applyPalette(this.currentPalette);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('dailyTrackerTheme', this.currentTheme);
        this.initializeTheme();
        this.logChange('🎨', `Switched to ${this.currentTheme} mode.`);
    }

    applyPalette(paletteName) {
        const palette = this.palettes[paletteName];
        if (!palette) return;

        for (const [key, value] of Object.entries(palette.colors)) {
            document.documentElement.style.setProperty(key, value);
        }

        localStorage.setItem('dailyTrackerPalette', paletteName);
        this.currentPalette = paletteName;
        this.updatePaletteSelectorUI(); // Re-render selector to update selection
        this.renderCurrentView(); // Re-render view to apply colors to canvas charts etc.
    }
    
    renderPaletteSelector() {
        const container = this.elements.paletteSelector;
        if (!container) return;
        container.innerHTML = '';
        Object.entries(this.palettes).forEach(([id, palette]) => {
            const swatch = document.createElement('div');
            swatch.className = 'palette-swatch';
            swatch.dataset.paletteId = id;
            swatch.innerHTML = `
                <div class="palette-colors">
                    <div class="palette-color-chip" style="background-color: ${palette.preview.bg};"></div>
                    <div class="palette-color-chip" style="background-color: ${palette.preview.primary};"></div>
                    <div class="palette-color-chip" style="background-color: ${palette.preview.secondary};"></div>
                </div>
                <div class="palette-info">${palette.name}</div>
            `;
            swatch.onclick = () => {
                this.applyPalette(id);
                this.logChange('🎨', `Theme changed to ${palette.name}.`);
            };
            container.appendChild(swatch);
        });
        this.updatePaletteSelectorUI();
    }
    
    updatePaletteSelectorUI() {
        document.querySelectorAll('.palette-swatch').forEach(swatch => {
            swatch.classList.toggle('selected', swatch.dataset.paletteId === this.currentPalette);
        });
    }
    
    updateThemeButton(theme) {
        const btn = this.elements.themeToggleBtn;
        if(btn) btn.innerHTML = theme === 'light'
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Dark Mode`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> Light Mode`;
    }

    // --- CHANGE HISTORY ---
    
    logChange(icon, description) {
        const newLog = {
            icon,
            description,
            timestamp: new Date().toISOString(),
        };
        this.changeLog.unshift(newLog);
        // Keep the log to a reasonable size (20 entries) to optimize Firebase storage
        if (this.changeLog.length > 20) {
            this.changeLog = this.changeLog.slice(0, 20);
        }
    }
    
    renderSyncHistory() {
        const container = this.elements.syncHistoryList;
        if (!container) return;
        if (this.changeLog.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No changes recorded yet.</p></div>`;
            return;
        }
        container.innerHTML = this.changeLog.map(log => `
            <div class="sync-history-item">
                <div class="sync-history-icon">${log.icon}</div>
                <div class="sync-history-details">
                    <div class="sync-history-desc">${log.description}</div>
                    <div class="sync-history-time">${this.timeAgo(log.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    timeAgo(isoString) {
        const date = new Date(isoString);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    showToast(message, type = 'success') { // success, error, warning
        const toast = this.elements.toast;
        this.elements.toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => { toast.className = 'toast hidden'; }, 4000);
    }
    
    setupPalettes() {
        this.availableColors = ["#3B82F6","#10B981","#EF4444","#8B5CF6","#06B6D4","#F59E0B","#EC4899","#6366F1","#14B8A6","#F97316","#84CC16","#A855F7","#E11D48","#0EA5E9","#65A30D"];
        this.palettes = {
            'default-teal': {
                name: 'Default Teal',
                preview: { bg: '#fcfcf9', primary: '#21808d', secondary: 'rgba(94, 82, 64, 0.12)' },
                colors: { '--palette-cream-50': '#fcfcf9', '--palette-cream-100': '#fff', '--palette-gray-200': '#f5f5f5', '--palette-slate-500': '#626c71', '--palette-brown-600': '#5e5240', '--palette-charcoal-700': '#1f2121', '--palette-charcoal-800': '#262828', '--palette-slate-900': '#13343b', '--palette-primary-300': '#32b8c6', '--palette-primary-400': '#2da6b2', '--palette-primary-500': '#21808d', '--palette-primary-600': '#1d7480', '--palette-primary-700': '#1a6873', '--palette-error-400': '#ff5459', '--palette-error-500': '#c0152f', '--palette-warning-400': '#e68161', '--palette-warning-500': '#a84b2f', '--palette-brown-600-rgb': '94, 82, 64', '--palette-primary-500-rgb': '33, 128, 141', '--palette-primary-300-rgb': '50, 184, 198', '--palette-error-500-rgb': '192, 21, 47', '--palette-error-400-rgb': '255, 84, 89', '--palette-warning-500-rgb': '168, 75, 47', '--palette-warning-400-rgb': '230, 129, 97' }
            },
            'sunset-orange': {
                name: 'Sunset Orange',
                preview: { bg: '#fff9f5', primary: '#f97316', secondary: 'rgba(120, 80, 50, 0.12)' },
                colors: { '--palette-cream-50': '#fff9f5', '--palette-cream-100': '#ffffff', '--palette-gray-200': '#f5f5f5', '--palette-slate-500': '#71717a', '--palette-brown-600': '#785549', '--palette-charcoal-700': '#27272a', '--palette-charcoal-800': '#333336', '--palette-slate-900': '#18181b', '--palette-primary-300': '#fb923c', '--palette-primary-400': '#f97316', '--palette-primary-500': '#ea580c', '--palette-primary-600': '#d9530e', '--palette-primary-700': '#c2410c', '--palette-error-400': '#f43f5e', '--palette-error-500': '#be123c', '--palette-warning-400': '#eab308', '--palette-warning-500': '#ca8a04', '--palette-brown-600-rgb': '120, 85, 73', '--palette-primary-500-rgb': '234, 88, 12', '--palette-primary-300-rgb': '251, 146, 60', '--palette-error-500-rgb': '190, 18, 60', '--palette-error-400-rgb': '244, 63, 94', '--palette-warning-500-rgb': '202, 138, 4', '--palette-warning-400-rgb': '234, 179, 8' }
            },
            'forest-green': {
                name: 'Forest Green',
                preview: { bg: '#f7f9f7', primary: '#16a34a', secondary: 'rgba(82, 94, 88, 0.12)' },
                colors: { '--palette-cream-50': '#f7f9f7', '--palette-cream-100': '#ffffff', '--palette-gray-200': '#f4f4f5', '--palette-slate-500': '#52525b', '--palette-brown-600': '#525e58', '--palette-charcoal-700': '#1e2421', '--palette-charcoal-800': '#29302c', '--palette-slate-900': '#171e1a', '--palette-primary-300': '#4ade80', '--palette-primary-400': '#22c55e', '--palette-primary-500': '#16a34a', '--palette-primary-600': '#15803d', '--palette-primary-700': '#166534', '--palette-error-400': '#ef4444', '--palette-error-500': '#b91c1c', '--palette-warning-400': '#f59e0b', '--palette-warning-500': '#d97706', '--palette-brown-600-rgb': '82, 94, 88', '--palette-primary-500-rgb': '22, 163, 74', '--palette-primary-300-rgb': '74, 222, 128', '--palette-error-500-rgb': '185, 28, 28', '--palette-error-400-rgb': '239, 68, 68', '--palette-warning-500-rgb': '217, 119, 6', '--palette-warning-400-rgb': '245, 158, 11' }
            },
            'productivity-red': {
                name: 'Productivity Red',
                preview: { bg: '#ffffff', primary: '#db4c3f', secondary: 'rgba(200, 200, 200, 0.2)' },
                colors: { '--palette-cream-50': '#ffffff', '--palette-cream-100': '#f9f9f9', '--palette-gray-200': '#eeeeee', '--palette-slate-500': '#808080', '--palette-brown-600': '#333333', '--palette-charcoal-700': '#1f1f1f', '--palette-charcoal-800': '#282828', '--palette-slate-900': '#000000', '--palette-primary-300': '#e57373', '--palette-primary-400': '#ef5350', '--palette-primary-500': '#db4c3f', '--palette-primary-600': '#c83b31', '--palette-primary-700': '#b72f25', '--palette-error-400': '#607d8b', '--palette-error-500': '#455a64', '--palette-warning-400': '#ffb74d', '--palette-warning-500': '#ff9800', '--palette-brown-600-rgb': '51, 51, 51', '--palette-primary-500-rgb': '219, 76, 63', '--palette-primary-300-rgb': '229, 115, 115', '--palette-error-500-rgb': '69, 90, 100', '--palette-error-400-rgb': '96, 125, 139', '--palette-warning-500-rgb': '255, 152, 0', '--palette-warning-400-rgb': '255, 183, 77' }
            },
            'graphite-gray': {
                name: 'Graphite Gray',
                preview: { bg: '#f5f5f7', primary: '#52525b', secondary: 'rgba(113, 113, 122, 0.1)' },
                colors: { '--palette-cream-50': '#f5f5f7', '--palette-cream-100': '#ffffff', '--palette-gray-200': '#e4e4e7', '--palette-slate-500': '#71717a', '--palette-brown-600': '#a1a1aa', '--palette-charcoal-700': '#27272a', '--palette-charcoal-800': '#18181b', '--palette-slate-900': '#09090b', '--palette-primary-300': '#a1a1aa', '--palette-primary-400': '#71717a', '--palette-primary-500': '#52525b', '--palette-primary-600': '#3f3f46', '--palette-primary-700': '#27272a', '--palette-error-400': '#f43f5e', '--palette-error-500': '#be123c', '--palette-warning-400': '#facc15', '--palette-warning-500': '#eab308', '--palette-brown-600-rgb': '161, 161, 170', '--palette-primary-500-rgb': '82, 82, 91', '--palette-primary-300-rgb': '161, 161, 170', '--palette-error-500-rgb': '190, 18, 60', '--palette-error-400-rgb': '244, 63, 94', '--palette-warning-500-rgb': '234, 179, 8', '--palette-warning-400-rgb': '250, 204, 21' }
            },
            'ocean-blue': {
                name: 'Ocean Blue',
                preview: { bg: '#f0f9ff', primary: '#0ea5e9', secondary: 'rgba(100, 116, 139, 0.1)' },
                colors: { '--palette-cream-50': '#f0f9ff', '--palette-cream-100': '#ffffff', '--palette-gray-200': '#e0f2fe', '--palette-slate-500': '#64748b', '--palette-brown-600': '#94a3b8', '--palette-charcoal-700': '#1e293b', '--palette-charcoal-800': '#0f172a', '--palette-slate-900': '#020617', '--palette-primary-300': '#38bdf8', '--palette-primary-400': '#0ea5e9', '--palette-primary-500': '#0284c7', '--palette-primary-600': '#0369a1', '--palette-primary-700': '#075985', '--palette-error-400': '#fb7185', '--palette-error-500': '#e11d48', '--palette-warning-400': '#fbbf24', '--palette-warning-500': '#f59e0b', '--palette-brown-600-rgb': '148, 163, 184', '--palette-primary-500-rgb': '2, 132, 199', '--palette-primary-300-rgb': '56, 189, 248', '--palette-error-500-rgb': '225, 29, 72', '--palette-error-400-rgb': '251, 113, 133', '--palette-warning-500-rgb': '245, 158, 11', '--palette-warning-400-rgb': '251, 191, 36' }
            },
            'deep-indigo': {
                name: 'Deep Indigo',
                preview: { bg: '#f8f8ff', primary: '#6366f1', secondary: 'rgba(100, 100, 120, 0.12)' },
                colors: { '--palette-cream-50': '#f8f8ff', '--palette-cream-100': '#ffffff', '--palette-gray-200': '#eef2ff', '--palette-slate-500': '#64748b', '--palette-brown-600': '#646478', '--palette-charcoal-700': '#1e1b4b', '--palette-charcoal-800': '#28256e', '--palette-slate-900': '#312e81', '--palette-primary-300': '#818cf8', '--palette-primary-400': '#6366f1', '--palette-primary-500': '#4f46e5', '--palette-primary-600': '#4338ca', '--palette-primary-700': '#3730a3', '--palette-error-400': '#f472b6', '--palette-error-500': '#db2777', '--palette-warning-400': '#38bdf8', '--palette-warning-500': '#0ea5e9', '--palette-brown-600-rgb': '100, 100, 120', '--palette-primary-500-rgb': '79, 70, 229', '--palette-primary-300-rgb': '129, 140, 248', '--palette-error-500-rgb': '219, 39, 119', '--palette-error-400-rgb': '244, 114, 182', '--palette-warning-500-rgb': '14, 165, 233', '--palette-warning-400-rgb': '56, 189, 248' }
            }
        };
    }
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    new FirebaseDailyTracker();
    
    // Register Service Worker for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
});