// Enhanced Daily Activity Tracker with Goals and GitHub Gist Sync

class DailyTracker {
    constructor() {
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.selectedDate = null;
        this.currentView = 'weekly';
        
        // Motivational quotes collection
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
            "Success isn't just about what you accomplish in your life, it's about what you inspire others to do.",
            "The only impossible journey is the one you never begin.",
            "Quality is not an act, it is a habit.",
            "Champions keep playing until they get it right.",
            "The difference between ordinary and extraordinary is that little extra.",
            "Success is where preparation and opportunity meet.",
            "It is during our darkest moments that we must focus to see the light.",
            "Believe you can and you're halfway there.",
            "The future depends on what you do today.",
            "Don't watch the clock; do what it does. Keep going.",
            "The expert in anything was once a beginner.",
            "Your limitation—it's only your imagination.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Success doesn't just find you. You have to go out and get it.",
            "The harder you work for something, the greater you'll feel when you achieve it.",
            "Dream bigger. Do bigger.",
            "Don't stop when you're tired. Stop when you're done.",
            "Wake up with determination. Go to bed with satisfaction.",
            "Do something today that your future self will thank you for."
        ];
        
        // Habit colors
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
        
        // Available colors for new habits
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4", 
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        
        // Default habits
        this.defaultHabits = [
            "Study/Learning",
            "Exercise", 
            "Reading",
            "Planning",
            "Review Sessions",
            "Project Work",
            "Skill Development",
            "Health Care"
        ];

        // GitHub sync settings
        this.githubSettings = {
            token: '',
            gistId: '',
            lastSync: null,
            autoSync: false
        };

        // Sync status
        this.syncInProgress = false;
        this.syncInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Enhanced Daily Tracker...');
        // Wait for DOM to be fully loaded
        setTimeout(() => {
            this.loadData();
            this.displayRandomQuote();
            this.setupEventListeners();
            this.renderCurrentView();
            this.loadGitHubSettings();
            this.setupAutoSync();
        }, 100);
    }
    
    loadData() {
        // Load from localStorage
        const storedData = localStorage.getItem('dailyTrackerData');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.entries = data.entries || {};
            this.customHabits = data.customHabits || [];
            this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
            this.goals = data.goals || this.getDefaultGoals();
        } else {
            // Use provided application data as initial data
            this.entries = {};
            this.goals = this.getDefaultGoals();
            this.customHabits = [];
            this.saveData();
        }
    }

    getDefaultGoals() {
        return {
            weekly: [
                { id: 'w1', text: 'Complete 3 major study sessions', completed: false },
                { id: 'w2', text: 'Exercise 5 times this week', completed: false },
                { id: 'w3', text: 'Read 2 chapters of current book', completed: true },
                { id: 'w4', text: 'Plan next week\'s objectives', completed: false }
            ],
            monthly: [
                { id: 'm1', text: 'Complete current course/program', completed: false },
                { id: 'm2', text: 'Maintain consistent daily habits', completed: false },
                { id: 'm3', text: 'Finish 2 major projects', completed: false }
            ],
            yearly: [
                { id: 'y1', text: 'Achieve primary career goal', completed: false },
                { id: 'y2', text: 'Develop 3 new major skills', completed: false },
                { id: 'y3', text: 'Maintain excellent health and fitness', completed: false }
            ]
        };
    }
    
    saveData() {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            version: "3.0.0",
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('dailyTrackerData', JSON.stringify(data));
        
        // Trigger sync if enabled
        if (this.githubSettings.autoSync && !this.syncInProgress) {
            this.debouncedSync();
        }
    }

    displayRandomQuote() {
        const quoteElement = document.getElementById('motivationalQuote');
        if (quoteElement) {
            const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
            quoteElement.textContent = `"${randomQuote}"`;
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab navigation - with preventDefault to stop any default behavior
        const weeklyTab = document.getElementById('weeklyTab');
        const monthlyTab = document.getElementById('monthlyTab');
        const goalsTab = document.getElementById('goalsTab');
        
        if (weeklyTab) {
            weeklyTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchView('weekly');
            });
        }
        if (monthlyTab) {
            monthlyTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchView('monthly');
            });
        }
        if (goalsTab) {
            goalsTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchView('goals');
            });
        }
        
        // Navigation controls
        const prevWeek = document.getElementById('prevWeek');
        const nextWeek = document.getElementById('nextWeek');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        
        if (prevWeek) prevWeek.addEventListener('click', (e) => { e.preventDefault(); this.navigateWeek(-1); });
        if (nextWeek) nextWeek.addEventListener('click', (e) => { e.preventDefault(); this.navigateWeek(1); });
        if (prevMonth) prevMonth.addEventListener('click', (e) => { e.preventDefault(); this.navigateMonth(-1); });
        if (nextMonth) nextMonth.addEventListener('click', (e) => { e.preventDefault(); this.navigateMonth(1); });
        if (todayBtn) todayBtn.addEventListener('click', (e) => { e.preventDefault(); this.goToToday(); });
        
        // Sync and settings
        const syncBtn = document.getElementById('syncBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        const testConnection = document.getElementById('testConnection');
        const saveSettings = document.getElementById('saveSettings');
        
        if (syncBtn) syncBtn.addEventListener('click', (e) => { e.preventDefault(); this.manualSync(); });
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Settings button clicked');
                this.openSettings();
            });
        }
        if (closeSettingsModal) closeSettingsModal.addEventListener('click', (e) => { e.preventDefault(); this.closeSettings(); });
        if (testConnection) testConnection.addEventListener('click', (e) => { e.preventDefault(); this.testGitHubConnection(); });
        if (saveSettings) saveSettings.addEventListener('click', (e) => { e.preventDefault(); this.saveGitHubSettings(); });
        
        // Export/Import
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        
        if (exportBtn) exportBtn.addEventListener('click', (e) => { e.preventDefault(); this.openExportModal(); });
        if (importBtn) importBtn.addEventListener('click', (e) => { e.preventDefault(); this.openImportModal(); });
        
        // Modal controls
        const closeModal = document.getElementById('closeModal');
        const closeEntryView = document.getElementById('closeEntryView');
        const closeExportModal = document.getElementById('closeExportModal');
        const closeImportModal = document.getElementById('closeImportModal');
        const saveEntry = document.getElementById('saveEntry');
        
        if (closeModal) closeModal.addEventListener('click', (e) => { e.preventDefault(); this.closeModal(); });
        if (closeEntryView) closeEntryView.addEventListener('click', (e) => { e.preventDefault(); this.closeEntryViewModal(); });
        if (closeExportModal) closeExportModal.addEventListener('click', (e) => { e.preventDefault(); this.closeExportModal(); });
        if (closeImportModal) closeImportModal.addEventListener('click', (e) => { e.preventDefault(); this.closeImportModal(); });
        if (saveEntry) saveEntry.addEventListener('click', (e) => { e.preventDefault(); this.saveEntry(); });
        
        // Export buttons
        const exportJSON = document.getElementById('exportJSON');
        const exportCSV = document.getElementById('exportCSV');
        
        if (exportJSON) exportJSON.addEventListener('click', (e) => { e.preventDefault(); this.exportData('json'); });
        if (exportCSV) exportCSV.addEventListener('click', (e) => { e.preventDefault(); this.exportData('csv'); });
        
        // Import
        const executeImport = document.getElementById('executeImport');
        if (executeImport) executeImport.addEventListener('click', (e) => { e.preventDefault(); this.executeImport(); });
        
        // Goals management
        const addWeeklyGoal = document.getElementById('addWeeklyGoal');
        const addMonthlyGoal = document.getElementById('addMonthlyGoal');
        const addYearlyGoal = document.getElementById('addYearlyGoal');
        
        if (addWeeklyGoal) addWeeklyGoal.addEventListener('click', (e) => { e.preventDefault(); this.addGoal('weekly'); });
        if (addMonthlyGoal) addMonthlyGoal.addEventListener('click', (e) => { e.preventDefault(); this.addGoal('monthly'); });
        if (addYearlyGoal) addYearlyGoal.addEventListener('click', (e) => { e.preventDefault(); this.addGoal('yearly'); });
        
        // Goal input enter key
        const newWeeklyGoal = document.getElementById('newWeeklyGoal');
        const newMonthlyGoal = document.getElementById('newMonthlyGoal');
        const newYearlyGoal = document.getElementById('newYearlyGoal');
        
        if (newWeeklyGoal) {
            newWeeklyGoal.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoal('weekly');
                }
            });
        }
        if (newMonthlyGoal) {
            newMonthlyGoal.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoal('monthly');
                }
            });
        }
        if (newYearlyGoal) {
            newYearlyGoal.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoal('yearly');
                }
            });
        }
        
        // Habit management
        const addHabit = document.getElementById('addHabit');
        const newHabit = document.getElementById('newHabit');
        
        if (addHabit) addHabit.addEventListener('click', (e) => { e.preventDefault(); this.addCustomHabit(); });
        if (newHabit) {
            newHabit.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addCustomHabit();
                }
            });
        }
        
        // Auto-save
        const dailyText = document.getElementById('dailyText');
        if (dailyText) dailyText.addEventListener('input', () => this.autoSave());
        
        // Modal background clicks
        const dailyModal = document.getElementById('dailyModal');
        const entryViewModal = document.getElementById('entryViewModal');
        const exportModal = document.getElementById('exportModal');
        const importModal = document.getElementById('importModal');
        const settingsModal = document.getElementById('settingsModal');
        
        if (dailyModal) {
            dailyModal.addEventListener('click', (e) => {
                if (e.target.id === 'dailyModal') this.closeModal();
            });
        }
        if (entryViewModal) {
            entryViewModal.addEventListener('click', (e) => {
                if (e.target.id === 'entryViewModal') this.closeEntryViewModal();
            });
        }
        if (exportModal) {
            exportModal.addEventListener('click', (e) => {
                if (e.target.id === 'exportModal') this.closeExportModal();
            });
        }
        if (importModal) {
            importModal.addEventListener('click', (e) => {
                if (e.target.id === 'importModal') this.closeImportModal();
            });
        }
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target.id === 'settingsModal') this.closeSettings();
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    switchView(view) {
        console.log('Switching to view:', view);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('tab-btn--active'));
        const activeTab = document.getElementById(`${view}Tab`);
        if (activeTab) {
            activeTab.classList.add('tab-btn--active');
            console.log(`Activated tab: ${view}Tab`);
        }
        
        // Hide all views
        const allViews = document.querySelectorAll('.main-view');
        console.log('Found views:', allViews.length);
        allViews.forEach(viewEl => {
            if (viewEl) {
                viewEl.classList.add('hidden');
                console.log('Hidden view:', viewEl.id);
            }
        });
        
        // Show selected view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.remove('hidden');
            console.log(`Showed view: ${view}View`);
        } else {
            console.error(`Target view not found: ${view}View`);
        }
        
        this.currentView = view;
        this.renderCurrentView();
    }
    
    renderCurrentView() {
        console.log('Rendering view:', this.currentView);
        
        switch(this.currentView) {
            case 'weekly':
                this.renderWeeklyCalendar();
                this.renderHabitLegend();
                break;
            case 'monthly':
                this.renderMonthlyCalendar();
                this.renderMonthlySummary();
                break;
            case 'goals':
                this.renderGoals();
                break;
        }
    }
    
    // Goals Management
    renderGoals() {
        console.log('Rendering goals view');
        this.renderGoalSection('weekly');
        this.renderGoalSection('monthly');
        this.renderGoalSection('yearly');
    }

    renderGoalSection(type) {
        const goalsList = document.getElementById(`${type}GoalsList`);
        const progressElement = document.getElementById(`${type}Progress`);
        
        console.log(`Rendering ${type} goals. List element:`, goalsList, 'Progress element:', progressElement);
        
        if (!goalsList || !progressElement) {
            console.log(`Missing elements for ${type} goals`);
            return;
        }

        goalsList.innerHTML = '';
        const goals = this.goals[type] || [];
        const completedCount = goals.filter(goal => goal.completed).length;
        
        // Update progress
        progressElement.textContent = `${completedCount}/${goals.length} completed`;
        
        goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'goal-checkbox';
            checkbox.checked = goal.completed;
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleGoal(type, goal.id);
            });
            
            const text = document.createElement('div');
            text.className = 'goal-text';
            text.textContent = goal.text;
            text.addEventListener('click', (e) => {
                e.stopPropagation();
                checkbox.checked = !checkbox.checked;
                this.toggleGoal(type, goal.id);
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'goal-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeGoal(type, goal.id);
            });
            
            goalItem.appendChild(checkbox);
            goalItem.appendChild(text);
            goalItem.appendChild(removeBtn);
            goalsList.appendChild(goalItem);
        });
        
        console.log(`Rendered ${goals.length} ${type} goals`);
    }

    addGoal(type) {
        const input = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}Goal`);
        if (!input) return;
        
        const goalText = input.value.trim();
        if (!goalText) return;
        
        const newGoal = {
            id: `${type.charAt(0)}${Date.now()}`,
            text: goalText,
            completed: false
        };
        
        if (!this.goals[type]) {
            this.goals[type] = [];
        }
        
        this.goals[type].push(newGoal);
        input.value = '';
        this.saveData();
        this.renderGoalSection(type);
        this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} goal added!`, 'success');
    }

    toggleGoal(type, goalId) {
        const goal = this.goals[type].find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveData();
            this.renderGoalSection(type);
            
            const status = goal.completed ? 'completed' : 'uncompleted';
            this.showToast(`Goal ${status}!`, 'success');
        }
    }

    removeGoal(type, goalId) {
        this.goals[type] = this.goals[type].filter(g => g.id !== goalId);
        this.saveData();
        this.renderGoalSection(type);
        this.showToast('Goal removed!', 'success');
    }

    // GitHub Gist Sync
    loadGitHubSettings() {
        const stored = localStorage.getItem('githubSyncSettings');
        if (stored) {
            this.githubSettings = { ...this.githubSettings, ...JSON.parse(stored) };
            this.updateSyncUI();
        }
    }

    saveGitHubSettings() {
        const token = document.getElementById('githubToken')?.value.trim();
        const gistId = document.getElementById('gistId')?.value.trim();
        
        if (!token) {
            this.showToast('Please enter a GitHub Personal Access Token', 'error');
            return;
        }
        
        this.githubSettings.token = token;
        this.githubSettings.gistId = gistId;
        this.githubSettings.autoSync = true;
        
        localStorage.setItem('githubSyncSettings', JSON.stringify(this.githubSettings));
        this.updateSyncUI();
        this.setupAutoSync();
        this.closeSettings();
        this.showToast('GitHub sync settings saved!', 'success');
    }

    async testGitHubConnection() {
        const token = document.getElementById('githubToken')?.value.trim();
        
        if (!token) {
            this.showToast('Please enter a GitHub token first', 'error');
            return;
        }
        
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                this.showToast(`Connected as ${user.login}!`, 'success');
            } else {
                this.showToast('Invalid token or connection failed', 'error');
            }
        } catch (error) {
            this.showToast('Connection test failed', 'error');
        }
    }

    setupAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        if (this.githubSettings.autoSync && this.githubSettings.token) {
            this.syncInterval = setInterval(() => {
                if (!this.syncInProgress) {
                    this.syncToGist();
                }
            }, 30000); // Sync every 30 seconds
        }
    }

    debouncedSync = this.debounce(() => {
        if (this.githubSettings.autoSync && !this.syncInProgress) {
            this.syncToGist();
        }
    }, 2000);

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async manualSync() {
        if (!this.githubSettings.token) {
            this.openSettings();
            this.showToast('Please configure GitHub sync first', 'error');
            return;
        }
        
        await this.syncToGist();
    }

    async syncToGist() {
        if (this.syncInProgress) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('Syncing...', 'syncing');
        
        try {
            const data = {
                entries: this.entries,
                customHabits: this.customHabits,
                habitColors: this.habitColors,
                goals: this.goals,
                syncTime: new Date().toISOString(),
                version: "3.0.0"
            };
            
            const gistData = {
                description: "Daily Activity Tracker - Amit's Data",
                public: false,
                files: {
                    "daily-tracker-data.json": {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            };
            
            let response;
            if (this.githubSettings.gistId) {
                // Update existing gist
                response = await fetch(`https://api.github.com/gists/${this.githubSettings.gistId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${this.githubSettings.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(gistData)
                });
            } else {
                // Create new gist
                response = await fetch('https://api.github.com/gists', {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${this.githubSettings.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(gistData)
                });
            }
            
            if (response.ok) {
                const gist = await response.json();
                if (!this.githubSettings.gistId) {
                    this.githubSettings.gistId = gist.id;
                    localStorage.setItem('githubSyncSettings', JSON.stringify(this.githubSettings));
                }
                
                this.githubSettings.lastSync = new Date().toISOString();
                localStorage.setItem('githubSyncSettings', JSON.stringify(this.githubSettings));
                
                this.updateSyncStatus('Synced successfully', 'success');
                this.updateSyncUI();
            } else {
                throw new Error('Sync failed');
            }
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('Sync failed', 'error');
        } finally {
            this.syncInProgress = false;
            setTimeout(() => this.hideSyncStatus(), 3000);
        }
    }

    updateSyncStatus(message, type) {
        const statusElement = document.getElementById('syncStatus');
        const textElement = document.getElementById('syncStatusText');
        
        if (statusElement && textElement) {
            textElement.textContent = message;
            statusElement.className = `sync-status ${type}`;
            statusElement.classList.remove('hidden');
        }
    }

    hideSyncStatus() {
        const statusElement = document.getElementById('syncStatus');
        if (statusElement) {
            statusElement.classList.add('hidden');
        }
    }

    updateSyncUI() {
        const syncBtn = document.getElementById('syncBtn');
        const syncIcon = document.getElementById('syncIcon');
        const autoSyncStatus = document.getElementById('autoSyncStatus');
        const lastSyncTime = document.getElementById('lastSyncTime');
        
        if (syncBtn && syncIcon) {
            if (this.githubSettings.autoSync && this.githubSettings.token) {
                syncBtn.classList.remove('btn--outline');
                syncBtn.classList.add('btn--primary');
                syncIcon.textContent = '☁️';
            } else {
                syncBtn.classList.add('btn--outline');
                syncBtn.classList.remove('btn--primary');
                syncIcon.textContent = '☁️';
            }
        }
        
        if (autoSyncStatus) {
            autoSyncStatus.textContent = this.githubSettings.autoSync ? 'Enabled' : 'Disabled';
        }
        
        if (lastSyncTime) {
            if (this.githubSettings.lastSync) {
                const syncDate = new Date(this.githubSettings.lastSync);
                lastSyncTime.textContent = syncDate.toLocaleString();
            } else {
                lastSyncTime.textContent = 'Never';
            }
        }
    }
    
    // Weekly Calendar Methods
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
    
    navigateWeek(direction) {
        const newDate = new Date(this.currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction * 7));
        this.currentWeekStart = newDate;
        this.renderWeeklyCalendar();
        this.renderHabitLegend();
    }
    
    renderWeeklyCalendar() {
        const weekRange = document.getElementById('weekRange');
        const calendarDays = document.getElementById('calendarDays');
        
        if (!weekRange || !calendarDays) return;
        
        // Update week range display
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekRange.textContent = `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
        
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Create 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            calendarDays.appendChild(this.createWeeklyDayElement(date));
        }
        
        this.highlightToday();
    }
    
    createWeeklyDayElement(date) {
        const dateString = this.formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.setAttribute('data-date', dateString);
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // Entry preview
        if (this.entries[dateString]) {
            const preview = document.createElement('div');
            preview.className = 'day-preview';
            const text = this.entries[dateString].text;
            preview.textContent = text.length > 80 ? text.substring(0, 80) + '...' : text;
            preview.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEntryView(date);
            });
            dayElement.appendChild(preview);
            
            // Habits indicator with colors
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
        
        // Click handler
        dayElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    // Monthly Calendar Methods
    navigateMonth(direction) {
        const newDate = new Date(this.currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        this.currentMonth = newDate;
        this.renderMonthlyCalendar();
        this.renderMonthlySummary();
    }
    
    renderMonthlyCalendar() {
        const monthYear = document.getElementById('monthYear');
        const monthlyCalendarDays = document.getElementById('monthlyCalendarDays');
        
        if (!monthYear || !monthlyCalendarDays) return;
        
        // Update month/year display
        monthYear.textContent = this.currentMonth.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Clear previous days
        monthlyCalendarDays.innerHTML = '';
        
        // Get first day of month and how many days
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'monthly-day other-month';
            monthlyCalendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
            monthlyCalendarDays.appendChild(this.createMonthlyDayElement(date));
        }
        
        this.highlightToday();
    }
    
    createMonthlyDayElement(date) {
        const dateString = this.formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'monthly-day';
        dayElement.setAttribute('data-date', dateString);
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // Habits indicator
        if (this.entries[dateString]) {
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
        
        // Click handler
        dayElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    renderMonthlySummary() {
        const summaryContent = document.getElementById('monthlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        
        // Calculate monthly stats
        const monthStart = new Date(this.currentMonth);
        const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const stats = this.calculateMonthlyStats(monthStart, monthEnd);
        
        // Total entries
        const totalEntries = document.createElement('div');
        totalEntries.className = 'summary-stat';
        totalEntries.innerHTML = `
            <span class="summary-label">Total Entries</span>
            <span class="summary-value">${stats.totalEntries}</span>
        `;
        summaryContent.appendChild(totalEntries);
        
        // Most consistent habit
        if (stats.topHabit) {
            const topHabit = document.createElement('div');
            topHabit.className = 'summary-stat';
            topHabit.innerHTML = `
                <span class="summary-label">Most Consistent Habit</span>
                <span class="summary-value">${stats.topHabit.name} (${stats.topHabit.count} days)</span>
            `;
            summaryContent.appendChild(topHabit);
        }
        
        // Average entry length
        const avgLength = document.createElement('div');
        avgLength.className = 'summary-stat';
        avgLength.innerHTML = `
            <span class="summary-label">Average Entry Length</span>
            <span class="summary-value">${stats.avgEntryLength} words</span>
        `;
        summaryContent.appendChild(avgLength);
    }
    
    calculateMonthlyStats(startDate, endDate) {
        const stats = {
            totalEntries: 0,
            totalWords: 0,
            habitCounts: {},
            topHabit: null,
            avgEntryLength: 0
        };
        
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateString = this.formatDate(current);
            const entry = this.entries[dateString];
            
            if (entry) {
                stats.totalEntries++;
                if (entry.text) {
                    stats.totalWords += entry.text.split(' ').length;
                }
                
                if (entry.habits) {
                    Object.keys(entry.habits).forEach(habit => {
                        if (entry.habits[habit]) {
                            stats.habitCounts[habit] = (stats.habitCounts[habit] || 0) + 1;
                        }
                    });
                }
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        // Find top habit
        let maxCount = 0;
        Object.keys(stats.habitCounts).forEach(habit => {
            if (stats.habitCounts[habit] > maxCount) {
                maxCount = stats.habitCounts[habit];
                stats.topHabit = { name: habit, count: maxCount };
            }
        });
        
        stats.avgEntryLength = stats.totalEntries > 0 ? 
            Math.round(stats.totalWords / stats.totalEntries) : 0;
        
        return stats;
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
    
    // Entry Management
    goToToday() {
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.renderCurrentView();
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
    
    openDayEntry(date) {
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        
        // Set modal title
        const modalDate = document.getElementById('modalDate');
        if (modalDate) modalDate.textContent = this.formatDateDisplay(date);
        
        // Load existing entry
        const entry = this.entries[dateString] || { text: '', habits: {} };
        const dailyText = document.getElementById('dailyText');
        if (dailyText) dailyText.value = entry.text || '';
        
        this.renderHabits(entry.habits || {});
        const dailyModal = document.getElementById('dailyModal');
        if (dailyModal) dailyModal.classList.remove('hidden');
    }
    
    openEntryView(date) {
        const dateString = this.formatDate(date);
        const entry = this.entries[dateString];
        
        if (!entry) return;
        
        const entryViewDate = document.getElementById('entryViewDate');
        if (entryViewDate) entryViewDate.textContent = `Entry for ${this.formatDateDisplay(date)}`;
        
        const content = document.getElementById('entryViewContent');
        if (!content) return;
        
        content.innerHTML = '';
        
        // Full text
        if (entry.text) {
            const textSection = document.createElement('div');
            textSection.innerHTML = '<h4>Daily Entry</h4>';
            
            const textContent = document.createElement('div');
            textContent.className = 'entry-full-text';
            textContent.textContent = entry.text;
            
            textSection.appendChild(textContent);
            content.appendChild(textSection);
        }
        
        // Habits
        if (entry.habits) {
            const habitsSection = document.createElement('div');
            habitsSection.innerHTML = '<h4>Habits</h4>';
            
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
        
        const entryViewModal = document.getElementById('entryViewModal');
        if (entryViewModal) entryViewModal.classList.remove('hidden');
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
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.autoSave();
            });
            
            const label = document.createElement('label');
            label.className = 'habit-label';
            label.setAttribute('for', `habit-${index}`);
            label.textContent = habit;
            label.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
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
    }
    
    getAllHabits() {
        return [...this.defaultHabits, ...this.customHabits];
    }
    
    autoSave() {
        if (this.selectedDate) {
            this.saveCurrentEntry();
        }
    }
    
    saveCurrentEntry() {
        if (!this.selectedDate) return;
        
        const dateString = this.formatDate(this.selectedDate);
        const dailyText = document.getElementById('dailyText');
        const text = dailyText ? dailyText.value || '' : '';
        
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
    
    saveEntry() {
        this.saveCurrentEntry();
        this.closeModal();
        this.renderCurrentView();
        this.showToast('Entry saved successfully!', 'success');
    }
    
    // Modal Management
    closeModal() {
        const dailyModal = document.getElementById('dailyModal');
        if (dailyModal) dailyModal.classList.add('hidden');
        this.selectedDate = null;
    }
    
    closeEntryViewModal() {
        const entryViewModal = document.getElementById('entryViewModal');
        if (entryViewModal) entryViewModal.classList.add('hidden');
    }
    
    openSettings() {
        console.log('Opening settings modal');
        // Populate settings form
        const githubToken = document.getElementById('githubToken');
        const gistId = document.getElementById('gistId');
        
        if (githubToken) githubToken.value = this.githubSettings.token || '';
        if (gistId) gistId.value = this.githubSettings.gistId || '';
        
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
            console.log('Settings modal opened');
        } else {
            console.error('Settings modal not found');
        }
    }

    closeSettings() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) settingsModal.classList.add('hidden');
    }
    
    openExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) exportModal.classList.remove('hidden');
    }
    
    closeExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) exportModal.classList.add('hidden');
    }
    
    openImportModal() {
        const importModal = document.getElementById('importModal');
        if (importModal) importModal.classList.remove('hidden');
    }
    
    closeImportModal() {
        const importModal = document.getElementById('importModal');
        if (importModal) importModal.classList.add('hidden');
    }
    
    // Export/Import Methods
    exportData(format) {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            exportDate: new Date().toISOString(),
            version: "3.0.0"
        };
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'json') {
            this.downloadFile(
                JSON.stringify(data, null, 2),
                `daily-tracker-export-${timestamp}.json`,
                'application/json'
            );
        } else if (format === 'csv') {
            const csv = this.convertToCSV(data);
            this.downloadFile(
                csv,
                `daily-tracker-export-${timestamp}.csv`,
                'text/csv'
            );
        }
        
        this.closeExportModal();
        this.showToast(`Data exported as ${format.toUpperCase()}!`, 'success');
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
    
    executeImport() {
        const fileInput = document.getElementById('importFile');
        const mode = document.querySelector('input[name="importMode"]:checked')?.value || 'merge';
        
        if (!fileInput || !fileInput.files.length) {
            this.showToast('Please select a file to import.', 'error');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let importedData;
                
                if (file.name.endsWith('.json')) {
                    importedData = JSON.parse(content);
                } else {
                    this.showToast('Only JSON files are supported for import.', 'error');
                    return;
                }
                
                if (mode === 'overwrite') {
                    this.entries = importedData.entries || {};
                    this.customHabits = importedData.customHabits || [];
                    this.habitColors = { ...this.habitColors, ...(importedData.habitColors || {}) };
                    this.goals = importedData.goals || this.getDefaultGoals();
                } else {
                    // Merge mode
                    Object.assign(this.entries, importedData.entries || {});
                    this.customHabits = [...new Set([...this.customHabits, ...(importedData.customHabits || [])])];
                    Object.assign(this.habitColors, importedData.habitColors || {});
                    if (importedData.goals) {
                        Object.assign(this.goals, importedData.goals);
                    }
                }
                
                this.saveData();
                this.renderCurrentView();
                this.renderHabitLegend();
                this.closeImportModal();
                this.showToast('Data imported successfully!', 'success');
                
            } catch (error) {
                this.showToast('Error importing data. Please check the file format.', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
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
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Enhanced Daily Tracker with Goals and Sync...');
    new DailyTracker();
});