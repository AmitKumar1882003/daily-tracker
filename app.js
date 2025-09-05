// Enhanced NEET-PG Daily Activity Tracker with Goals and GitHub Sync

class NEETPGTracker {
    constructor() {
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.selectedDate = null;
        this.currentView = 'weekly';
        this.currentGoalsView = 'weekly';
        
        // NEET-PG specific motivational quotes
        this.motivationalQuotes = [
            "Every MCQ you solve takes you one step closer to your dream specialty! 🎯",
            "Your dedication today determines your rank tomorrow. Keep pushing! 💪",
            "NEET-PG is not about luck, it's about consistent effort and smart study! 📚",
            "Remember: Top rankers aren't born, they're made through daily discipline! ⭐",
            "Each Anki review is an investment in your medical career! 🩺",
            "Success in NEET-PG comes to those who never give up. You've got this! 🚀",
            "Your future patients are counting on your preparation today! ❤️",
            "Mock tests today, dream specialty tomorrow! 🎓",
            "Consistency beats intensity. Show up every day! 🌟",
            "The best doctors are those who never stopped learning. Keep studying! 📖"
        ];
        
        // NEET-PG specific habit colors
        this.habitColors = {
            "Anki Reviews (500+ cards)": "#3B82F6",
            "Pathology MCQs": "#10B981", 
            "Anatomy Revision": "#EF4444",
            "Pharmacology Study": "#8B5CF6",
            "Mock Test": "#06B6D4",
            "Physiology Notes": "#F59E0B",
            "Clinical Subjects": "#EC4899",
            "Gym/Exercise": "#14B8A6",
            "Medical Videos": "#6366F1"
        };
        
        // Available colors for new habits
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4", 
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        
        // NEET-PG focused default habits
        this.defaultHabits = [
            "Anki Reviews (500+ cards)",
            "Pathology MCQs",
            "Anatomy Revision", 
            "Pharmacology Study",
            "Mock Test",
            "Physiology Notes",
            "Clinical Subjects",
            "Gym/Exercise",
            "Medical Videos"
        ];

        // Sync configuration
        this.syncConfig = {
            enabled: false,
            gistId: null,
            githubToken: null,
            lastSync: null,
            autoSyncInterval: 30000, // 30 seconds
            syncInProgress: false
        };

        this.autoSyncTimer = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Enhanced NEET-PG Tracker...');
        this.loadData();
        this.setupEventListeners();
        this.showRandomQuote();
        this.initializeSync();
        // Important: render current view after all setup is complete
        this.renderCurrentView();
    }

    showRandomQuote() {
        const quoteElement = document.getElementById('motivationalQuote');
        if (quoteElement) {
            const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
            quoteElement.textContent = randomQuote;
        }
    }
    
    loadData() {
        // Load from localStorage
        const storedData = localStorage.getItem('neetpgTrackerData');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.entries = data.entries || {};
            this.customHabits = data.customHabits || [];
            this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
            this.goals = data.goals || this.getInitialGoalsData();
            this.syncConfig = { ...this.syncConfig, ...(data.syncConfig || {}) };
        } else {
            // Use provided application data as initial data
            this.entries = {
                "2025-09-05": {
                    "text": "Had an incredibly productive NEET-PG study day! Completed 800 Anki cards focusing on Cardiovascular Pathology with 95% accuracy. Solved 150 MCQs on Pharmacology - scored 85% which is a significant improvement from last week. Spent 3 hours on Anatomy revision covering Upper Limb in detail, made comprehensive notes and diagrams. Watched 4 high-yield medical videos on Marrow covering recent exam patterns. Took a 2-hour mock test and analyzed all mistakes thoroughly. Feeling confident about the preparation strategy and motivated to continue this momentum. Tomorrow planning to focus on Respiratory system pathology and complete pending Physiology topics.",
                    "habits": {
                        "Anki Reviews (500+ cards)": true,
                        "Pathology MCQs": true,
                        "Anatomy Revision": true,
                        "Pharmacology Study": true,
                        "Mock Test": true,
                        "Physiology Notes": false,
                        "Clinical Subjects": true,
                        "Gym/Exercise": false,
                        "Medical Videos": true
                    },
                    "timestamp": "2025-09-05T20:31:00.000Z"
                }
            };

            this.goals = this.getInitialGoalsData();
            this.customHabits = [];
            this.saveData();
        }
    }

    getInitialGoalsData() {
        return {
            weekly: {
                "2025-W36": [
                    {
                        id: "w1",
                        text: "Complete Pathology: Cardiovascular System (500 Anki cards)",
                        completed: false,
                        dateAdded: "2025-09-05"
                    },
                    {
                        id: "w2", 
                        text: "Solve 200 MCQs on Pharmacology",
                        completed: true,
                        dateAdded: "2025-09-02"
                    },
                    {
                        id: "w3",
                        text: "Gym 5 days (strength + cardio for study stamina)",
                        completed: false,
                        dateAdded: "2025-09-02"
                    },
                    {
                        id: "w4",
                        text: "Complete Anatomy revision: Upper Limb",
                        completed: false,
                        dateAdded: "2025-09-03"
                    },
                    {
                        id: "w5",
                        text: "Take 2 mock tests and analyze mistakes",
                        completed: false,
                        dateAdded: "2025-09-04"
                    }
                ]
            },
            monthly: {
                "2025-09": [
                    {
                        id: "m1",
                        text: "Master Pathology: Complete CVS, Respiratory, GIT systems",
                        completed: false,
                        dateAdded: "2025-09-01"
                    },
                    {
                        id: "m2",
                        text: "Solve 2000+ MCQs across all subjects",
                        completed: false,
                        dateAdded: "2025-09-01"
                    },
                    {
                        id: "m3",
                        text: "Take 8 full-length mock tests",
                        completed: false,
                        dateAdded: "2025-09-01"
                    },
                    {
                        id: "m4",
                        text: "Maintain 95%+ Anki review accuracy",
                        completed: false,
                        dateAdded: "2025-09-01"
                    },
                    {
                        id: "m5",
                        text: "Gym 25 days for study stamina and stress relief",
                        completed: false,
                        dateAdded: "2025-09-01"
                    }
                ]
            },
            yearly: {
                "2025": [
                    {
                        id: "y1",
                        text: "Score 700+ in NEET-PG 2025 (target: top 1000 rank)",
                        completed: false,
                        dateAdded: "2025-01-01"
                    },
                    {
                        id: "y2",
                        text: "Master all high-yield topics with 95%+ accuracy",
                        completed: false,
                        dateAdded: "2025-01-01"
                    },
                    {
                        id: "y3",
                        text: "Complete 50,000+ Anki reviews with retention >90%",
                        completed: false,
                        dateAdded: "2025-01-01"
                    },
                    {
                        id: "y4",
                        text: "Take 100+ mock tests and analyze all mistakes",
                        completed: false,
                        dateAdded: "2025-01-01"
                    },
                    {
                        id: "y5",
                        text: "Maintain fitness: 300+ gym sessions for study stamina",
                        completed: false,
                        dateAdded: "2025-01-01"
                    },
                    {
                        id: "y6",
                        text: "Secure admission in dream specialty/college",
                        completed: false,
                        dateAdded: "2025-01-01"
                    }
                ]
            }
        };
    }
    
    saveData() {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            syncConfig: this.syncConfig,
            version: "3.0.0",
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('neetpgTrackerData', JSON.stringify(data));
        
        // Trigger sync if enabled
        if (this.syncConfig.enabled && !this.syncConfig.syncInProgress) {
            this.syncToGist();
        }
    }

    // GitHub Gist Sync Methods
    initializeSync() {
        this.updateSyncStatus();
        
        // Show or hide sync setup card based on sync status
        this.updateSyncSetupVisibility();

        // Start auto-sync if enabled
        if (this.syncConfig.enabled) {
            this.startAutoSync();
        }
    }

    updateSyncSetupVisibility() {
        const syncSetupCard = document.getElementById('syncSetupCard');
        if (syncSetupCard) {
            if (this.syncConfig.enabled) {
                syncSetupCard.classList.add('hidden');
            } else {
                syncSetupCard.classList.remove('hidden');
            }
        }
    }

    startAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
        }
        
        this.autoSyncTimer = setInterval(() => {
            if (this.syncConfig.enabled && !this.syncConfig.syncInProgress) {
                this.syncToGist();
            }
        }, this.syncConfig.autoSyncInterval);
    }

    stopAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
    }

    updateSyncStatus(status = 'offline', message = 'Offline') {
        const indicator = document.getElementById('syncIndicator');
        const text = document.getElementById('syncText');
        
        if (indicator && text) {
            // Remove all status classes
            indicator.className = 'sync-indicator';
            // Add the specific status class
            indicator.classList.add(status);
            text.textContent = message;
        }
    }

    async testGitHubConnection(token) {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                return { success: true, user };
            } else {
                return { success: false, error: 'Invalid token or insufficient permissions' };
            }
        } catch (error) {
            return { success: false, error: 'Network error: ' + error.message };
        }
    }

    async createGist(data) {
        const gistData = {
            description: "NEET-PG Tracker Data - Private Backup",
            public: false,
            files: {
                "neetpg-tracker-data.json": {
                    content: JSON.stringify(data, null, 2)
                }
            }
        };

        try {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.syncConfig.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                const gist = await response.json();
                return { success: true, gist };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error: ' + error.message };
        }
    }

    async updateGist(gistId, data) {
        const gistData = {
            files: {
                "neetpg-tracker-data.json": {
                    content: JSON.stringify(data, null, 2)
                }
            }
        };

        try {
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.syncConfig.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error: ' + error.message };
        }
    }

    async syncToGist() {
        if (this.syncConfig.syncInProgress) return;
        
        this.syncConfig.syncInProgress = true;
        this.updateSyncStatus('syncing', 'Syncing...');

        try {
            const dataToSync = {
                entries: this.entries,
                customHabits: this.customHabits,
                habitColors: this.habitColors,
                goals: this.goals,
                version: "3.0.0",
                lastUpdated: new Date().toISOString()
            };

            let result;
            if (this.syncConfig.gistId) {
                // Update existing gist
                result = await this.updateGist(this.syncConfig.gistId, dataToSync);
            } else {
                // Create new gist
                result = await this.createGist(dataToSync);
                if (result.success) {
                    this.syncConfig.gistId = result.gist.id;
                }
            }

            if (result.success) {
                this.syncConfig.lastSync = new Date().toISOString();
                this.updateSyncStatus('synced', `Synced ${this.formatSyncTime(this.syncConfig.lastSync)}`);
                
                // Update localStorage with sync config
                const localData = JSON.parse(localStorage.getItem('neetpgTrackerData') || '{}');
                localData.syncConfig = this.syncConfig;
                localStorage.setItem('neetpgTrackerData', JSON.stringify(localData));
            } else {
                this.updateSyncStatus('error', 'Sync failed');
                console.error('Sync failed:', result.error);
            }
        } catch (error) {
            this.updateSyncStatus('error', 'Sync failed');
            console.error('Sync error:', error);
        } finally {
            this.syncConfig.syncInProgress = false;
        }
    }

    formatSyncTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    }

    // Goals Management Methods
    getCurrentWeekKey() {
        const year = this.currentDate.getFullYear();
        const week = this.getWeekNumber(this.currentDate);
        return `${year}-W${week.toString().padStart(2, '0')}`;
    }

    getCurrentMonthKey() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        return `${year}-${month.toString().padStart(2, '0')}`;
    }

    getCurrentYearKey() {
        return this.currentDate.getFullYear().toString();
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    addGoal(period) {
        const input = document.getElementById(`new${period.charAt(0).toUpperCase() + period.slice(1)}Goal`);
        if (!input) return;

        const goalText = input.value.trim();
        if (!goalText) return;

        let key;
        switch(period) {
            case 'weekly':
                key = this.getCurrentWeekKey();
                break;
            case 'monthly':
                key = this.getCurrentMonthKey();
                break;
            case 'yearly':
                key = this.getCurrentYearKey();
                break;
        }

        if (!this.goals[period][key]) {
            this.goals[period][key] = [];
        }

        const newGoal = {
            id: Date.now().toString(),
            text: goalText,
            completed: false,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        this.goals[period][key].push(newGoal);
        input.value = '';
        this.saveData();
        this.renderGoals();
        this.showToast(`${period.charAt(0).toUpperCase() + period.slice(1)} goal added!`, 'success');
    }

    toggleGoal(period, key, goalId) {
        const goals = this.goals[period][key];
        if (!goals) return;

        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveData();
            this.renderGoals();
        }
    }

    removeGoal(period, key, goalId) {
        const goals = this.goals[period][key];
        if (!goals) return;

        this.goals[period][key] = goals.filter(g => g.id !== goalId);
        this.saveData();
        this.renderGoals();
        this.showToast('Goal removed!', 'success');
    }

    calculateProgress(goals) {
        if (!goals || goals.length === 0) return { completed: 0, total: 0, percentage: 0 };
        
        const completed = goals.filter(g => g.completed).length;
        const total = goals.length;
        const percentage = Math.round((completed / total) * 100);
        
        return { completed, total, percentage };
    }
    
    setupEventListeners() {
        // Tab navigation
        document.getElementById('weeklyTab')?.addEventListener('click', () => this.switchView('weekly'));
        document.getElementById('monthlyTab')?.addEventListener('click', () => this.switchView('monthly'));
        document.getElementById('goalsTab')?.addEventListener('click', () => this.switchView('goals'));
        
        // Goals tab navigation
        document.getElementById('weeklyGoalsTab')?.addEventListener('click', () => this.switchGoalsView('weekly'));
        document.getElementById('monthlyGoalsTab')?.addEventListener('click', () => this.switchGoalsView('monthly'));
        document.getElementById('yearlyGoalsTab')?.addEventListener('click', () => this.switchGoalsView('yearly'));
        
        // Navigation controls
        document.getElementById('prevWeek')?.addEventListener('click', () => this.navigateWeek(-1));
        document.getElementById('nextWeek')?.addEventListener('click', () => this.navigateWeek(1));
        document.getElementById('prevMonth')?.addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.navigateMonth(1));
        document.getElementById('todayBtn')?.addEventListener('click', () => this.goToToday());
        
        // Sync controls
        document.getElementById('setupSync')?.addEventListener('click', () => this.openSyncSetupModal());
        document.getElementById('manualSync')?.addEventListener('click', () => this.syncToGist());
        document.getElementById('testConnection')?.addEventListener('click', () => this.testConnection());
        document.getElementById('enableSync')?.addEventListener('click', () => this.enableSync());
        document.getElementById('closeSyncSetup')?.addEventListener('click', () => this.closeSyncSetupModal());
        
        // Goals
        document.getElementById('addWeeklyGoal')?.addEventListener('click', () => this.addGoal('weekly'));
        document.getElementById('addMonthlyGoal')?.addEventListener('click', () => this.addGoal('monthly'));
        document.getElementById('addYearlyGoal')?.addEventListener('click', () => this.addGoal('yearly'));
        
        // Goal input enter key
        document.getElementById('newWeeklyGoal')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGoal('weekly');
        });
        document.getElementById('newMonthlyGoal')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGoal('monthly');
        });
        document.getElementById('newYearlyGoal')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGoal('yearly');
        });
        
        // Export/Import
        document.getElementById('exportBtn')?.addEventListener('click', () => this.openExportModal());
        document.getElementById('importBtn')?.addEventListener('click', () => this.openImportModal());
        
        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('closeEntryView')?.addEventListener('click', () => this.closeEntryViewModal());
        document.getElementById('closeExportModal')?.addEventListener('click', () => this.closeExportModal());
        document.getElementById('closeImportModal')?.addEventListener('click', () => this.closeImportModal());
        document.getElementById('saveEntry')?.addEventListener('click', () => this.saveEntry());
        
        // Export buttons
        document.getElementById('exportJSON')?.addEventListener('click', () => this.exportData('json'));
        document.getElementById('exportCSV')?.addEventListener('click', () => this.exportData('csv'));
        
        // Import
        document.getElementById('executeImport')?.addEventListener('click', () => this.executeImport());
        
        // Habit management
        document.getElementById('addHabit')?.addEventListener('click', () => this.addCustomHabit());
        document.getElementById('newHabit')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomHabit();
        });
        
        // Auto-save
        document.getElementById('dailyText')?.addEventListener('input', () => this.autoSave());
        
        // Modal background clicks
        document.getElementById('dailyModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'dailyModal') this.closeModal();
        });
        document.getElementById('entryViewModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'entryViewModal') this.closeEntryViewModal();
        });
        document.getElementById('exportModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') this.closeExportModal();
        });
        document.getElementById('importModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'importModal') this.closeImportModal();
        });
        document.getElementById('syncSetupModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'syncSetupModal') this.closeSyncSetupModal();
        });
    }
    
    switchView(view) {
        console.log('Switching to view:', view);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('tab-btn--active'));
        const activeTab = document.getElementById(`${view}Tab`);
        if (activeTab) {
            activeTab.classList.add('tab-btn--active');
        }
        
        // Hide all main views
        document.querySelectorAll('.main-view').forEach(viewEl => {
            viewEl.classList.add('hidden');
        });
        
        // Show selected view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        
        this.currentView = view;
        this.renderCurrentView();
    }

    switchGoalsView(view) {
        console.log('Switching to goals view:', view);
        
        // Update active goals tab
        document.querySelectorAll('.goals-tab-btn').forEach(btn => btn.classList.remove('goals-tab-btn--active'));
        const activeTab = document.getElementById(`${view}GoalsTab`);
        if (activeTab) {
            activeTab.classList.add('goals-tab-btn--active');
        }
        
        // Hide all goal sections
        document.querySelectorAll('.goals-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${view}GoalsSection`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        this.currentGoalsView = view;
        this.renderGoals();
    }
    
    renderCurrentView() {
        console.log('Rendering current view:', this.currentView);
        
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
                this.updateSyncSetupVisibility();
                break;
        }
    }

    renderGoals() {
        console.log('Rendering goals, current goals view:', this.currentGoalsView);
        this.renderWeeklyGoals();
        this.renderMonthlyGoals();
        this.renderYearlyGoals();
    }

    renderWeeklyGoals() {
        const key = this.getCurrentWeekKey();
        const goals = this.goals.weekly[key] || [];
        const progress = this.calculateProgress(goals);

        // Update progress
        const progressBar = document.getElementById('weeklyProgress');
        const progressText = document.getElementById('weeklyProgressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress.percentage}%`;
            progressText.textContent = `${progress.completed}/${progress.total} completed (${progress.percentage}%)`;
        }

        // Render goals list
        const goalsList = document.getElementById('weeklyGoalsList');
        if (!goalsList) return;

        goalsList.innerHTML = '';
        goals.forEach(goal => {
            const goalElement = this.createGoalElement(goal, 'weekly', key);
            goalsList.appendChild(goalElement);
        });
    }

    renderMonthlyGoals() {
        const key = this.getCurrentMonthKey();
        const goals = this.goals.monthly[key] || [];
        const progress = this.calculateProgress(goals);

        // Update progress
        const progressBar = document.getElementById('monthlyProgress');
        const progressText = document.getElementById('monthlyProgressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress.percentage}%`;
            progressText.textContent = `${progress.completed}/${progress.total} completed (${progress.percentage}%)`;
        }

        // Render goals list
        const goalsList = document.getElementById('monthlyGoalsList');
        if (!goalsList) return;

        goalsList.innerHTML = '';
        goals.forEach(goal => {
            const goalElement = this.createGoalElement(goal, 'monthly', key);
            goalsList.appendChild(goalElement);
        });
    }

    renderYearlyGoals() {
        const key = this.getCurrentYearKey();
        const goals = this.goals.yearly[key] || [];
        const progress = this.calculateProgress(goals);

        // Update progress
        const progressBar = document.getElementById('yearlyProgress');
        const progressText = document.getElementById('yearlyProgressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress.percentage}%`;
            progressText.textContent = `${progress.completed}/${progress.total} completed (${progress.percentage}%)`;
        }

        // Render goals list
        const goalsList = document.getElementById('yearlyGoalsList');
        if (!goalsList) return;

        goalsList.innerHTML = '';
        goals.forEach(goal => {
            const goalElement = this.createGoalElement(goal, 'yearly', key);
            goalsList.appendChild(goalElement);
        });
    }

    createGoalElement(goal, period, key) {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'goal-checkbox';
        checkbox.checked = goal.completed;
        checkbox.addEventListener('change', () => this.toggleGoal(period, key, goal.id));

        const goalContent = document.createElement('div');
        goalContent.className = 'goal-content';

        const goalText = document.createElement('div');
        goalText.className = 'goal-text';
        goalText.textContent = goal.text;

        const goalDate = document.createElement('div');
        goalDate.className = 'goal-date';
        goalDate.textContent = `Added: ${new Date(goal.dateAdded).toLocaleDateString()}`;

        goalContent.appendChild(goalText);
        goalContent.appendChild(goalDate);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'goal-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this goal?')) {
                this.removeGoal(period, key, goal.id);
            }
        });

        goalItem.appendChild(checkbox);
        goalItem.appendChild(goalContent);
        goalItem.appendChild(removeBtn);

        return goalItem;
    }

    // Sync Setup Methods
    openSyncSetupModal() {
        document.getElementById('syncSetupModal')?.classList.remove('hidden');
    }

    closeSyncSetupModal() {
        document.getElementById('syncSetupModal')?.classList.add('hidden');
    }

    async testConnection() {
        const tokenInput = document.getElementById('githubToken');
        const resultDiv = document.getElementById('syncTestResult');
        
        if (!tokenInput || !resultDiv) return;

        const token = tokenInput.value.trim();
        if (!token) {
            this.showSyncTestResult('Please enter a GitHub token', 'error');
            return;
        }

        this.showSyncTestResult('Testing connection...', 'info');
        
        const result = await this.testGitHubConnection(token);
        
        if (result.success) {
            this.showSyncTestResult(`✅ Connected as ${result.user.login}`, 'success');
        } else {
            this.showSyncTestResult(`❌ ${result.error}`, 'error');
        }
    }

    showSyncTestResult(message, type) {
        const resultDiv = document.getElementById('syncTestResult');
        if (!resultDiv) return;

        resultDiv.textContent = message;
        resultDiv.className = `sync-test-result ${type}`;
        resultDiv.classList.remove('hidden');
    }

    async enableSync() {
        const tokenInput = document.getElementById('githubToken');
        if (!tokenInput) return;

        const token = tokenInput.value.trim();
        if (!token) {
            this.showToast('Please enter a GitHub token', 'error');
            return;
        }

        // Test connection first
        const testResult = await this.testGitHubConnection(token);
        if (!testResult.success) {
            this.showToast(`Connection failed: ${testResult.error}`, 'error');
            return;
        }

        // Enable sync
        this.syncConfig.enabled = true;
        this.syncConfig.githubToken = token;
        this.saveData();

        // Update sync setup visibility and close modal
        this.updateSyncSetupVisibility();
        this.closeSyncSetupModal();

        // Start auto-sync and perform initial sync
        this.startAutoSync();
        this.updateSyncStatus('syncing', 'Initial sync...');
        await this.syncToGist();

        this.showToast('GitHub sync enabled successfully! 🎉', 'success');
    }

    // Weekly Calendar Methods (same as before but updated for NEET-PG)
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
            preview.textContent = text.length > 100 ? text.substring(0, 100) + '...' : text;
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
        dayElement.addEventListener('click', () => this.openDayEntry(date));
        
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
        dayElement.addEventListener('click', () => this.openDayEntry(date));
        
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
            <span class="summary-label">Total Study Days</span>
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
        document.getElementById('modalDate').textContent = this.formatDateDisplay(date);
        
        // Load existing entry
        const entry = this.entries[dateString] || { text: '', habits: {} };
        document.getElementById('dailyText').value = entry.text || '';
        
        this.renderHabits(entry.habits || {});
        document.getElementById('dailyModal').classList.remove('hidden');
    }
    
    openEntryView(date) {
        const dateString = this.formatDate(date);
        const entry = this.entries[dateString];
        
        if (!entry) return;
        
        document.getElementById('entryViewDate').textContent = `NEET-PG Entry for ${this.formatDateDisplay(date)}`;
        
        const content = document.getElementById('entryViewContent');
        content.innerHTML = '';
        
        // Full text
        if (entry.text) {
            const textSection = document.createElement('div');
            textSection.innerHTML = '<h4>Daily NEET-PG Study Log</h4>';
            
            const textContent = document.createElement('div');
            textContent.className = 'entry-full-text';
            textContent.textContent = entry.text;
            
            textSection.appendChild(textContent);
            content.appendChild(textSection);
        }
        
        // Habits
        if (entry.habits) {
            const habitsSection = document.createElement('div');
            habitsSection.innerHTML = '<h4>NEET-PG Habits</h4>';
            
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
        
        document.getElementById('entryViewModal').classList.remove('hidden');
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
            checkbox.addEventListener('change', () => this.autoSave());
            
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
        const text = document.getElementById('dailyText')?.value || '';
        
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
        this.showToast('NEET-PG entry saved successfully! 🎯', 'success');
    }
    
    // Modal Management
    closeModal() {
        document.getElementById('dailyModal')?.classList.add('hidden');
        this.selectedDate = null;
    }
    
    closeEntryViewModal() {
        document.getElementById('entryViewModal')?.classList.add('hidden');
    }
    
    openExportModal() {
        document.getElementById('exportModal')?.classList.remove('hidden');
    }
    
    closeExportModal() {
        document.getElementById('exportModal')?.classList.add('hidden');
    }
    
    openImportModal() {
        document.getElementById('importModal')?.classList.remove('hidden');
    }
    
    closeImportModal() {
        document.getElementById('importModal')?.classList.add('hidden');
    }
    
    // Export/Import Methods
    exportData(format) {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            syncConfig: { ...this.syncConfig, githubToken: null }, // Don't export token
            exportDate: new Date().toISOString(),
            version: "3.0.0"
        };
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'json') {
            this.downloadFile(
                JSON.stringify(data, null, 2),
                `neetpg-tracker-export-${timestamp}.json`,
                'application/json'
            );
        } else if (format === 'csv') {
            const csv = this.convertToCSV(data);
            this.downloadFile(
                csv,
                `neetpg-tracker-export-${timestamp}.csv`,
                'text/csv'
            );
        }
        
        this.closeExportModal();
        this.showToast(`NEET-PG data exported as ${format.toUpperCase()}! 📊`, 'success');
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
        
        if (!fileInput.files.length) {
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
                    this.goals = importedData.goals || { weekly: {}, monthly: {}, yearly: {} };
                } else {
                    // Merge mode
                    Object.assign(this.entries, importedData.entries || {});
                    this.customHabits = [...new Set([...this.customHabits, ...(importedData.customHabits || [])])];
                    Object.assign(this.habitColors, importedData.habitColors || {});
                    if (importedData.goals) {
                        Object.assign(this.goals.weekly, importedData.goals.weekly || {});
                        Object.assign(this.goals.monthly, importedData.goals.monthly || {});
                        Object.assign(this.goals.yearly, importedData.goals.yearly || {});
                    }
                }
                
                this.saveData();
                this.renderCurrentView();
                this.renderHabitLegend();
                this.closeImportModal();
                this.showToast('NEET-PG data imported successfully! 🎉', 'success');
                
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
    console.log('DOM loaded, initializing Enhanced NEET-PG Tracker...');
    new NEETPGTracker();
});