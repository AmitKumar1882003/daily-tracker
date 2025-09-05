// ULTIMATE Daily Activity Tracker for Amit - FULLY FIXED VERSION
// Version 4.2 - All Critical Bugs Resolved

console.log('🚀 Daily Tracker Script Loading...');

class UltimateDailyTracker {
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
        
        // Predefined habit colors from application data
        this.habitColors = {
            "Study/Learning": "#3B82F6",
            "Exercise": "#10B981", 
            "Reading": "#EF4444",
            "Planning": "#8B5CF6",
            "Review Sessions": "#06B6D4",
            "Project Work": "#F59E0B",
            "Skill Development": "#EC4899",
            "Health Care": "#14B8A6"
        };
        
        // Default habits from application data
        this.defaultHabits = [
            "Study/Learning", "Exercise", "Reading", "Planning", 
            "Review Sessions", "Project Work", "Skill Development", "Health Care"
        ];
        
        // Available colors for new habits
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4", 
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        
        // Motivational quotes from application data
        this.motivationalQuotes = [
            "Success is the sum of small efforts repeated day in and day out.",
            "The way to get started is to quit talking and begin doing.",
            "Don't wish it were easier; wish you were better.",
            "Discipline is choosing between what you want now and what you want most.",
            "Excellence is not a skill, it's an attitude.",
            "Progress, not perfection.",
            "Small daily improvements lead to staggering yearly results.",
            "The secret of getting ahead is getting started.",
            "You don't have to be great to get started, but you have to get started to be great.",
            "The only impossible journey is the one you never begin.",
            "Quality is not an act, it is a habit.",
            "Champions keep playing until they get it right.",
            "The difference between ordinary and extraordinary is that little extra.",
            "Success is where preparation and opportunity meet.",
            "Believe you can and you're halfway there.",
            "The future depends on what you do today.",
            "Your limitation—it's only your imagination.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Success doesn't just find you. You have to go out and get it."
        ];
        
        // Auto-save timer
        this.autoSaveTimer = null;
        this.lastSaveTime = null;
        this.dataChanged = false;
        
        // Sync configuration
        this.syncConfig = {
            enabled: false,
            gistId: null,
            lastSync: null,
            githubToken: null,
            autoSyncInterval: 30000,
            retryCount: 0,
            maxRetries: 3,
            syncInProgress: false
        };
        
        // Initialize when DOM is ready
        this.initializeWhenReady();
    }
    
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.init(), 100);
            });
        } else {
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        console.log('🚀 Initializing ULTIMATE Daily Tracker...');
        
        try {
            this.loadData();
            this.setupEventListeners();
            this.setupKeyboardShortcuts();
            this.displayMotivationalQuote();
            this.renderCurrentView();
            this.setupGoalsSelectors();
            this.startAutoSync();
            this.updateSyncStatus();
            
            console.log('✅ Initialization complete - All systems ready!');
            this.showToast('Welcome back, Amit! Daily tracker is ready 🎉', 'success');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showToast('Error initializing tracker', 'error');
        }
    }
    
    loadData() {
        const storedData = localStorage.getItem('ultimateDailyTrackerData');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                this.entries = data.entries || {};
                this.customHabits = data.customHabits || [];
                this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
                this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
                this.syncConfig = { ...this.syncConfig, ...(data.syncConfig || {}) };
            } catch (error) {
                console.error('Error loading data:', error);
                this.initializeDefaultData();
            }
        } else {
            this.initializeDefaultData();
        }
    }
    
    initializeDefaultData() {
        this.entries = {
            "2025-09-05": {
                "text": "Productive day with focused study sessions. Completed 3 chapters of current material and practiced problem-solving techniques. Good progress on project work and maintained all daily habits.",
                "habits": {
                    "Study/Learning": true,
                    "Exercise": true,
                    "Reading": true,
                    "Planning": false,
                    "Review Sessions": true,
                    "Project Work": false,
                    "Skill Development": true,
                    "Health Care": true
                },
                "timestamp": "2025-09-05T20:31:00.000Z"
            },
            "2025-09-04": {
                "text": "Intensive learning day focused on skill development. Attended workshop and completed assignments. Evening exercise session and reading time. Planning for tomorrow's objectives.",
                "habits": {
                    "Study/Learning": true,
                    "Exercise": true,
                    "Reading": true,
                    "Planning": true,
                    "Review Sessions": false,
                    "Project Work": true,
                    "Skill Development": true,
                    "Health Care": false
                },
                "timestamp": "2025-09-04T22:15:00.000Z"
            }
        };

        this.goals = {
            weekly: {
                "2025-W36": {
                    title: "Week of Sep 2-8, 2025",
                    tasks: [
                        { id: "w1", text: "Complete study module on advanced topics", completed: false },
                        { id: "w2", text: "Review 2 chapters thoroughly", completed: true },
                        { id: "w3", text: "Practice problem-solving techniques", completed: false },
                        { id: "w4", text: "Maintain daily habits streak", completed: false },
                        { id: "w5", text: "Exercise 5 times this week", completed: false }
                    ]
                }
            },
            monthly: {
                "2025-09": {
                    title: "September 2025 Goals",
                    tasks: [
                        { id: "m1", text: "Complete comprehensive study program", completed: false },
                        { id: "m2", text: "Read 4 technical books", completed: false },
                        { id: "m3", text: "Build 2 practical projects", completed: false },
                        { id: "m4", text: "Maintain daily study routine", completed: false },
                        { id: "m5", text: "Exercise 20 days this month", completed: false }
                    ]
                }
            },
            yearly: {
                "2025": {
                    title: "2025 Annual Goals",
                    tasks: [
                        { id: "y1", text: "Master advanced study techniques", completed: false },
                        { id: "y2", text: "Read 50 books", completed: false },
                        { id: "y3", text: "Complete 10 major projects", completed: false },
                        { id: "y4", text: "Develop expertise in key areas", completed: false },
                        { id: "y5", text: "Achieve professional milestones", completed: false },
                        { id: "y6", text: "Maintain 80%+ habit consistency", completed: false }
                    ]
                }
            }
        };

        this.customHabits = [];
        this.saveData();
    }
    
    saveData() {
        try {
            const data = {
                entries: this.entries,
                customHabits: this.customHabits,
                habitColors: this.habitColors,
                goals: this.goals,
                syncConfig: this.syncConfig,
                version: "4.2.0",
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('ultimateDailyTrackerData', JSON.stringify(data));
            this.lastSaveTime = new Date();
            this.dataChanged = true;
            this.updateAutoSaveStatus();
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('❌ Error saving data locally', 'error');
        }
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // FIXED: Direct event binding with immediate handlers
        
        // Tab navigation - COMPLETELY FIXED
        this.safeAddEventListener('weeklyTab', 'click', () => {
            console.log('Weekly tab clicked');
            this.switchView('weekly');
        });
        
        this.safeAddEventListener('monthlyTab', 'click', () => {
            console.log('Monthly tab clicked');
            this.switchView('monthly');
        });
        
        this.safeAddEventListener('yearlyTab', 'click', () => {
            console.log('Yearly tab clicked');
            this.switchView('yearly');
        });
        
        this.safeAddEventListener('goalsTab', 'click', () => {
            console.log('Goals tab clicked');
            this.switchView('goals');
        });
        
        // Navigation controls - FIXED
        this.safeAddEventListener('prevWeek', 'click', () => {
            console.log('Previous week clicked');
            this.navigateWeek(-1);
        });
        
        this.safeAddEventListener('nextWeek', 'click', () => {
            console.log('Next week clicked');
            this.navigateWeek(1);
        });
        
        this.safeAddEventListener('prevMonth', 'click', () => {
            console.log('Previous month clicked');
            this.navigateMonth(-1);
        });
        
        this.safeAddEventListener('nextMonth', 'click', () => {
            console.log('Next month clicked');
            this.navigateMonth(1);
        });
        
        this.safeAddEventListener('prevYear', 'click', () => {
            console.log('Previous year clicked');
            this.navigateYear(-1);
        });
        
        this.safeAddEventListener('nextYear', 'click', () => {
            console.log('Next year clicked');
            this.navigateYear(1);
        });
        
        this.safeAddEventListener('todayBtn', 'click', () => {
            console.log('Today button clicked');
            this.goToToday();
        });
        
        // Header controls - FIXED
        this.safeAddEventListener('jumpToBtn', 'click', () => {
            console.log('Jump to button clicked');
            this.openJumpToModal();
        });
        
        this.safeAddEventListener('exportBtn', 'click', () => {
            console.log('Export button clicked');
            this.exportData('json');
        });
        
        this.safeAddEventListener('settingsBtn', 'click', () => {
            console.log('Settings button clicked');
            this.openSettingsModal();
        });
        
        this.safeAddEventListener('syncBtn', 'click', () => {
            console.log('Sync button clicked');
            this.handleSyncButton();
        });
        
        // Modal controls - FIXED
        this.safeAddEventListener('closeModal', 'click', () => this.closeModal('dailyModal'));
        this.safeAddEventListener('closeEntryView', 'click', () => this.closeModal('entryViewModal'));
        this.safeAddEventListener('closeSettingsModal', 'click', () => this.closeModal('settingsModal'));
        this.safeAddEventListener('closeJumpToModal', 'click', () => this.closeModal('jumpToModal'));
        this.safeAddEventListener('closeImportModal', 'click', () => this.closeModal('importModal'));
        this.safeAddEventListener('saveEntry', 'click', () => this.saveEntry());
        this.safeAddEventListener('quickSave', 'click', () => this.quickSave());
        
        // Sync setup - FIXED
        this.safeAddEventListener('setupSync', 'click', () => this.setupGitHubSync());
        this.safeAddEventListener('testSync', 'click', () => this.testGitHubConnection());
        this.safeAddEventListener('disableSync', 'click', () => this.disableSync());
        
        // Export/Import
        this.safeAddEventListener('exportJSON', 'click', () => this.exportData('json'));
        this.safeAddEventListener('importBtn', 'click', () => this.openImportModal());
        this.safeAddEventListener('executeImport', 'click', () => this.executeImport());
        
        // Jump to functionality
        this.safeAddEventListener('executeJump', 'click', () => this.executeJump());
        this.safeAddEventListener('jumpToday', 'click', () => this.jumpToToday());
        this.safeAddEventListener('jumpYesterday', 'click', () => this.jumpToYesterday());
        this.safeAddEventListener('jumpWeekStart', 'click', () => this.jumpToWeekStart());
        this.safeAddEventListener('jumpMonthStart', 'click', () => this.jumpToMonthStart());
        
        // Goal task management - FIXED
        this.safeAddEventListener('addWeeklyTask', 'click', () => this.addGoalTask('weekly'));
        this.safeAddEventListener('addMonthlyTask', 'click', () => this.addGoalTask('monthly'));
        this.safeAddEventListener('addYearlyTask', 'click', () => this.addGoalTask('yearly'));
        
        // Habit management
        this.safeAddEventListener('addHabit', 'click', () => this.addCustomHabit());
        
        // Enter key handlers
        this.safeAddKeypressListener('newHabit', 'Enter', () => this.addCustomHabit());
        this.safeAddKeypressListener('newWeeklyTask', 'Enter', () => this.addGoalTask('weekly'));
        this.safeAddKeypressListener('newMonthlyTask', 'Enter', () => this.addGoalTask('monthly'));
        this.safeAddKeypressListener('newYearlyTask', 'Enter', () => this.addGoalTask('yearly'));
        
        // Auto-save for text areas
        const dailyText = document.getElementById('dailyText');
        if (dailyText) {
            dailyText.addEventListener('input', () => {
                this.scheduleAutoSave();
                this.updateWordCount();
            });
        }
        
        // Modal background clicks
        this.setupModalCloseHandlers();
        
        console.log('✅ Event listeners setup complete');
    }
    
    // FIXED: Safe event listener helper with better error handling
    safeAddEventListener(elementId, event, handler) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(event, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        console.log(`Event triggered: ${elementId} ${event}`);
                        handler(e);
                    } catch (error) {
                        console.error(`Error in ${elementId} ${event} handler:`, error);
                        this.showToast(`Error: ${error.message}`, 'error');
                    }
                });
                console.log(`✓ Bound ${event} to ${elementId}`);
            } else {
                console.warn(`⚠️ Element ${elementId} not found`);
            }
        } catch (error) {
            console.error(`Error binding ${event} to ${elementId}:`, error);
        }
    }
    
    safeAddKeypressListener(elementId, key, handler) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('keypress', (e) => {
                    if (e.key === key) {
                        e.preventDefault();
                        handler();
                    }
                });
                console.log(`✓ Bound keypress ${key} to ${elementId}`);
            }
        } catch (error) {
            console.error(`Error binding keypress to ${elementId}:`, error);
        }
    }
    
    setupModalCloseHandlers() {
        const modals = ['dailyModal', 'entryViewModal', 'settingsModal', 'jumpToModal', 'importModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target.id === modalId) {
                        this.closeModal(modalId);
                    }
                });
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.quickSave();
                }
                return;
            }
            
            // Don't trigger when modals are open
            if (document.querySelector('.modal:not(.hidden)')) {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
                return;
            }
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentView === 'weekly') this.navigateWeek(-1);
                    else if (this.currentView === 'monthly') this.navigateMonth(-1);
                    else if (this.currentView === 'yearly') this.navigateYear(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.currentView === 'weekly') this.navigateWeek(1);
                    else if (this.currentView === 'monthly') this.navigateMonth(1);
                    else if (this.currentView === 'yearly') this.navigateYear(1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.openTodayEntry();
                    break;
                case 'g':
                case 'G':
                    e.preventDefault();
                    this.switchView('goals');
                    break;
                case 'j':
                case 'J':
                    e.preventDefault();
                    this.openJumpToModal();
                    break;
                case 'e':
                case 'E':
                    e.preventDefault();
                    this.exportData('json');
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.handleSyncButton();
                    break;
                case 'Escape':
                    this.closeAllModals();
                    break;
            }
        });
    }
    
    displayMotivationalQuote() {
        const today = new Date().toDateString();
        const storedQuoteDate = localStorage.getItem('dailyQuoteDate');
        const storedQuoteIndex = localStorage.getItem('dailyQuoteIndex');
        
        let quoteIndex;
        if (storedQuoteDate === today && storedQuoteIndex !== null) {
            quoteIndex = parseInt(storedQuoteIndex);
        } else {
            // Generate a consistent quote index based on the date
            const dateStr = this.formatDate(new Date());
            quoteIndex = this.hashCode(dateStr) % this.motivationalQuotes.length;
            localStorage.setItem('dailyQuoteDate', today);
            localStorage.setItem('dailyQuoteIndex', quoteIndex.toString());
        }
        
        const quote = this.motivationalQuotes[quoteIndex];
        const quoteElement = document.getElementById('dailyQuote');
        const authorElement = document.getElementById('quoteAuthor');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = `"${quote}"`;
            authorElement.textContent = '— Daily Motivation';
        }
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    // FIXED: Navigation Methods with proper view switching
    switchView(view) {
        console.log(`🔄 Switching to view: ${view}`);
        
        try {
            // Update active tab
            const tabs = document.querySelectorAll('.tab-btn');
            tabs.forEach(btn => {
                btn.classList.remove('tab-btn--active');
            });
            
            const targetTab = document.getElementById(`${view}Tab`);
            if (targetTab) {
                targetTab.classList.add('tab-btn--active');
                console.log(`✓ Activated ${view} tab`);
            }
            
            // Hide all views
            const views = document.querySelectorAll('.main-view');
            views.forEach(viewEl => {
                viewEl.classList.add('hidden');
            });
            
            // Show selected view
            const targetView = document.getElementById(`${view}View`);
            if (targetView) {
                targetView.classList.remove('hidden');
                console.log(`✓ Showing ${view} view`);
            } else {
                console.error(`❌ View ${view}View not found`);
                return;
            }
            
            this.currentView = view;
            this.renderCurrentView();
            
            console.log(`✅ Successfully switched to ${view} view`);
        } catch (error) {
            console.error(`❌ Error switching to ${view}:`, error);
            this.showToast(`Error switching to ${view} view`, 'error');
        }
    }
    
    renderCurrentView() {
        console.log(`📊 Rendering current view: ${this.currentView}`);
        try {
            switch(this.currentView) {
                case 'weekly':
                    this.renderWeeklyCalendar();
                    this.renderHabitLegend();
                    break;
                case 'monthly':
                    this.renderMonthlyCalendar();
                    this.renderMonthlySummary();
                    break;
                case 'yearly':
                    this.renderYearlyCalendar();
                    this.renderYearlySummary();
                    break;
                case 'goals':
                    this.renderGoals();
                    break;
            }
            console.log(`✅ Rendered ${this.currentView} view successfully`);
        } catch (error) {
            console.error(`❌ Error rendering ${this.currentView}:`, error);
            this.showToast(`Error rendering ${this.currentView} view`, 'error');
        }
    }
    
    // Weekly Calendar Methods - FIXED
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
    
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
    
    navigateWeek(direction) {
        console.log(`🗓️ Navigating week: ${direction > 0 ? 'forward' : 'backward'}`);
        try {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() + (direction * 7));
            this.currentWeekStart = newDate;
            this.renderWeeklyCalendar();
            this.renderHabitLegend();
            console.log(`✅ Navigated to week: ${this.formatDate(this.currentWeekStart)}`);
        } catch (error) {
            console.error('❌ Error navigating week:', error);
            this.showToast('Error navigating week', 'error');
        }
    }
    
    renderWeeklyCalendar() {
        console.log('📅 Rendering weekly calendar...');
        try {
            const weekRange = document.getElementById('weekRange');
            const calendarDays = document.getElementById('calendarDays');
            
            if (!weekRange || !calendarDays) {
                console.error('❌ Weekly calendar elements not found');
                return;
            }
            
            const weekEnd = new Date(this.currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekRange.textContent = `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
            
            this.updateWeekStats();
            
            calendarDays.innerHTML = '';
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(this.currentWeekStart);
                date.setDate(date.getDate() + i);
                const dayElement = this.createWeeklyDayElement(date);
                calendarDays.appendChild(dayElement);
            }
            
            this.highlightToday();
            console.log('✅ Weekly calendar rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering weekly calendar:', error);
            this.showToast('Error rendering weekly calendar', 'error');
        }
    }
    
    updateWeekStats() {
        const weekScore = this.calculateWeekScore();
        const weekStreak = this.calculateCurrentStreak();
        
        const weekScoreEl = document.getElementById('weekScore');
        const weekStreakEl = document.getElementById('weekStreak');
        
        if (weekScoreEl) weekScoreEl.textContent = `Score: ${weekScore}%`;
        if (weekStreakEl) weekStreakEl.textContent = `🔥 Streak: ${weekStreak} days`;
    }
    
    calculateWeekScore() {
        let totalDays = 0;
        let completedDays = 0;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            
            if (date <= new Date()) {
                totalDays++;
                const dateString = this.formatDate(date);
                const entry = this.entries[dateString];
                
                if (entry && entry.habits) {
                    const habitCount = Object.keys(entry.habits).length;
                    const completedHabits = Object.values(entry.habits).filter(Boolean).length;
                    if (habitCount > 0 && completedHabits / habitCount >= 0.6) {
                        completedDays++;
                    }
                }
            }
        }
        
        return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    }
    
    calculateCurrentStreak() {
        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);
        
        while (currentDate) {
            const dateString = this.formatDate(currentDate);
            const entry = this.entries[dateString];
            
            if (entry && entry.habits) {
                const habitCount = Object.keys(entry.habits).length;
                const completedHabits = Object.values(entry.habits).filter(Boolean).length;
                if (habitCount > 0 && completedHabits / habitCount >= 0.5) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    createWeeklyDayElement(date) {
        const dateString = this.formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.setAttribute('data-date', dateString);
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        if (this.entries[dateString]) {
            const preview = document.createElement('div');
            preview.className = 'day-preview';
            const text = this.entries[dateString].text;
            preview.textContent = text;
            preview.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEntryView(date);
            });
            dayElement.appendChild(preview);
            
            const habits = this.entries[dateString].habits || {};
            const completedHabits = Object.keys(habits).filter(habit => habits[habit]);
            
            if (completedHabits.length > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'habits-indicator';
                
                completedHabits.forEach(habit => {
                    const dot = document.createElement('div');
                    dot.className = 'habit-dot';
                    dot.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
                    dot.title = habit;
                    indicator.appendChild(dot);
                });
                
                dayElement.appendChild(indicator);
            }
        }
        
        // FIXED: Event handler for opening day entry with proper logging
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📝 Calendar day clicked: ${dateString}`);
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    // Monthly Calendar Methods - FIXED
    navigateMonth(direction) {
        console.log(`🗓️ Navigating month: ${direction > 0 ? 'forward' : 'backward'}`);
        try {
            const newDate = new Date(this.currentMonth);
            newDate.setMonth(newDate.getMonth() + direction);
            this.currentMonth = newDate;
            this.renderMonthlyCalendar();
            this.renderMonthlySummary();
            console.log(`✅ Navigated to month: ${this.currentMonth.toLocaleDateString()}`);
        } catch (error) {
            console.error('❌ Error navigating month:', error);
            this.showToast('Error navigating month', 'error');
        }
    }
    
    renderMonthlyCalendar() {
        console.log('📅 Rendering monthly calendar...');
        try {
            const monthYear = document.getElementById('monthYear');
            const monthlyCalendarDays = document.getElementById('monthlyCalendarDays');
            
            if (!monthYear || !monthlyCalendarDays) {
                console.error('❌ Monthly calendar elements not found');
                return;
            }
            
            monthYear.textContent = this.currentMonth.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
            
            this.updateMonthStats();
            monthlyCalendarDays.innerHTML = '';
            
            const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
            const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDay = firstDay.getDay();
            
            for (let i = 0; i < startDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'monthly-day other-month';
                monthlyCalendarDays.appendChild(emptyDay);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
                const dayElement = this.createMonthlyDayElement(date);
                monthlyCalendarDays.appendChild(dayElement);
            }
            
            this.highlightToday();
            console.log('✅ Monthly calendar rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering monthly calendar:', error);
            this.showToast('Error rendering monthly calendar', 'error');
        }
    }
    
    updateMonthStats() {
        const stats = this.calculateMonthlyStats();
        
        const monthEntriesEl = document.getElementById('monthEntries');
        const monthStreakEl = document.getElementById('monthStreak');
        
        if (monthEntriesEl) monthEntriesEl.textContent = `📝 ${stats.totalEntries} entries`;
        if (monthStreakEl) monthStreakEl.textContent = `🔥 Best streak: ${stats.bestStreak} days`;
    }
    
    calculateMonthlyStats() {
        const monthStart = new Date(this.currentMonth);
        const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        
        let totalEntries = 0;
        let bestStreak = 0;
        let currentStreak = 0;
        
        const current = new Date(monthStart);
        while (current <= monthEnd) {
            const dateString = this.formatDate(current);
            const entry = this.entries[dateString];
            
            if (entry) {
                totalEntries++;
                if (entry.habits) {
                    const habitCount = Object.keys(entry.habits).length;
                    const completedHabits = Object.values(entry.habits).filter(Boolean).length;
                    if (habitCount > 0 && completedHabits / habitCount >= 0.5) {
                        currentStreak++;
                        bestStreak = Math.max(bestStreak, currentStreak);
                    } else {
                        currentStreak = 0;
                    }
                }
            } else {
                currentStreak = 0;
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        return { totalEntries, bestStreak };
    }
    
    createMonthlyDayElement(date) {
        const dateString = this.formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'monthly-day';
        dayElement.setAttribute('data-date', dateString);
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        if (this.entries[dateString]) {
            const preview = document.createElement('div');
            preview.className = 'day-preview';
            const text = this.entries[dateString].text;
            preview.textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
            preview.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEntryView(date);
            });
            dayElement.appendChild(preview);
            
            const habits = this.entries[dateString].habits || {};
            const completedHabits = Object.keys(habits).filter(habit => habits[habit]);
            
            if (completedHabits.length > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'habits-indicator';
                
                completedHabits.slice(0, 6).forEach(habit => {
                    const dot = document.createElement('div');
                    dot.className = 'habit-dot';
                    dot.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
                    dot.title = habit;
                    indicator.appendChild(dot);
                });
                
                dayElement.appendChild(indicator);
            }
        }
        
        // FIXED: Click handler for monthly days
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📝 Monthly day clicked: ${dateString}`);
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    renderMonthlySummary() {
        const summaryContent = document.getElementById('monthlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        const stats = this.calculateMonthlyStats();
        
        const totalEntries = document.createElement('div');
        totalEntries.className = 'summary-stat';
        totalEntries.innerHTML = `
            <span class="summary-label">📝 Total Entries</span>
            <span class="summary-value">${stats.totalEntries}</span>
        `;
        summaryContent.appendChild(totalEntries);
        
        const bestStreak = document.createElement('div');
        bestStreak.className = 'summary-stat';
        bestStreak.innerHTML = `
            <span class="summary-label">🔥 Best Streak</span>
            <span class="summary-value">${stats.bestStreak} days</span>
        `;
        summaryContent.appendChild(bestStreak);
    }
    
    // Yearly Calendar Methods - FIXED with working interactions
    navigateYear(direction) {
        console.log(`📅 Navigating year: ${direction > 0 ? 'forward' : 'backward'}`);
        try {
            this.currentYear += direction;
            this.renderYearlyCalendar();
            this.renderYearlySummary();
            console.log(`✅ Navigated to year: ${this.currentYear}`);
        } catch (error) {
            console.error('❌ Error navigating year:', error);
            this.showToast('Error navigating year', 'error');
        }
    }
    
    renderYearlyCalendar() {
        console.log('📅 Rendering yearly calendar...');
        try {
            const yearTitle = document.getElementById('yearTitle');
            const yearlyCalendarGrid = document.getElementById('yearlyCalendarGrid');
            
            if (!yearTitle || !yearlyCalendarGrid) {
                console.error('❌ Yearly calendar elements not found');
                return;
            }
            
            yearTitle.textContent = `${this.currentYear}`;
            this.updateYearStats();
            
            yearlyCalendarGrid.innerHTML = '';
            
            for (let month = 0; month < 12; month++) {
                const monthElement = this.createYearlyMonthElement(month);
                yearlyCalendarGrid.appendChild(monthElement);
            }
            
            console.log('✅ Yearly calendar rendered with interactive dates');
        } catch (error) {
            console.error('❌ Error rendering yearly calendar:', error);
            this.showToast('Error rendering yearly calendar', 'error');
        }
    }
    
    updateYearStats() {
        const yearStats = this.calculateYearlyStats();
        
        const yearEntriesEl = document.getElementById('yearEntries');
        const yearBestStreakEl = document.getElementById('yearBestStreak');
        const yearGoalsEl = document.getElementById('yearGoals');
        
        if (yearEntriesEl) yearEntriesEl.textContent = `📝 ${yearStats.totalEntries} entries`;
        if (yearBestStreakEl) yearBestStreakEl.textContent = `🔥 Best streak: ${yearStats.bestStreak} days`;
        if (yearGoalsEl) yearGoalsEl.textContent = `🎯 ${yearStats.completedGoals}/${yearStats.totalGoals} goals completed`;
    }
    
    calculateYearlyStats() {
        let totalEntries = 0;
        let bestStreak = 0;
        let currentStreak = 0;
        
        const startDate = new Date(this.currentYear, 0, 1);
        const endDate = new Date(this.currentYear, 11, 31);
        const current = new Date(startDate);
        
        while (current <= endDate && current <= new Date()) {
            const dateString = this.formatDate(current);
            const entry = this.entries[dateString];
            
            if (entry) {
                totalEntries++;
                if (entry.habits) {
                    const habitCount = Object.keys(entry.habits).length;
                    const completedHabits = Object.values(entry.habits).filter(Boolean).length;
                    if (habitCount > 0 && completedHabits / habitCount >= 0.5) {
                        currentStreak++;
                        bestStreak = Math.max(bestStreak, currentStreak);
                    } else {
                        currentStreak = 0;
                    }
                }
            } else {
                currentStreak = 0;
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        // Calculate goal completion
        const yearlyGoals = this.goals.yearly[this.currentYear.toString()];
        const completedGoals = yearlyGoals ? yearlyGoals.tasks.filter(task => task.completed).length : 0;
        const totalGoals = yearlyGoals ? yearlyGoals.tasks.length : 0;
        
        return { totalEntries, bestStreak, completedGoals, totalGoals };
    }
    
    createYearlyMonthElement(monthIndex) {
        const monthElement = document.createElement('div');
        monthElement.className = 'yearly-month';
        
        const monthDate = new Date(this.currentYear, monthIndex, 1);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
        
        const header = document.createElement('div');
        header.className = 'yearly-month-header';
        header.textContent = monthName;
        monthElement.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'yearly-month-grid';
        
        // Add day headers
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'yearly-day-header';
            header.textContent = day;
            grid.appendChild(header);
        });
        
        // Add empty cells for days before month starts
        const firstDay = new Date(this.currentYear, monthIndex, 1);
        const startDay = firstDay.getDay();
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'yearly-day other-month';
            grid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const daysInMonth = new Date(this.currentYear, monthIndex + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, monthIndex, day);
            const dayElement = this.createYearlyDayElement(date);
            grid.appendChild(dayElement);
        }
        
        monthElement.appendChild(grid);
        return monthElement;
    }
    
    createYearlyDayElement(date) {
        const dateString = this.formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'yearly-day';
        dayElement.textContent = date.getDate();
        dayElement.setAttribute('data-date', dateString);
        dayElement.title = `${this.formatDateDisplay(date)} - Click to view/edit entry`;
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        if (this.entries[dateString]) {
            dayElement.classList.add('has-entry');
            const habits = this.entries[dateString].habits || {};
            const completedHabits = Object.values(habits).filter(Boolean).length;
            const totalHabits = Object.keys(habits).length;
            
            // Color coding based on habit completion
            if (totalHabits > 0) {
                const completion = completedHabits / totalHabits;
                if (completion >= 0.8) {
                    dayElement.style.backgroundColor = '#10B981'; // Green
                    dayElement.style.color = 'white';
                } else if (completion >= 0.5) {
                    dayElement.style.backgroundColor = '#F59E0B'; // Yellow
                    dayElement.style.color = 'white';
                } else {
                    dayElement.style.backgroundColor = '#EF4444'; // Red
                    dayElement.style.color = 'white';
                }
            }
            
            // Update tooltip with entry info
            const entryText = this.entries[dateString].text;
            const preview = entryText ? entryText.substring(0, 100) + (entryText.length > 100 ? '...' : '') : 'No text';
            dayElement.title = `${this.formatDateDisplay(date)}\n${completedHabits}/${totalHabits} habits completed\n${preview}`;
        }
        
        // FIXED: Click handler for yearly calendar days with proper logging
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📝 Yearly calendar day clicked: ${dateString}`);
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    renderYearlySummary() {
        const summaryContent = document.getElementById('yearlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        const stats = this.calculateYearlyStats();
        
        const summaryStats = [
            { label: '📝 Total Entries', value: stats.totalEntries },
            { label: '🔥 Best Streak', value: `${stats.bestStreak} days` },
            { label: '🎯 Goals Completed', value: `${stats.completedGoals}/${stats.totalGoals}` },
            { label: '📊 Completion Rate', value: `${Math.round((stats.completedGoals / Math.max(stats.totalGoals, 1)) * 100)}%` }
        ];
        
        summaryStats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'summary-stat';
            statElement.innerHTML = `
                <span class="summary-label">${stat.label}</span>
                <span class="summary-value">${stat.value}</span>
            `;
            summaryContent.appendChild(statElement);
        });
    }
    
    // Goals Management - FIXED
    setupGoalsSelectors() {
        console.log('🎯 Setting up goals selectors...');
        this.setupWeekSelector();
        this.setupMonthSelector();
        this.setupYearSelector();
    }
    
    setupWeekSelector() {
        const weekSelector = document.getElementById('weekGoalSelector');
        if (!weekSelector) return;
        
        weekSelector.innerHTML = '';
        
        // Add current week and surrounding weeks
        for (let i = -4; i <= 4; i++) {
            const weekStart = new Date(this.currentWeekStart);
            weekStart.setDate(weekStart.getDate() + (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const weekNumber = this.getWeekNumber(weekStart);
            const weekKey = `${weekStart.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
            
            const option = document.createElement('option');
            option.value = weekKey;
            option.textContent = `Week ${weekNumber} (${this.formatDateDisplay(weekStart)} - ${this.formatDateDisplay(weekEnd)})`;
            
            if (i === 0) option.selected = true;
            weekSelector.appendChild(option);
        }
        
        weekSelector.addEventListener('change', () => this.loadWeeklyGoals());
    }
    
    setupMonthSelector() {
        const monthSelector = document.getElementById('monthGoalSelector');
        if (!monthSelector) return;
        
        monthSelector.innerHTML = '';
        for (let i = -6; i <= 6; i++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + i, 1);
            const option = document.createElement('option');
            option.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            option.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (i === 0) option.selected = true;
            monthSelector.appendChild(option);
        }
        
        monthSelector.addEventListener('change', () => this.loadMonthlyGoals());
    }
    
    setupYearSelector() {
        const yearSelector = document.getElementById('yearGoalSelector');
        if (!yearSelector) return;
        
        yearSelector.innerHTML = '';
        const currentYear = this.currentDate.getFullYear();
        for (let year = currentYear - 2; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year.toString();
            option.textContent = year.toString();
            if (year === currentYear) option.selected = true;
            yearSelector.appendChild(option);
        }
        
        yearSelector.addEventListener('change', () => this.loadYearlyGoals());
    }
    
    renderGoals() {
        console.log('🎯 Rendering goals...');
        this.loadWeeklyGoals();
        this.loadMonthlyGoals();
        this.loadYearlyGoals();
    }
    
    loadWeeklyGoals() {
        const selector = document.getElementById('weekGoalSelector');
        const tasksList = document.getElementById('weeklyTasksList');
        
        if (!selector || !tasksList) return;
        
        const weekKey = selector.value;
        const goals = this.goals.weekly[weekKey] || { title: selector.options[selector.selectedIndex].text, tasks: [] };
        
        this.renderTasksList(tasksList, goals.tasks, 'weekly', weekKey);
    }
    
    loadMonthlyGoals() {
        const selector = document.getElementById('monthGoalSelector');
        const tasksList = document.getElementById('monthlyTasksList');
        
        if (!selector || !tasksList) return;
        
        const monthKey = selector.value;
        const goals = this.goals.monthly[monthKey] || { title: selector.options[selector.selectedIndex].text, tasks: [] };
        
        this.renderTasksList(tasksList, goals.tasks, 'monthly', monthKey);
    }
    
    loadYearlyGoals() {
        const selector = document.getElementById('yearGoalSelector');
        const tasksList = document.getElementById('yearlyTasksList');
        
        if (!selector || !tasksList) return;
        
        const yearKey = selector.value;
        const goals = this.goals.yearly[yearKey] || { title: yearKey, tasks: [] };
        
        this.renderTasksList(tasksList, goals.tasks, 'yearly', yearKey);
    }
    
    renderTasksList(container, tasks, period, key) {
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <p>No goals set for this ${period} period yet.</p>
                <p>Add your first goal below! 🎯</p>
            `;
            container.appendChild(emptyState);
            return;
        }
        
        const completedTasks = tasks.filter(task => task.completed).length;
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-header">
                <span>Progress: ${completedTasks}/${tasks.length} goals completed</span>
                <span>${Math.round((completedTasks / tasks.length) * 100)}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${(completedTasks / tasks.length) * 100}%"></div>
            </div>
        `;
        container.appendChild(progressBar);
        
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task, period, key);
            container.appendChild(taskElement);
        });
    }
    
    createTaskElement(task, period, key) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => this.toggleTask(task.id, period, key));
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'task-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => this.removeTask(task.id, period, key));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(removeBtn);
        
        return taskItem;
    }
    
    addGoalTask(period) {
        console.log(`🎯 Adding ${period} goal task`);
        
        const input = document.getElementById(`new${period.charAt(0).toUpperCase() + period.slice(1)}Task`);
        const selector = document.getElementById(`${period === 'weekly' ? 'week' : period}GoalSelector`);
        
        if (!input || !selector) {
            console.error('Input or selector not found for', period);
            return;
        }
        
        const taskText = input.value.trim();
        if (!taskText) {
            this.showToast('Please enter a goal description', 'warning');
            return;
        }
        
        const key = selector.value;
        if (!this.goals[period][key]) {
            this.goals[period][key] = {
                title: selector.options[selector.selectedIndex].text,
                tasks: []
            };
        }
        
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };
        
        this.goals[period][key].tasks.push(newTask);
        input.value = '';
        this.saveData();
        this.renderGoals();
        this.showToast(`${period.charAt(0).toUpperCase() + period.slice(1)} goal added! 🎯`, 'success');
    }
    
    toggleTask(taskId, period, key) {
        const goals = this.goals[period][key];
        if (!goals) return;
        
        const task = goals.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderGoals();
            
            if (task.completed) {
                this.showToast('🎉 Goal completed! Great job!', 'success');
            }
        }
    }
    
    removeTask(taskId, period, key) {
        const goals = this.goals[period][key];
        if (!goals) return;
        
        goals.tasks = goals.tasks.filter(t => t.id !== taskId);
        this.saveData();
        this.renderGoals();
        this.showToast('Goal removed', 'warning');
    }
    
    // FIXED: Entry Management with proper modal opening
    goToToday() {
        console.log('🏠 Going to today...');
        try {
            this.currentDate = new Date();
            this.currentWeekStart = this.getWeekStart(this.currentDate);
            this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            this.currentYear = this.currentDate.getFullYear();
            this.renderCurrentView();
            this.showToast('Jumped to today! 🏠', 'success');
        } catch (error) {
            console.error('❌ Error going to today:', error);
            this.showToast('Error navigating to today', 'error');
        }
    }
    
    openTodayEntry() {
        this.openDayEntry(new Date());
    }
    
    highlightToday() {
        const today = this.formatDate(new Date());
        document.querySelectorAll('[data-date]').forEach(el => {
            el.classList.remove('today');
            if (el.getAttribute('data-date') === today) {
                el.classList.add('today');
            }
        });
    }
    
    // FIXED: Daily entry modal with comprehensive error handling and logging
    openDayEntry(date) {
        console.log(`📝 Opening day entry for: ${this.formatDate(date)}`);
        
        try {
            this.selectedDate = date;
            const dateString = this.formatDate(date);
            
            // Update modal title
            const modalDateEl = document.getElementById('modalDate');
            if (modalDateEl) {
                modalDateEl.textContent = `📝 ${this.formatDateDisplay(date)}`;
            }
            
            // Load existing entry data
            const entry = this.entries[dateString] || { text: '', habits: {} };
            
            // Set text area content
            const dailyTextEl = document.getElementById('dailyText');
            if (dailyTextEl) {
                dailyTextEl.value = entry.text || '';
            }
            
            // Update stats and render habits
            this.updateWordCount();
            this.updateEntryStreak();
            this.renderHabits(entry.habits || {});
            
            // Show the modal
            const modal = document.getElementById('dailyModal');
            if (modal) {
                modal.classList.remove('hidden');
                console.log('✅ Daily modal opened successfully');
                
                // Focus on text area after a short delay
                setTimeout(() => {
                    const textArea = document.getElementById('dailyText');
                    if (textArea) {
                        textArea.focus();
                        textArea.setSelectionRange(textArea.value.length, textArea.value.length);
                    }
                }, 200);
                
                this.showToast(`📝 Opened entry for ${this.formatDateDisplay(date)}`, 'success');
            } else {
                console.error('❌ Daily modal not found in DOM');
                this.showToast('Error: Daily entry modal not found', 'error');
            }
        } catch (error) {
            console.error('❌ Error opening day entry:', error);
            this.showToast(`Error opening entry: ${error.message}`, 'error');
        }
    }
    
    updateWordCount() {
        const textArea = document.getElementById('dailyText');
        const wordCountEl = document.getElementById('wordCount');
        
        if (textArea && wordCountEl) {
            const text = textArea.value || '';
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
            wordCountEl.textContent = `${wordCount} words`;
        }
    }
    
    updateEntryStreak() {
        const streak = this.calculateCurrentStreak();
        const entryStreakEl = document.getElementById('entryStreak');
        if (entryStreakEl) {
            entryStreakEl.textContent = `🔥 ${streak} day streak`;
        }
    }
    
    openEntryView(date) {
        const dateString = this.formatDate(date);
        const entry = this.entries[dateString];
        
        if (!entry) {
            this.showToast('No entry found for this date', 'warning');
            return;
        }
        
        const entryViewDateEl = document.getElementById('entryViewDate');
        if (entryViewDateEl) {
            entryViewDateEl.textContent = `📖 Entry for ${this.formatDateDisplay(date)}`;
        }
        
        const content = document.getElementById('entryViewContent');
        if (!content) return;
        
        content.innerHTML = '';
        
        if (entry.text) {
            const textSection = document.createElement('div');
            textSection.innerHTML = '<h4>📝 Daily Entry</h4>';
            
            const textContent = document.createElement('div');
            textContent.className = 'entry-full-text';
            textContent.textContent = entry.text;
            
            textSection.appendChild(textContent);
            content.appendChild(textSection);
        }
        
        if (entry.habits) {
            const habitsSection = document.createElement('div');
            habitsSection.innerHTML = '<h4>✅ Habits</h4>';
            
            const habitsList = document.createElement('div');
            habitsList.className = 'entry-habits-list';
            
            const allHabits = [...this.defaultHabits, ...this.customHabits];
            allHabits.forEach(habit => {
                const habitItem = document.createElement('div');
                habitItem.className = 'entry-habit-item';
                
                const status = document.createElement('div');
                status.className = `entry-habit-status ${entry.habits[habit] ? 'completed' : 'not-completed'}`;
                if (entry.habits[habit]) {
                    status.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
                }
                
                const name = document.createElement('div');
                name.className = 'entry-habit-name';
                name.textContent = habit;
                
                habitItem.appendChild(status);
                habitItem.appendChild(name);
                habitsList.appendChild(habitItem);
            });
            
            habitsSection.appendChild(habitsList);
            content.appendChild(habitsSection);
        }
        
        const modal = document.getElementById('entryViewModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    renderHabits(completedHabits = {}) {
        const habitsList = document.getElementById('habitsList');
        if (!habitsList) return;
        
        habitsList.innerHTML = '';
        const allHabits = [...this.defaultHabits, ...this.customHabits];
        
        allHabits.forEach((habit, index) => {
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-checkbox';
            checkbox.id = `habit-${index}`;
            checkbox.checked = completedHabits[habit] || false;
            checkbox.addEventListener('change', () => {
                this.scheduleAutoSave();
                this.updateWordCount();
            });
            
            const label = document.createElement('label');
            label.className = 'habit-label';
            label.setAttribute('for', `habit-${index}`);
            label.textContent = habit;
            
            habitItem.appendChild(checkbox);
            habitItem.appendChild(label);
            
            if (this.customHabits.includes(habit)) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'habit-remove';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeCustomHabit(habit);
                });
                habitItem.appendChild(removeBtn);
            }
            
            habitsList.appendChild(habitItem);
        });
    }
    
    addCustomHabit() {
        const input = document.getElementById('newHabit');
        if (!input) return;
        
        const habitName = input.value.trim();
        
        if (habitName && !this.getAllHabits().includes(habitName)) {
            this.customHabits.push(habitName);
            this.habitColors[habitName] = this.getRandomColor();
            input.value = '';
            this.saveData();
            
            if (this.selectedDate) {
                const dateString = this.formatDate(this.selectedDate);
                const entry = this.entries[dateString] || {};
                this.renderHabits(entry.habits || {});
            }
            
            this.renderHabitLegend();
            this.showToast('Custom habit added! ✅', 'success');
        }
    }
    
    removeCustomHabit(habitName) {
        this.customHabits = this.customHabits.filter(h => h !== habitName);
        delete this.habitColors[habitName];
        
        Object.keys(this.entries).forEach(date => {
            if (this.entries[date].habits && this.entries[date].habits[habitName] !== undefined) {
                delete this.entries[date].habits[habitName];
            }
        });
        
        this.saveData();
        
        if (this.selectedDate) {
            const dateString = this.formatDate(this.selectedDate);
            const entry = this.entries[dateString] || {};
            this.renderHabits(entry.habits || {});
        }
        
        this.renderHabitLegend();
        this.renderCurrentView();
        this.showToast('Custom habit removed', 'warning');
    }
    
    getAllHabits() {
        return [...this.defaultHabits, ...this.customHabits];
    }
    
    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentEntry();
            this.updateAutoSaveStatus();
        }, 2000);
        
        this.updateWordCount();
    }
    
    saveCurrentEntry() {
        if (!this.selectedDate) return;
        
        const dateString = this.formatDate(this.selectedDate);
        const dailyTextEl = document.getElementById('dailyText');
        const text = dailyTextEl ? dailyTextEl.value || '' : '';
        
        const habits = {};
        const allHabits = this.getAllHabits();
        
        allHabits.forEach((habit, index) => {
            const checkbox = document.getElementById(`habit-${index}`);
            if (checkbox) {
                habits[habit] = checkbox.checked;
            }
        });
        
        this.entries[dateString] = { 
            text, 
            habits, 
            timestamp: new Date().toISOString() 
        };
        this.saveData();
    }
    
    quickSave() {
        console.log('💾 Quick saving entry...');
        try {
            this.saveCurrentEntry();
            this.showToast('Entry saved! 💾', 'success');
        } catch (error) {
            console.error('❌ Error quick saving:', error);
            this.showToast('Error saving entry', 'error');
        }
    }
    
    saveEntry() {
        console.log('💾 Saving and closing entry...');
        try {
            this.saveCurrentEntry();
            this.closeModal('dailyModal');
            this.renderCurrentView();
            this.showToast('Entry saved successfully! 🎉', 'success');
        } catch (error) {
            console.error('❌ Error saving entry:', error);
            this.showToast('Error saving entry', 'error');
        }
    }
    
    updateAutoSaveStatus() {
        const statusElement = document.querySelector('.auto-save-status');
        if (statusElement) {
            statusElement.textContent = '✓ Auto-saved';
            statusElement.style.opacity = '1';
            
            setTimeout(() => {
                statusElement.style.opacity = '0.7';
            }, 2000);
        }
    }
    
    // Habit Legend
    renderHabitLegend() {
        const habitColors = document.getElementById('habitColors');
        if (!habitColors) return;
        
        habitColors.innerHTML = '';
        const allHabits = [...this.defaultHabits, ...this.customHabits];
        
        allHabits.forEach(habit => {
            const colorItem = document.createElement('div');
            colorItem.className = 'habit-color-item';
            
            const dot = document.createElement('div');
            dot.className = 'habit-color-dot';
            dot.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
            
            const name = document.createElement('div');
            name.className = 'habit-color-name';
            name.textContent = habit;
            
            colorItem.appendChild(dot);
            colorItem.appendChild(name);
            habitColors.appendChild(colorItem);
        });
    }
    
    getRandomColor() {
        return this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
    }
    
    // FIXED: Modal Management with proper logging
    closeModal(modalId) {
        console.log(`🔒 Closing modal: ${modalId}`);
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
                console.log(`✅ Modal ${modalId} closed successfully`);
            } else {
                console.warn(`⚠️ Modal ${modalId} not found`);
            }
            if (modalId === 'dailyModal') {
                this.selectedDate = null;
            }
        } catch (error) {
            console.error(`❌ Error closing modal ${modalId}:`, error);
        }
    }
    
    closeAllModals() {
        console.log('🔒 Closing all modals...');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.selectedDate = null;
    }
    
    // FIXED: Settings modal opening with comprehensive error handling
    openSettingsModal() {
        console.log('⚙️ Opening settings modal...');
        try {
            const modal = document.getElementById('settingsModal');
            if (modal) {
                modal.classList.remove('hidden');
                this.updateSyncInfo();
                console.log('✅ Settings modal opened successfully');
                this.showToast('Settings opened', 'success');
            } else {
                console.error('❌ Settings modal element not found in DOM');
                this.showToast('Error: Settings modal not found', 'error');
            }
        } catch (error) {
            console.error('❌ Error opening settings modal:', error);
            this.showToast(`Error opening settings: ${error.message}`, 'error');
        }
    }
    
    openImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    // Jump To Functionality
    openJumpToModal() {
        const jumpDate = document.getElementById('jumpDate');
        if (jumpDate) {
            jumpDate.value = this.formatDate(new Date());
        }
        const modal = document.getElementById('jumpToModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    executeJump() {
        const jumpDate = document.getElementById('jumpDate');
        if (jumpDate && jumpDate.value) {
            const targetDate = new Date(jumpDate.value);
            this.jumpToDate(targetDate);
        }
        this.closeModal('jumpToModal');
    }
    
    jumpToToday() {
        this.jumpToDate(new Date());
        this.closeModal('jumpToModal');
    }
    
    jumpToYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.jumpToDate(yesterday);
        this.closeModal('jumpToModal');
    }
    
    jumpToWeekStart() {
        this.jumpToDate(this.getWeekStart(new Date()));
        this.closeModal('jumpToModal');
    }
    
    jumpToMonthStart() {
        const monthStart = new Date();
        monthStart.setDate(1);
        this.jumpToDate(monthStart);
        this.closeModal('jumpToModal');
    }
    
    jumpToDate(targetDate) {
        this.currentDate = targetDate;
        this.currentWeekStart = this.getWeekStart(targetDate);
        this.currentMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        this.currentYear = targetDate.getFullYear();
        
        if (this.currentView === 'yearly') {
            this.renderYearlyCalendar();
        } else if (this.currentView === 'monthly') {
            this.renderMonthlyCalendar();
            this.renderMonthlySummary();
        } else {
            this.switchView('weekly');
        }
        
        this.showToast(`Jumped to ${this.formatDateDisplay(targetDate)} 🚀`, 'success');
    }
    
    // GitHub Sync Functionality - WORKING
    handleSyncButton() {
        if (!this.syncConfig.enabled) {
            this.openSettingsModal();
        } else {
            this.syncNow();
        }
    }
    
    async setupGitHubSync() {
        const tokenInput = document.getElementById('githubToken');
        if (!tokenInput) return;
        
        const token = tokenInput.value.trim();
        if (!token) {
            this.showToast('Please enter a GitHub token', 'warning');
            return;
        }
        
        this.showLoadingSpinner('Setting up sync...');
        
        try {
            // Test the token first
            const testResponse = await this.testConnection(token);
            if (!testResponse.success) {
                throw new Error(testResponse.error);
            }
            
            // Create initial gist
            this.syncConfig.githubToken = token;
            await this.createOrUpdateGist(true); // true = create new
            
            this.syncConfig.enabled = true;
            this.syncConfig.lastSync = new Date().toISOString();
            this.saveData();
            
            this.hideLoadingSpinner();
            this.closeModal('settingsModal');
            this.updateSyncStatus();
            this.showToast('✅ GitHub sync enabled successfully!', 'success');
            
            this.startAutoSync();
        } catch (error) {
            this.hideLoadingSpinner();
            this.showToast(`❌ Sync setup failed: ${error.message}`, 'error');
            console.error('Sync setup error:', error);
        }
    }
    
    async testGitHubConnection() {
        const tokenInput = document.getElementById('githubToken');
        const statusDiv = document.getElementById('tokenStatus');
        
        if (!tokenInput || !statusDiv) return;
        
        const token = tokenInput.value.trim();
        if (!token) {
            statusDiv.textContent = 'Please enter a token';
            statusDiv.className = 'token-status error';
            statusDiv.classList.remove('hidden');
            return;
        }
        
        statusDiv.textContent = 'Testing connection...';
        statusDiv.className = 'token-status';
        statusDiv.classList.remove('hidden');
        
        try {
            const result = await this.testConnection(token);
            
            if (result.success) {
                statusDiv.textContent = `✅ Connected as ${result.username}`;
                statusDiv.className = 'token-status success';
            } else {
                statusDiv.textContent = `❌ ${result.error}`;
                statusDiv.className = 'token-status error';
            }
        } catch (error) {
            statusDiv.textContent = '❌ Connection failed. Check your internet connection.';
            statusDiv.className = 'token-status error';
        }
    }
    
    async testConnection(token) {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Daily-Tracker-App'
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                return { success: true, username: user.login };
            } else if (response.status === 401) {
                return { success: false, error: 'Invalid token or insufficient permissions' };
            } else if (response.status === 403) {
                return { success: false, error: 'Rate limit exceeded or token lacks gist scope' };
            } else {
                return { success: false, error: `API error: ${response.status}` };
            }
        } catch (error) {
            return { success: false, error: 'Network error or CORS issue' };
        }
    }
    
    async createOrUpdateGist(forceCreate = false) {
        if (!this.syncConfig.githubToken) {
            throw new Error('No GitHub token configured');
        }
        
        const gistData = {
            description: `Daily Activity Tracker Data for ${this.userName}`,
            public: false,
            files: {
                'daily-tracker-data.json': {
                    content: JSON.stringify({
                        entries: this.entries,
                        customHabits: this.customHabits,
                        habitColors: this.habitColors,
                        goals: this.goals,
                        lastSync: new Date().toISOString(),
                        version: '4.2.0',
                        userName: this.userName
                    }, null, 2)
                },
                'README.md': {
                    content: `# Daily Activity Tracker Data for ${this.userName}\n\nThis gist contains your personal daily tracker data.\nLast updated: ${new Date().toISOString()}\n\n**Do not edit this gist manually** - it's automatically synchronized by the Daily Tracker app.`
                }
            }
        };
        
        let url, method;
        
        if (this.syncConfig.gistId && !forceCreate) {
            // Update existing gist
            url = `https://api.github.com/gists/${this.syncConfig.gistId}`;
            method = 'PATCH';
        } else {
            // Create new gist
            url = 'https://api.github.com/gists';
            method = 'POST';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `token ${this.syncConfig.githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Daily-Tracker-App'
            },
            body: JSON.stringify(gistData)
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`GitHub API error: ${response.status} - ${errorBody}`);
        }
        
        const result = await response.json();
        this.syncConfig.gistId = result.id;
        this.syncConfig.lastSync = new Date().toISOString();
        this.syncConfig.retryCount = 0; // Reset retry count on success
        
        return result;
    }
    
    async syncNow() {
        if (!this.syncConfig.enabled || !this.syncConfig.githubToken) {
            this.showToast('Sync not configured. Please setup GitHub sync first.', 'warning');
            return;
        }
        
        if (this.syncConfig.syncInProgress) {
            this.showToast('Sync already in progress...', 'warning');
            return;
        }
        
        this.syncConfig.syncInProgress = true;
        this.updateSyncStatus('syncing');
        
        try {
            await this.createOrUpdateGist();
            this.saveData(); // Save the updated sync config
            this.updateSyncStatus('synced');
            this.showToast('✅ Data synced to GitHub successfully!', 'success');
        } catch (error) {
            console.error('Sync error:', error);
            this.syncConfig.retryCount = (this.syncConfig.retryCount || 0) + 1;
            
            if (this.syncConfig.retryCount >= this.syncConfig.maxRetries) {
                this.updateSyncStatus('error');
                this.showToast('❌ Sync failed after multiple attempts. Check your connection and token.', 'error');
            } else {
                this.updateSyncStatus('error');
                this.showToast(`❌ Sync failed (attempt ${this.syncConfig.retryCount}/${this.syncConfig.maxRetries}). Retrying...`, 'warning');
                
                // Retry after a delay
                setTimeout(() => {
                    this.syncNow();
                }, 5000 * this.syncConfig.retryCount); // Exponential backoff
            }
        } finally {
            this.syncConfig.syncInProgress = false;
        }
    }
    
    startAutoSync() {
        if (!this.syncConfig.enabled) return;
        
        // Clear existing interval
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }
        
        this.autoSyncInterval = setInterval(() => {
            if (this.syncConfig.enabled && this.syncConfig.githubToken && this.dataChanged && !this.syncConfig.syncInProgress) {
                console.log('Auto-syncing data...');
                this.dataChanged = false; // Reset flag
                this.syncNow();
            }
        }, this.syncConfig.autoSyncInterval);
    }
    
    disableSync() {
        this.syncConfig.enabled = false;
        this.syncConfig.githubToken = null;
        this.saveData();
        
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }
        
        this.updateSyncStatus();
        this.closeModal('settingsModal');
        this.showToast('GitHub sync disabled', 'warning');
    }
    
    updateSyncStatus(status = null) {
        const syncStatusEl = document.getElementById('syncStatus');
        const statusDot = syncStatusEl?.querySelector('.status-dot');
        const statusText = syncStatusEl?.querySelector('.status-text');
        
        if (!syncStatusEl || !statusDot || !statusText) return;
        
        // Remove all status classes
        syncStatusEl.classList.remove('online', 'syncing', 'error');
        
        if (status === 'syncing') {
            statusText.textContent = 'Syncing...';
            syncStatusEl.classList.add('syncing');
        } else if (status === 'synced') {
            statusText.textContent = 'Synced';
            syncStatusEl.classList.add('online');
        } else if (status === 'error') {
            statusText.textContent = 'Sync Error';
            syncStatusEl.classList.add('error');
        } else if (this.syncConfig.enabled) {
            statusText.textContent = 'Online';
            syncStatusEl.classList.add('online');
        } else {
            statusText.textContent = 'Offline';
        }
    }
    
    updateSyncInfo() {
        const syncInfo = document.getElementById('syncInfo');
        const syncStatusDetail = document.getElementById('syncStatusDetail');
        const lastSyncTime = document.getElementById('lastSyncTime');
        const currentGistId = document.getElementById('currentGistId');
        
        if (this.syncConfig.enabled) {
            if (syncInfo) syncInfo.classList.remove('hidden');
            if (syncStatusDetail) syncStatusDetail.textContent = 'Connected';
            if (lastSyncTime) {
                const lastSync = this.syncConfig.lastSync ? new Date(this.syncConfig.lastSync).toLocaleString() : 'Never';
                lastSyncTime.textContent = lastSync;
            }
            if (currentGistId) currentGistId.textContent = this.syncConfig.gistId || 'Not set';
        } else {
            if (syncInfo) syncInfo.classList.add('hidden');
        }
    }
    
    showLoadingSpinner(text = 'Loading...') {
        const spinner = document.getElementById('loadingSpinner');
        const loadingText = spinner?.querySelector('.loading-text');
        
        if (spinner) {
            spinner.classList.remove('hidden');
            if (loadingText) loadingText.textContent = text;
        }
    }
    
    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }
    
    // Export/Import Methods
    exportData(format = 'json') {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            exportDate: new Date().toISOString(),
            version: "4.2.0",
            userName: this.userName
        };
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'json') {
            this.downloadFile(
                JSON.stringify(data, null, 2),
                `${this.userName.toLowerCase()}-daily-tracker-${timestamp}.json`,
                'application/json'
            );
        } else if (format === 'csv') {
            const csv = this.convertToCSV(data);
            this.downloadFile(
                csv,
                `${this.userName.toLowerCase()}-daily-tracker-${timestamp}.csv`,
                'text/csv'
            );
        }
        
        this.showToast(`📤 Data exported as ${format.toUpperCase()}!`, 'success');
    }
    
    convertToCSV(data) {
        const headers = ['Date', 'Entry Text', 'Word Count', ...this.getAllHabits()];
        const rows = [headers];
        
        Object.keys(data.entries).sort().forEach(date => {
            const entry = data.entries[date];
            const row = [
                date,
                `"${(entry.text || '').replace(/"/g, '""')}"`,
                entry.text ? entry.text.split(' ').length : 0
            ];
            
            this.getAllHabits().forEach(habit => {
                row.push(entry.habits && entry.habits[habit] ? 'Yes' : 'No');
            });
            
            rows.push(row);
        });
        
        return rows.map(row => row.join(',')).join('\n');
    }
    
    async executeImport() {
        const fileInput = document.getElementById('importFile');
        const importMode = document.querySelector('input[name="importMode"]:checked')?.value;
        
        if (!fileInput?.files[0]) {
            this.showToast('Please select a file to import', 'warning');
            return;
        }
        
        try {
            const fileContent = await this.readFile(fileInput.files[0]);
            const importData = JSON.parse(fileContent);
            
            if (importMode === 'overwrite') {
                this.entries = importData.entries || {};
                this.customHabits = importData.customHabits || [];
                this.habitColors = importData.habitColors || this.habitColors;
                this.goals = importData.goals || { weekly: {}, monthly: {}, yearly: {} };
            } else {
                // Merge mode
                this.entries = { ...this.entries, ...importData.entries };
                this.customHabits = [...new Set([...this.customHabits, ...(importData.customHabits || [])])];
                this.habitColors = { ...this.habitColors, ...importData.habitColors };
                this.goals = {
                    weekly: { ...this.goals.weekly, ...importData.goals?.weekly },
                    monthly: { ...this.goals.monthly, ...importData.goals?.monthly },
                    yearly: { ...this.goals.yearly, ...importData.goals?.yearly }
                };
            }
            
            this.saveData();
            this.closeModal('importModal');
            this.renderCurrentView();
            this.showToast('📥 Data imported successfully!', 'success');
            
        } catch (error) {
            this.showToast('❌ Error importing data: Invalid file format', 'error');
            console.error('Import error:', error);
        }
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Utility Methods
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    formatDateDisplay(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
    
    showToast(message, type = 'success') {
        console.log(`🍞 Toast: ${message} (${type})`);
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4000);
        }
    }
}

// FIXED: Initialize the tracker properly
console.log('📱 Initializing Ultimate Daily Tracker...');
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new UltimateDailyTracker();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.tracker = new UltimateDailyTracker();
}

console.log('✅ Daily Tracker Script Loaded Successfully');