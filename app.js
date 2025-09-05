// ULTIMATE Daily Activity Tracker for Amit - FIXED VERSION
// Version 3.1 - Bug Fixes Applied

class UltimateDailyTracker {
    constructor() {
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.currentYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.currentView = 'weekly';
        this.currentGoalsView = 'weekly';
        
        // User profile
        this.userName = "Amit";
        
        // Predefined habit colors
        this.habitColors = {
            "Anki Reviews": "#3B82F6",
            "Exercise": "#10B981", 
            "Read": "#EF4444",
            "Meditate": "#8B5CF6",
            "Drink Water (8 glasses)": "#06B6D4",
            "Study": "#F59E0B",
            "Journal Writing": "#EC4899"
        };
        
        // Available colors for new habits
        this.availableColors = [
            "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4", 
            "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
            "#84CC16", "#A855F7", "#E11D48", "#0EA5E9", "#65A30D"
        ];
        
        // Default habits
        this.defaultHabits = [
            "Anki Reviews", "Exercise", "Read", "Meditate", 
            "Drink Water (8 glasses)", "Study", "Journal Writing"
        ];
        
        // Built-in motivational quotes (60+ quotes)
        this.motivationalQuotes = [
            { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "productivity" },
            { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", category: "habits" },
            { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci", category: "learning" },
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
            { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", category: "habits" },
            { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", category: "learning" },
            { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "growth" },
            { quote: "Progress, not perfection.", author: "Unknown", category: "growth" },
            { quote: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "productivity" },
            { quote: "Excellence is never an accident. It is always the result of high intention.", author: "Aristotle", category: "success" },
            { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
            { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "productivity" },
            { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "growth" },
            { quote: "Life is what happens while you're making other plans.", author: "John Lennon", category: "mindfulness" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
            { quote: "Success is not final, failure is not fatal: courage to continue counts.", author: "Winston Churchill", category: "persistence" },
            { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "productivity" },
            { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "growth" },
            { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
            { quote: "You are destined to become the person you decide to be.", author: "Ralph Waldo Emerson", category: "growth" },
            { quote: "Do something today that your future self will thank you for.", author: "Sean Croxton", category: "habits" },
            { quote: "Your limitation—it's only your imagination.", author: "Unknown", category: "mindset" },
            { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivation" },
            { quote: "Great things never come from comfort zones.", author: "Unknown", category: "growth" },
            { quote: "Dream it. Wish it. Do it.", author: "Unknown", category: "dreams" },
            { quote: "Success doesn't just find you. You have to go out and get it.", author: "Unknown", category: "success" },
            { quote: "The harder you work, the greater you'll feel when you achieve it.", author: "Unknown", category: "work" },
            { quote: "Dream bigger. Do bigger.", author: "Unknown", category: "dreams" },
            { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", category: "persistence" },
            { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown", category: "habits" },
            { quote: "Little things make big days.", author: "Unknown", category: "habits" },
            { quote: "Hard does not mean impossible.", author: "Unknown", category: "persistence" },
            { quote: "Don't wait for opportunity. Create it.", author: "Unknown", category: "productivity" },
            { quote: "Discover your strengths through challenges.", author: "Unknown", category: "growth" },
            { quote: "Focus on goals, not obstacles.", author: "Unknown", category: "success" },
            { quote: "Dream it. Believe it. Build it.", author: "Unknown", category: "dreams" },
            { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "productivity" },
            { quote: "A year from now you may wish you had started today.", author: "Karen Lamb", category: "motivation" },
            { quote: "You don't have to be great to get started, but you have to get started to be great.", author: "Les Brown", category: "productivity" },
            { quote: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson", category: "excellence" },
            { quote: "Champions keep playing until they get it right.", author: "Billie Jean King", category: "persistence" },
            { quote: "The expert in anything was once a beginner.", author: "Helen Hayes", category: "learning" },
            { quote: "Every master was once a disaster.", author: "T. Harv Eker", category: "learning" },
            { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss", category: "productivity" },
            { quote: "You are what you do, not what you say you'll do.", author: "Carl Jung", category: "action" },
            { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "persistence" },
            { quote: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh", category: "belief" },
            { quote: "Your only limit is your mind.", author: "Unknown", category: "mindset" },
            { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "authenticity" },
            { quote: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "change" },
            { quote: "To live is the rarest thing in the world. Most people just exist.", author: "Oscar Wilde", category: "life" },
            { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "persistence" },
            { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "courage" },
            { quote: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", category: "mindset" },
            { quote: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart", category: "action" }
        ];
        
        // Auto-save timer
        this.autoSaveTimer = null;
        this.lastSaveTime = null;
        
        // Sync configuration
        this.syncConfig = {
            enabled: false,
            gistId: null,
            lastSync: null,
            githubToken: null,
            autoSyncInterval: 30000 // 30 seconds
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing ULTIMATE Daily Tracker for Amit...');
        this.loadData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.displayMotivationalQuote();
        this.renderCurrentView();
        this.setupGoalsSelectors();
        this.startAutoSync();
        this.updateSyncStatus();
    }
    
    loadData() {
        const storedData = localStorage.getItem('ultimateDailyTrackerData');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.entries = data.entries || {};
            this.customHabits = data.customHabits || [];
            this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
            this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
            this.syncConfig = { ...this.syncConfig, ...(data.syncConfig || {}) };
        } else {
            // Use provided application data as initial data
            this.entries = {
                "2025-09-05": {
                    "text": "Had an incredibly productive day working on the new web development project. Made excellent progress on the database design and successfully fixed several critical bugs that were blocking the team. The morning team meeting went very well and we discussed the next sprint goals and timeline. Spent 4 hours on JavaScript practice and completed 8 algorithm challenges on LeetCode, focusing on array manipulation and string processing problems. Also reviewed React concepts in depth and built a small weather component from scratch using hooks and context API. Read two chapters from 'Clean Code' by Robert Martin and took detailed notes on writing maintainable functions. The concepts around single responsibility principle really clicked today. Planning to continue with the authentication module tomorrow and start the user interface design. Feeling very motivated about the progress and the momentum I'm building.",
                    "habits": { "Anki Reviews": true, "Exercise": false, "Read": true, "Meditate": true, "Drink Water (8 glasses)": true, "Study": true, "Journal Writing": true },
                    "timestamp": "2025-09-05T20:31:00.000Z"
                },
                "2025-09-04": {
                    "text": "Focused entirely on learning JavaScript fundamentals today. Practiced coding for 5 hours, covering closures, promises, async/await, and event loops. The asynchronous programming concepts are starting to make sense finally. Spent significant time reviewing algorithms and data structures - particularly focused on binary trees, graph traversal, and dynamic programming approaches. Completed 12 coding challenges on LeetCode and HackerRank, felt much more confident with recursion and problem-solving patterns. Read three chapters from 'You Don't Know JS' series and took comprehensive notes. Also watched several YouTube tutorials on modern JavaScript features and ES6+ syntax.",
                    "habits": { "Anki Reviews": true, "Exercise": true, "Read": false, "Meditate": false, "Drink Water (8 glasses)": false, "Study": true, "Journal Writing": true },
                    "timestamp": "2025-09-04T22:15:00.000Z"
                },
                "2025-09-03": {
                    "text": "Started the day with an intensive study session on React hooks and state management patterns. Finally understood useEffect dependencies, custom hooks, and context API properly after struggling with these concepts for weeks. Built a comprehensive weather application to practice API integration and state management patterns. The project helped solidify my understanding of component lifecycle and data flow. Attended a 3-hour online workshop on modern JavaScript frameworks and learned about performance optimization techniques. Evening was spent reading about system design principles and scalability patterns.",
                    "habits": { "Anki Reviews": true, "Exercise": true, "Read": true, "Meditate": true, "Drink Water (8 glasses)": true, "Study": true, "Journal Writing": false },
                    "timestamp": "2025-09-03T21:45:00.000Z"
                },
                "2025-09-02": {
                    "text": "Deep dive into backend development today. Worked with Node.js and Express to build REST APIs from scratch. Learned about middleware functions, authentication strategies, and database integration patterns. Spent considerable time setting up MongoDB and practicing CRUD operations with proper error handling. Also studied about API security, JWT tokens, password hashing with bcrypt, and input validation. Built a small blog API as practice project with user authentication and post management.",
                    "habits": { "Anki Reviews": true, "Exercise": false, "Read": true, "Meditate": true, "Drink Water (8 glasses)": false, "Study": true, "Journal Writing": true },
                    "timestamp": "2025-09-02T23:30:00.000Z"
                }
            };

            this.goals = {
                weekly: {
                    "2025-W36": {
                        title: "Week of Sep 2-8, 2025",
                        tasks: [
                            { id: "w1", text: "Complete JavaScript module on functions and closures", completed: false },
                            { id: "w2", text: "Read 2 chapters of Clean Code book", completed: true },
                            { id: "w3", text: "Build weather app project", completed: false },
                            { id: "w4", text: "Maintain Anki streak (7/7 days)", completed: false },
                            { id: "w5", text: "Exercise 5 times this week", completed: false }
                        ]
                    }
                },
                monthly: {
                    "2025-09": {
                        title: "September 2025 Goals",
                        tasks: [
                            { id: "m1", text: "Complete full JavaScript course with projects", completed: false },
                            { id: "m2", text: "Read 4 technical books cover to cover", completed: false },
                            { id: "m3", text: "Build 2 complete web applications", completed: false },
                            { id: "m4", text: "Maintain daily Anki reviews (30/30 days)", completed: false },
                            { id: "m5", text: "Exercise 20 days this month", completed: false }
                        ]
                    }
                },
                yearly: {
                    "2025": {
                        title: "2025 Annual Goals",
                        tasks: [
                            { id: "y1", text: "Master full-stack web development", completed: false },
                            { id: "y2", text: "Read 50 books (technical and personal development)", completed: false },
                            { id: "y3", text: "Build and deploy 10 complete projects", completed: false },
                            { id: "y4", text: "Learn Spanish to conversational level", completed: false },
                            { id: "y5", text: "Land first developer job", completed: false },
                            { id: "y6", text: "Maintain consistent daily habits (80%+ success rate)", completed: false }
                        ]
                    }
                }
            };

            this.customHabits = [];
            this.saveData();
        }
    }
    
    saveData() {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            syncConfig: this.syncConfig,
            version: "3.1.0",
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('ultimateDailyTrackerData', JSON.stringify(data));
        this.lastSaveTime = new Date();
        this.updateAutoSaveStatus();
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab navigation - FIXED: Added null checks and proper event binding
        const weeklyTab = document.getElementById('weeklyTab');
        const monthlyTab = document.getElementById('monthlyTab');
        const yearlyTab = document.getElementById('yearlyTab');
        const goalsTab = document.getElementById('goalsTab');
        
        if (weeklyTab) weeklyTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            console.log('Weekly tab clicked');
            this.switchView('weekly'); 
        });
        if (monthlyTab) monthlyTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchView('monthly'); 
        });
        if (yearlyTab) yearlyTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchView('yearly'); 
        });
        if (goalsTab) goalsTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchView('goals'); 
        });
        
        // Goals navigation - FIXED
        const weeklyGoalsTab = document.getElementById('weeklyGoalsTab');
        const monthlyGoalsTab = document.getElementById('monthlyGoalsTab');
        const yearlyGoalsTab = document.getElementById('yearlyGoalsTab');
        
        if (weeklyGoalsTab) weeklyGoalsTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchGoalsView('weekly'); 
        });
        if (monthlyGoalsTab) monthlyGoalsTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchGoalsView('monthly'); 
        });
        if (yearlyGoalsTab) yearlyGoalsTab.addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.switchGoalsView('yearly'); 
        });
        
        // Navigation controls
        const prevWeek = document.getElementById('prevWeek');
        const nextWeek = document.getElementById('nextWeek');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const prevYear = document.getElementById('prevYear');
        const nextYear = document.getElementById('nextYear');
        const todayBtn = document.getElementById('todayBtn');
        
        if (prevWeek) prevWeek.addEventListener('click', () => this.navigateWeek(-1));
        if (nextWeek) nextWeek.addEventListener('click', () => this.navigateWeek(1));
        if (prevMonth) prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        if (nextMonth) nextMonth.addEventListener('click', () => this.navigateMonth(1));
        if (prevYear) prevYear.addEventListener('click', () => this.navigateYear(-1));
        if (nextYear) nextYear.addEventListener('click', () => this.navigateYear(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
        
        // Header controls
        const jumpToBtn = document.getElementById('jumpToBtn');
        const exportBtn = document.getElementById('exportBtn');
        const helpBtn = document.getElementById('helpBtn');
        const syncBtn = document.getElementById('syncBtn');
        
        if (jumpToBtn) jumpToBtn.addEventListener('click', () => this.openJumpToModal());
        if (exportBtn) exportBtn.addEventListener('click', () => this.openExportModal());
        if (helpBtn) helpBtn.addEventListener('click', () => this.openHelpModal());
        if (syncBtn) syncBtn.addEventListener('click', () => this.initializeSync());
        
        // Modal controls
        const closeModal = document.getElementById('closeModal');
        const closeEntryView = document.getElementById('closeEntryView');
        const closeExportModal = document.getElementById('closeExportModal');
        const closeSyncSetup = document.getElementById('closeSyncSetup');
        const closeJumpTo = document.getElementById('closeJumpTo');
        const closeHelp = document.getElementById('closeHelp');
        const saveEntry = document.getElementById('saveEntry');
        
        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (closeEntryView) closeEntryView.addEventListener('click', () => this.closeEntryViewModal());
        if (closeExportModal) closeExportModal.addEventListener('click', () => this.closeExportModal());
        if (closeSyncSetup) closeSyncSetup.addEventListener('click', () => this.closeSyncSetupModal());
        if (closeJumpTo) closeJumpTo.addEventListener('click', () => this.closeJumpToModal());
        if (closeHelp) closeHelp.addEventListener('click', () => this.closeHelpModal());
        if (saveEntry) saveEntry.addEventListener('click', () => this.saveEntry());
        
        // Entry management
        const quickSave = document.getElementById('quickSave');
        if (quickSave) quickSave.addEventListener('click', () => this.quickSave());
        
        // Export buttons
        const exportJSON = document.getElementById('exportJSON');
        const exportCSV = document.getElementById('exportCSV');
        if (exportJSON) exportJSON.addEventListener('click', () => this.exportData('json'));
        if (exportCSV) exportCSV.addEventListener('click', () => this.exportData('csv'));
        
        // Sync setup
        const testConnection = document.getElementById('testConnection');
        const enableSync = document.getElementById('enableSync');
        if (testConnection) testConnection.addEventListener('click', () => this.testGitHubConnection());
        if (enableSync) enableSync.addEventListener('click', () => this.enableSync());
        
        // Jump to functionality
        const executeJump = document.getElementById('executeJump');
        const jumpToday = document.getElementById('jumpToday');
        const jumpYesterday = document.getElementById('jumpYesterday');
        const jumpWeekStart = document.getElementById('jumpWeekStart');
        const jumpMonthStart = document.getElementById('jumpMonthStart');
        
        if (executeJump) executeJump.addEventListener('click', () => this.executeJump());
        if (jumpToday) jumpToday.addEventListener('click', () => this.jumpToToday());
        if (jumpYesterday) jumpYesterday.addEventListener('click', () => this.jumpToYesterday());
        if (jumpWeekStart) jumpWeekStart.addEventListener('click', () => this.jumpToWeekStart());
        if (jumpMonthStart) jumpMonthStart.addEventListener('click', () => this.jumpToMonthStart());
        
        // Goal task management - FIXED: Proper event binding
        const addWeeklyTask = document.getElementById('addWeeklyTask');
        const addMonthlyTask = document.getElementById('addMonthlyTask');
        const addYearlyTask = document.getElementById('addYearlyTask');
        
        if (addWeeklyTask) {
            addWeeklyTask.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add weekly task clicked');
                this.addGoalTask('weekly');
            });
        }
        if (addMonthlyTask) {
            addMonthlyTask.addEventListener('click', (e) => {
                e.preventDefault();
                this.addGoalTask('monthly');
            });
        }
        if (addYearlyTask) {
            addYearlyTask.addEventListener('click', (e) => {
                e.preventDefault();
                this.addGoalTask('yearly');
            });
        }
        
        // Habit management
        const addHabit = document.getElementById('addHabit');
        const newHabit = document.getElementById('newHabit');
        
        if (addHabit) addHabit.addEventListener('click', () => this.addCustomHabit());
        if (newHabit) {
            newHabit.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addCustomHabit();
            });
        }
        
        // Auto-save for text areas
        const dailyText = document.getElementById('dailyText');
        if (dailyText) {
            dailyText.addEventListener('input', () => this.scheduleAutoSave());
        }
        
        // Enter key handlers for goal inputs
        const newWeeklyTask = document.getElementById('newWeeklyTask');
        const newMonthlyTask = document.getElementById('newMonthlyTask');
        const newYearlyTask = document.getElementById('newYearlyTask');
        
        if (newWeeklyTask) {
            newWeeklyTask.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoalTask('weekly');
                }
            });
        }
        if (newMonthlyTask) {
            newMonthlyTask.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoalTask('monthly');
                }
            });
        }
        if (newYearlyTask) {
            newYearlyTask.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addGoalTask('yearly');
                }
            });
        }
        
        // Modal background clicks
        this.setupModalCloseHandlers();
        
        console.log('Event listeners setup complete');
    }
    
    setupModalCloseHandlers() {
        const modals = ['dailyModal', 'entryViewModal', 'exportModal', 'syncSetupModal', 'jumpToModal', 'helpModal'];
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
                case 'ArrowUp':
                    e.preventDefault();
                    this.switchToPreviousView();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.switchToNextView();
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
                    this.openExportModal();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.syncNow();
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
            quoteElement.textContent = `"${quote.quote}"`;
            authorElement.textContent = `— ${quote.author}`;
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
    
    // Navigation Methods - FIXED: Proper view switching
    switchView(view) {
        console.log(`Switching to view: ${view}`);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('tab-btn--active'));
        const targetTab = document.getElementById(`${view}Tab`);
        if (targetTab) {
            targetTab.classList.add('tab-btn--active');
        }
        
        // Hide all views
        document.querySelectorAll('.main-view').forEach(viewEl => viewEl.classList.add('hidden'));
        
        // Show selected view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        
        this.currentView = view;
        this.renderCurrentView();
    }
    
    switchGoalsView(view) {
        console.log(`Switching to goals view: ${view}`);
        
        document.querySelectorAll('.goals-tab').forEach(btn => btn.classList.remove('goals-tab--active'));
        const targetTab = document.getElementById(`${view}GoalsTab`);
        if (targetTab) {
            targetTab.classList.add('goals-tab--active');
        }
        
        document.querySelectorAll('.goals-section').forEach(section => section.classList.add('hidden'));
        const targetSection = document.getElementById(`${view}GoalsSection`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        this.currentGoalsView = view;
        this.renderGoals();
    }
    
    switchToPreviousView() {
        const views = ['weekly', 'monthly', 'yearly', 'goals'];
        const currentIndex = views.indexOf(this.currentView);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : views.length - 1;
        this.switchView(views[previousIndex]);
    }
    
    switchToNextView() {
        const views = ['weekly', 'monthly', 'yearly', 'goals'];
        const currentIndex = views.indexOf(this.currentView);
        const nextIndex = currentIndex < views.length - 1 ? currentIndex + 1 : 0;
        this.switchView(views[nextIndex]);
    }
    
    renderCurrentView() {
        console.log(`Rendering current view: ${this.currentView}`);
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
                break;
            case 'goals':
                this.renderGoals();
                break;
        }
    }
    
    // Weekly Calendar Methods
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
        
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekRange.textContent = `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
        
        // Update week stats
        this.updateWeekStats();
        
        calendarDays.innerHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            calendarDays.appendChild(this.createWeeklyDayElement(date));
        }
        
        this.highlightToday();
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
            // Show full text in weekly view (no truncation)
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
        
        // FIXED: Proper event listener binding
        dayElement.addEventListener('click', (e) => {
            console.log(`Calendar day clicked: ${dateString}`);
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
            monthlyCalendarDays.appendChild(this.createMonthlyDayElement(date));
        }
        
        this.highlightToday();
    }
    
    updateMonthStats() {
        const stats = this.calculateMonthlyStats(this.currentMonth, new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0));
        
        const monthEntriesEl = document.getElementById('monthEntries');
        const monthStreakEl = document.getElementById('monthStreak');
        
        if (monthEntriesEl) monthEntriesEl.textContent = `📝 ${stats.totalEntries} entries`;
        if (monthStreakEl) monthStreakEl.textContent = `🔥 Best streak: ${stats.bestStreak} days`;
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
            // Show limited preview in monthly view (50-100 characters)
            preview.textContent = text.length > 80 ? text.substring(0, 80) + '...' : text;
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
                
                completedHabits.slice(0, 8).forEach(habit => {
                    const dot = document.createElement('div');
                    dot.className = 'habit-dot';
                    dot.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
                    dot.title = habit;
                    indicator.appendChild(dot);
                });
                
                dayElement.appendChild(indicator);
            }
        }
        
        dayElement.addEventListener('click', () => this.openDayEntry(date));
        return dayElement;
    }
    
    renderMonthlySummary() {
        const summaryContent = document.getElementById('monthlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        
        const monthStart = new Date(this.currentMonth);
        const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const stats = this.calculateMonthlyStats(monthStart, monthEnd);
        
        const totalEntries = document.createElement('div');
        totalEntries.className = 'summary-stat';
        totalEntries.innerHTML = `
            <span class="summary-label">📝 Total Entries</span>
            <span class="summary-value">${stats.totalEntries}</span>
        `;
        summaryContent.appendChild(totalEntries);
        
        if (stats.topHabit) {
            const topHabit = document.createElement('div');
            topHabit.className = 'summary-stat';
            topHabit.innerHTML = `
                <span class="summary-label">🏆 Most Consistent Habit</span>
                <span class="summary-value">${stats.topHabit.name} (${stats.topHabit.count})</span>
            `;
            summaryContent.appendChild(topHabit);
        }
        
        const bestStreak = document.createElement('div');
        bestStreak.className = 'summary-stat';
        bestStreak.innerHTML = `
            <span class="summary-label">🔥 Best Streak</span>
            <span class="summary-value">${stats.bestStreak} days</span>
        `;
        summaryContent.appendChild(bestStreak);
    }
    
    calculateMonthlyStats(startDate, endDate) {
        const stats = {
            totalEntries: 0,
            totalWords: 0,
            habitCounts: {},
            topHabit: null,
            bestStreak: 0
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
        
        let maxCount = 0;
        Object.keys(stats.habitCounts).forEach(habit => {
            if (stats.habitCounts[habit] > maxCount) {
                maxCount = stats.habitCounts[habit];
                stats.topHabit = { name: habit, count: maxCount };
            }
        });
        
        stats.bestStreak = this.calculateBestStreakInMonth(startDate, endDate);
        
        return stats;
    }
    
    calculateBestStreakInMonth(startDate, endDate) {
        let bestStreak = 0;
        let currentStreak = 0;
        
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateString = this.formatDate(current);
            const entry = this.entries[dateString];
            
            if (entry && entry.habits) {
                const habitCount = Object.keys(entry.habits).length;
                const completedHabits = Object.values(entry.habits).filter(Boolean).length;
                if (habitCount > 0 && completedHabits / habitCount >= 0.5) {
                    currentStreak++;
                    bestStreak = Math.max(bestStreak, currentStreak);
                } else {
                    currentStreak = 0;
                }
            } else {
                currentStreak = 0;
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        return bestStreak;
    }
    
    // Yearly Calendar Methods
    navigateYear(direction) {
        this.currentYear += direction;
        this.renderYearlyCalendar();
    }
    
    renderYearlyCalendar() {
        const yearTitle = document.getElementById('yearTitle');
        const yearlyCalendar = document.getElementById('yearlyCalendar');
        
        if (!yearTitle || !yearlyCalendar) return;
        
        yearTitle.textContent = `${this.currentYear} - Year Overview`;
        this.updateYearStats();
        
        yearlyCalendar.innerHTML = '';
        
        for (let month = 0; month < 12; month++) {
            const monthElement = this.createYearlyMonthElement(month);
            yearlyCalendar.appendChild(monthElement);
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
        
        while (current <= endDate) {
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
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        if (this.entries[dateString]) {
            dayElement.classList.add('has-entry');
            const habits = this.entries[dateString].habits || {};
            const completedHabits = Object.values(habits).filter(Boolean).length;
            const totalHabits = Object.keys(habits).length;
            
            if (totalHabits > 0) {
                const completion = completedHabits / totalHabits;
                if (completion >= 0.8) {
                    dayElement.style.backgroundColor = '#10B981'; // Green
                } else if (completion >= 0.5) {
                    dayElement.style.backgroundColor = '#F59E0B'; // Yellow
                } else {
                    dayElement.style.backgroundColor = '#EF4444'; // Red
                }
            }
        }
        
        dayElement.addEventListener('click', () => this.openDayEntry(date));
        return dayElement;
    }
    
    // Goals Management - FIXED
    setupGoalsSelectors() {
        console.log('Setting up goals selectors...');
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
            if (i === 0) {
                option.selected = true;
            }
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
            if (year === currentYear) {
                option.selected = true;
            }
            yearSelector.appendChild(option);
        }
        
        yearSelector.addEventListener('change', () => this.loadYearlyGoals());
    }
    
    renderGoals() {
        console.log(`Rendering goals for ${this.currentGoalsView}`);
        switch(this.currentGoalsView) {
            case 'weekly':
                this.loadWeeklyGoals();
                break;
            case 'monthly':
                this.loadMonthlyGoals();
                break;
            case 'yearly':
                this.loadYearlyGoals();
                break;
        }
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
    
    // FIXED: Goal task management
    addGoalTask(period) {
        console.log(`Adding ${period} goal task`);
        
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
    
    // Entry Management - FIXED
    goToToday() {
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.currentYear = this.currentDate.getFullYear();
        this.renderCurrentView();
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
    
    // FIXED: Daily entry modal opening
    openDayEntry(date) {
        console.log(`Opening day entry for: ${this.formatDate(date)}`);
        
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        
        const modalDateEl = document.getElementById('modalDate');
        if (modalDateEl) {
            modalDateEl.textContent = this.formatDateDisplay(date);
        }
        
        const entry = this.entries[dateString] || { text: '', habits: {} };
        const dailyTextEl = document.getElementById('dailyText');
        if (dailyTextEl) {
            dailyTextEl.value = entry.text || '';
        }
        
        this.updateWordCount();
        this.updateEntryStreak();
        this.renderHabits(entry.habits || {});
        
        const modal = document.getElementById('dailyModal');
        if (modal) {
            modal.classList.remove('hidden');
            console.log('Daily modal opened');
            
            // Focus on text area
            setTimeout(() => {
                const textArea = document.getElementById('dailyText');
                if (textArea) textArea.focus();
            }, 100);
        } else {
            console.error('Daily modal not found');
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
        
        if (!entry) return;
        
        const entryViewDateEl = document.getElementById('entryViewDate');
        if (entryViewDateEl) {
            entryViewDateEl.textContent = `Entry for ${this.formatDateDisplay(date)}`;
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
        this.saveCurrentEntry();
        this.showToast('Entry saved! 💾', 'success');
    }
    
    saveEntry() {
        this.saveCurrentEntry();
        this.closeModal();
        this.renderCurrentView();
        this.showToast('Entry saved successfully! 🎉', 'success');
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
    
    // Modal Management - FIXED
    closeModal(modalId = null) {
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('hidden');
        } else {
            const dailyModal = document.getElementById('dailyModal');
            if (dailyModal) dailyModal.classList.add('hidden');
        }
        this.selectedDate = null;
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.selectedDate = null;
    }
    
    closeEntryViewModal() {
        const modal = document.getElementById('entryViewModal');
        if (modal) modal.classList.add('hidden');
    }
    
    openExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    closeExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) modal.classList.add('hidden');
    }
    
    openHelpModal() {
        const modal = document.getElementById('helpModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    closeHelpModal() {
        const modal = document.getElementById('helpModal');
        if (modal) modal.classList.add('hidden');
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
    
    closeJumpToModal() {
        const modal = document.getElementById('jumpToModal');
        if (modal) modal.classList.add('hidden');
    }
    
    executeJump() {
        const jumpDate = document.getElementById('jumpDate');
        if (jumpDate && jumpDate.value) {
            const targetDate = new Date(jumpDate.value);
            this.jumpToDate(targetDate);
        }
        this.closeJumpToModal();
    }
    
    jumpToToday() {
        this.jumpToDate(new Date());
        this.closeJumpToModal();
    }
    
    jumpToYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.jumpToDate(yesterday);
        this.closeJumpToModal();
    }
    
    jumpToWeekStart() {
        this.jumpToDate(this.getWeekStart(new Date()));
        this.closeJumpToModal();
    }
    
    jumpToMonthStart() {
        const monthStart = new Date();
        monthStart.setDate(1);
        this.jumpToDate(monthStart);
        this.closeJumpToModal();
    }
    
    jumpToDate(targetDate) {
        this.currentDate = targetDate;
        this.currentWeekStart = this.getWeekStart(targetDate);
        this.currentMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        this.currentYear = targetDate.getFullYear();
        
        // Switch to appropriate view and render
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
    
    // GitHub Sync Functionality
    initializeSync() {
        if (!this.syncConfig.enabled) {
            this.openSyncSetupModal();
        } else {
            this.syncNow();
        }
    }
    
    openSyncSetupModal() {
        const modal = document.getElementById('syncSetupModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    closeSyncSetupModal() {
        const modal = document.getElementById('syncSetupModal');
        if (modal) modal.classList.add('hidden');
    }
    
    async testGitHubConnection() {
        const tokenInput = document.getElementById('githubToken');
        const statusDiv = document.getElementById('tokenStatus');
        const testBtn = document.getElementById('testConnection');
        const enableBtn = document.getElementById('enableSync');
        
        if (!tokenInput || !statusDiv) return;
        
        const token = tokenInput.value.trim();
        if (!token) {
            statusDiv.textContent = 'Please enter a token';
            statusDiv.className = 'token-status error';
            return;
        }
        
        if (testBtn) {
            testBtn.textContent = 'Testing...';
            testBtn.disabled = true;
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
                statusDiv.textContent = `✅ Connected as ${user.login}`;
                statusDiv.className = 'token-status success';
                if (enableBtn) enableBtn.classList.remove('hidden');
                this.syncConfig.githubToken = token;
            } else {
                statusDiv.textContent = '❌ Invalid token or insufficient permissions';
                statusDiv.className = 'token-status error';
            }
        } catch (error) {
            statusDiv.textContent = '❌ Connection failed. Check your internet connection.';
            statusDiv.className = 'token-status error';
        }
        
        if (testBtn) {
            testBtn.textContent = '🔗 Test Connection';
            testBtn.disabled = false;
        }
    }
    
    async enableSync() {
        if (!this.syncConfig.githubToken) return;
        
        try {
            await this.createOrUpdateGist();
            
            this.syncConfig.enabled = true;
            this.syncConfig.lastSync = new Date().toISOString();
            this.saveData();
            
            this.closeSyncSetupModal();
            this.updateSyncStatus();
            this.showToast('✅ GitHub sync enabled!', 'success');
            
            this.startAutoSync();
        } catch (error) {
            this.showToast('❌ Failed to enable sync', 'error');
            console.error('Sync enable error:', error);
        }
    }
    
    async createOrUpdateGist() {
        if (!this.syncConfig.githubToken) throw new Error('No GitHub token');
        
        const gistData = {
            description: `Daily Activity Tracker Data for ${this.userName}`,
            files: {
                'daily-tracker-data.json': {
                    content: JSON.stringify({
                        entries: this.entries,
                        customHabits: this.customHabits,
                        habitColors: this.habitColors,
                        goals: this.goals,
                        lastSync: new Date().toISOString(),
                        version: '3.1.0'
                    }, null, 2)
                }
            }
        };
        
        const url = this.syncConfig.gistId 
            ? `https://api.github.com/gists/${this.syncConfig.gistId}`
            : 'https://api.github.com/gists';
        
        const method = this.syncConfig.gistId ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `token ${this.syncConfig.githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const result = await response.json();
        this.syncConfig.gistId = result.id;
        this.syncConfig.lastSync = new Date().toISOString();
    }
    
    async syncNow() {
        if (!this.syncConfig.enabled || !this.syncConfig.githubToken) {
            this.showToast('Sync not configured', 'warning');
            return;
        }
        
        this.updateSyncStatus('syncing');
        
        try {
            await this.createOrUpdateGist();
            this.updateSyncStatus('synced');
            this.showToast('✅ Data synced to GitHub!', 'success');
        } catch (error) {
            this.updateSyncStatus('error');
            this.showToast('❌ Sync failed', 'error');
            console.error('Sync error:', error);
        }
    }
    
    startAutoSync() {
        if (!this.syncConfig.enabled) return;
        
        setInterval(() => {
            if (this.syncConfig.enabled && this.syncConfig.githubToken) {
                this.syncNow();
            }
        }, this.syncConfig.autoSyncInterval);
    }
    
    updateSyncStatus(status = null) {
        const syncStatus = document.getElementById('syncStatus');
        if (!syncStatus) return;
        
        if (status === 'syncing') {
            syncStatus.textContent = '⚡ Syncing...';
            syncStatus.className = 'sync-indicator syncing';
        } else if (status === 'synced') {
            syncStatus.textContent = '✅ Synced';
            syncStatus.className = 'sync-indicator online';
        } else if (status === 'error') {
            syncStatus.textContent = '❌ Sync Error';
            syncStatus.className = 'sync-indicator';
        } else if (this.syncConfig.enabled) {
            syncStatus.textContent = '🌐 Online';
            syncStatus.className = 'sync-indicator online';
        } else {
            syncStatus.textContent = '⚡ Offline';
            syncStatus.className = 'sync-indicator';
        }
    }
    
    // Export/Import Methods
    exportData(format) {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            exportDate: new Date().toISOString(),
            version: "3.1.0",
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
        
        this.closeExportModal();
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
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4000);
        }
    }
}

// Initialize the Ultimate Daily Tracker
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Loading ULTIMATE Daily Tracker for Amit...');
    new UltimateDailyTracker();
});