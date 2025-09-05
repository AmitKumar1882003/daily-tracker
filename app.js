// NEET-PG Daily Activity Tracker for Amit - Fixed Version
class NEETPGTracker {
    constructor() {
        console.log('Starting NEET-PG Tracker for Amit...');
        
        // Initialize dates
        this.currentDate = new Date();
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        this.currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        this.currentYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.currentView = 'weekly';
        this.quoteIndex = 0;
        
        // NEET-PG focused motivational quotes
        this.motivationalQuotes = [
            "Every Anki card today brings you closer to NEET-PG success! 🩺",
            "Consistency in study habits builds medical excellence. 📚",
            "Your future patients depend on today's dedication. 💪",
            "Strong body, sharp mind - gym time is study investment. 🏋️",
            "Every chapter mastered is a step toward your dream residency. 🎯",
            "Discipline today, NEET-PG success tomorrow. ⭐",
            "Spaced repetition builds permanent medical knowledge. 🧠",
            "Quality study beats quantity - focus is key. 🔍",
            "Your NEET-PG rank reflects today's efforts. 📈",
            "Preparation prevents poor performance. 🎓"
        ];
        
        // Default NEET-PG focused habits with medical theme colors
        this.defaultHabits = [
            "Anki Reviews",
            "Exercise/Gym", 
            "Medical Reading",
            "Question Practice",
            "Revision",
            "Theory Study",
            "Clinical Cases",
            "Mock Tests"
        ];
        
        // Medical-themed habit colors
        this.habitColors = {
            "Anki Reviews": "#2563EB",
            "Exercise/Gym": "#059669", 
            "Medical Reading": "#DC2626",
            "Question Practice": "#7C3AED",
            "Revision": "#0891B2",
            "Theory Study": "#EA580C",
            "Clinical Cases": "#BE185D",
            "Mock Tests": "#4338CA"
        };
        
        // Available colors for new habits
        this.availableColors = [
            "#2563EB", "#059669", "#DC2626", "#7C3AED", "#0891B2", 
            "#EA580C", "#BE185D", "#4338CA", "#10B981", "#F59E0B",
            "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#6366F1"
        ];
        
        this.init();
    }
    
    init() {
        console.log('Initializing NEET-PG Tracker...');
        this.loadData();
        this.setupEventListeners();
        this.startQuoteRotation();
        this.renderCurrentView();
        this.setupGoalsSelectors();
        this.setupKeyboardShortcuts();
        console.log('NEET-PG Tracker ready!');
    }
    
    loadData() {
        // Load from localStorage or use provided NEET-PG data
        const storedData = localStorage.getItem('neetpgTrackerData');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.entries = data.entries || {};
            this.customHabits = data.customHabits || [];
            this.habitColors = { ...this.habitColors, ...(data.habitColors || {}) };
            this.goals = data.goals || { weekly: {}, monthly: {}, yearly: {} };
        } else {
            // Use provided NEET-PG sample data
            this.entries = {
                "2025-09-05": {
                    "text": "Productive NEET-PG study day. Completed Cardiovascular Pathology - covered RHD, IE, and cardiomyopathies. Made 150 Anki cards with mnemonics. Solved 50 cardiology MCQs with 88% accuracy. Need to improve ECG interpretation. 2-hour gym session for study stamina. Evening pharmacology revision. Planning respiratory path tomorrow.",
                    "habits": {
                        "Anki Reviews": true,
                        "Exercise/Gym": true,
                        "Medical Reading": true,
                        "Question Practice": true,
                        "Revision": true,
                        "Theory Study": true,
                        "Clinical Cases": false,
                        "Mock Tests": false
                    },
                    "timestamp": new Date().toISOString()
                }
            };

            this.goals = {
                weekly: {
                    "2025-W36": "Complete 500 Anki reviews daily. Finish Pathology chapter on CVS. Solve 200 MCQs. Maintain gym routine. Review high-yield topics."
                },
                monthly: {
                    "2025-09": "Master Cardiovascular and Respiratory Pathology. Complete 15,000 Anki reviews. Solve 2000+ practice questions. Score 85%+ in mock tests. Maintain physical fitness."
                },
                yearly: {
                    "2025": "Crack NEET-PG with top rank. Complete entire syllabus twice. Master 50,000+ Anki cards. Score consistently 85%+ in mocks. Secure preferred residency seat."
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
            version: "3.0.0",
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('neetpgTrackerData', JSON.stringify(data));
    }
    
    startQuoteRotation() {
        // Rotate motivational quotes every 10 seconds
        setInterval(() => {
            this.quoteIndex = (this.quoteIndex + 1) % this.motivationalQuotes.length;
            const quoteElement = document.getElementById('motivationalQuote');
            if (quoteElement) {
                quoteElement.textContent = this.motivationalQuotes[this.quoteIndex];
            }
        }, 10000);
    }
    
    setupEventListeners() {
        // Tab navigation - Fixed
        const weeklyTab = document.getElementById('weeklyTab');
        const monthlyTab = document.getElementById('monthlyTab');
        const yearlyTab = document.getElementById('yearlyTab');
        const goalsTab = document.getElementById('goalsTab');
        
        if (weeklyTab) weeklyTab.addEventListener('click', () => this.switchView('weekly'));
        if (monthlyTab) monthlyTab.addEventListener('click', () => this.switchView('monthly'));
        if (yearlyTab) yearlyTab.addEventListener('click', () => this.switchView('yearly'));
        if (goalsTab) goalsTab.addEventListener('click', () => this.switchView('goals'));
        
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
        
        // Export/Import - Fixed
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        
        if (exportBtn) exportBtn.addEventListener('click', () => this.openExportModal());
        if (importBtn) importBtn.addEventListener('click', () => this.openImportModal());
        
        // Modal controls - Fixed
        const closeModal = document.getElementById('closeModal');
        const closeEntryView = document.getElementById('closeEntryView');
        const closeExportModal = document.getElementById('closeExportModal');
        const closeImportModal = document.getElementById('closeImportModal');
        const saveEntry = document.getElementById('saveEntry');
        
        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (closeEntryView) closeEntryView.addEventListener('click', () => this.closeEntryViewModal());
        if (closeExportModal) closeExportModal.addEventListener('click', () => this.closeExportModal());
        if (closeImportModal) closeImportModal.addEventListener('click', () => this.closeImportModal());
        if (saveEntry) saveEntry.addEventListener('click', () => this.saveEntry());
        
        // Export buttons - Fixed
        const exportJSON = document.getElementById('exportJSON');
        const exportCSV = document.getElementById('exportCSV');
        
        if (exportJSON) exportJSON.addEventListener('click', () => this.exportData('json'));
        if (exportCSV) exportCSV.addEventListener('click', () => this.exportData('csv'));
        
        // Import - Fixed
        const executeImport = document.getElementById('executeImport');
        if (executeImport) executeImport.addEventListener('click', () => this.executeImport());
        
        // Goals - Fixed
        const saveWeeklyGoals = document.getElementById('saveWeeklyGoals');
        const saveMonthlyGoals = document.getElementById('saveMonthlyGoals');
        const saveYearlyGoals = document.getElementById('saveYearlyGoals');
        const weekGoalSelector = document.getElementById('weekGoalSelector');
        const monthGoalSelector = document.getElementById('monthGoalSelector');
        const yearGoalSelector = document.getElementById('yearGoalSelector');
        
        if (saveWeeklyGoals) saveWeeklyGoals.addEventListener('click', () => this.saveWeeklyGoals());
        if (saveMonthlyGoals) saveMonthlyGoals.addEventListener('click', () => this.saveMonthlyGoals());
        if (saveYearlyGoals) saveYearlyGoals.addEventListener('click', () => this.saveYearlyGoals());
        if (weekGoalSelector) weekGoalSelector.addEventListener('change', () => this.loadWeeklyGoals());
        if (monthGoalSelector) monthGoalSelector.addEventListener('change', () => this.loadMonthlyGoals());
        if (yearGoalSelector) yearGoalSelector.addEventListener('change', () => this.loadYearlyGoals());
        
        // Habit management - Fixed
        const addHabit = document.getElementById('addHabit');
        const newHabit = document.getElementById('newHabit');
        
        if (addHabit) addHabit.addEventListener('click', () => this.addCustomHabit());
        if (newHabit) {
            newHabit.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addCustomHabit();
            });
        }
        
        // Auto-save for text - Fixed
        const dailyText = document.getElementById('dailyText');
        if (dailyText) dailyText.addEventListener('input', () => this.autoSave());
        
        // Modal background clicks - Fixed
        const dailyModal = document.getElementById('dailyModal');
        const entryViewModal = document.getElementById('entryViewModal');
        const exportModal = document.getElementById('exportModal');
        const importModal = document.getElementById('importModal');
        
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
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when no modal is open and not typing in inputs
            if (document.querySelector('.modal:not(.hidden)') || 
                e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
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
                case 't':
                case 'T':
                    this.goToToday();
                    break;
                case '1':
                    this.switchView('weekly');
                    break;
                case '2':
                    this.switchView('monthly');
                    break;
                case '3':
                    this.switchView('yearly');
                    break;
                case '4':
                    this.switchView('goals');
                    break;
            }
        });
    }
    
    switchView(view) {
        console.log('Switching to view:', view);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('tab-btn--active'));
        const activeTab = document.getElementById(`${view}Tab`);
        if (activeTab) activeTab.classList.add('tab-btn--active');
        
        // Hide all views
        document.querySelectorAll('.main-view').forEach(viewEl => {
            viewEl.classList.add('hidden');
        });
        
        // Show selected view
        const selectedView = document.getElementById(`${view}View`);
        if (selectedView) {
            selectedView.classList.remove('hidden');
        } else {
            console.error(`View element ${view}View not found`);
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
            case 'yearly':
                this.renderYearlyCalendar();
                this.renderYearlySummary();
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
        
        // Entry preview (full text in weekly view)
        if (this.entries[dateString]) {
            const preview = document.createElement('div');
            preview.className = 'day-preview';
            const text = this.entries[dateString].text || '';
            preview.textContent = text; // Show full text in weekly view
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
        
        // Click handler - Fixed to properly open modal
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
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
        
        // Entry preview (100 chars max)
        if (this.entries[dateString]) {
            const text = this.entries[dateString].text || '';
            if (text) {
                const preview = document.createElement('div');
                preview.className = 'day-preview';
                preview.textContent = text.length > 100 ? text.substring(0, 100) + '...' : text;
                preview.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openEntryView(date);
                });
                dayElement.appendChild(preview);
            }
            
            // Habits indicator
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
        
        // Click handler - Fixed
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openDayEntry(date);
        });
        
        return dayElement;
    }
    
    // Yearly Calendar Methods
    navigateYear(direction) {
        this.currentYear += direction;
        this.renderYearlyCalendar();
        this.renderYearlySummary();
    }
    
    renderYearlyCalendar() {
        const yearTitle = document.getElementById('yearTitle');
        const yearlyCalendarMonths = document.getElementById('yearlyCalendarMonths');
        
        if (!yearTitle || !yearlyCalendarMonths) return;
        
        yearTitle.textContent = this.currentYear.toString();
        yearlyCalendarMonths.innerHTML = '';
        
        // Create 12 months
        for (let month = 0; month < 12; month++) {
            const monthElement = this.createYearlyMonthElement(month);
            yearlyCalendarMonths.appendChild(monthElement);
        }
    }
    
    createYearlyMonthElement(month) {
        const monthDate = new Date(this.currentYear, month, 1);
        const monthElement = document.createElement('div');
        monthElement.className = 'yearly-month';
        
        // Month title
        const title = document.createElement('div');
        title.className = 'yearly-month-title';
        title.textContent = monthDate.toLocaleDateString('en-US', { month: 'long' });
        monthElement.appendChild(title);
        
        // Month grid
        const grid = document.createElement('div');
        grid.className = 'yearly-month-grid';
        
        // Day headers
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'yearly-day-header';
            header.textContent = day;
            grid.appendChild(header);
        });
        
        // Days
        const firstDay = new Date(this.currentYear, month, 1);
        const lastDay = new Date(this.currentYear, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        // Empty cells
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            grid.appendChild(emptyDay);
        }
        
        // Month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, month, day);
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
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        if (this.entries[dateString]) {
            dayElement.classList.add('has-entry');
            
            // Show habit dots
            const habits = this.entries[dateString].habits || {};
            const completedHabits = Object.keys(habits).filter(habit => habits[habit]);
            
            if (completedHabits.length > 0) {
                const habitsDiv = document.createElement('div');
                habitsDiv.className = 'yearly-habits';
                
                completedHabits.slice(0, 4).forEach(habit => {
                    const dot = document.createElement('div');
                    dot.className = 'yearly-habit-dot';
                    dot.style.backgroundColor = this.habitColors[habit] || this.getRandomColor();
                    habitsDiv.appendChild(dot);
                });
                
                dayElement.appendChild(habitsDiv);
            }
        }
        
        // Click handler - Fixed
        dayElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openDayEntry(date);
        });
        return dayElement;
    }
    
    // Summary Methods
    renderMonthlySummary() {
        const summaryContent = document.getElementById('monthlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        
        // Calculate monthly stats
        const monthStart = new Date(this.currentMonth);
        const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const stats = this.calculateStats(monthStart, monthEnd);
        
        this.renderSummaryStats(summaryContent, stats);
    }
    
    renderYearlySummary() {
        const summaryContent = document.getElementById('yearlySummaryContent');
        if (!summaryContent) return;
        
        summaryContent.innerHTML = '';
        
        // Calculate yearly stats
        const yearStart = new Date(this.currentYear, 0, 1);
        const yearEnd = new Date(this.currentYear, 11, 31);
        const stats = this.calculateStats(yearStart, yearEnd);
        
        this.renderSummaryStats(summaryContent, stats);
    }
    
    calculateStats(startDate, endDate) {
        const stats = {
            totalEntries: 0,
            totalWords: 0,
            habitCounts: {},
            topHabit: null,
            avgEntryLength: 0,
            studyDays: 0
        };
        
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateString = this.formatDate(current);
            const entry = this.entries[dateString];
            
            if (entry) {
                stats.totalEntries++;
                stats.studyDays++;
                
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
    
    renderSummaryStats(container, stats) {
        const statsData = [
            { label: 'Study Days', value: stats.studyDays },
            { label: 'Total Entries', value: stats.totalEntries },
            { label: 'Total Words Written', value: stats.totalWords.toLocaleString() },
            { label: 'Average Entry Length', value: `${stats.avgEntryLength} words` }
        ];
        
        if (stats.topHabit) {
            statsData.push({
                label: 'Most Consistent Habit',
                value: `${stats.topHabit.name} (${stats.topHabit.count} days)`
            });
        }
        
        statsData.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'summary-stat';
            statElement.innerHTML = `
                <span class="summary-label">${stat.label}</span>
                <span class="summary-value">${stat.value}</span>
            `;
            container.appendChild(statElement);
        });
    }
    
    // Goals Methods
    setupGoalsSelectors() {
        this.setupWeekGoalSelector();
        this.setupMonthGoalSelector();
        this.setupYearGoalSelector();
    }
    
    setupWeekGoalSelector() {
        const selector = document.getElementById('weekGoalSelector');
        if (!selector) return;
        
        selector.innerHTML = '';
        const currentDate = new Date();
        
        // Add current and next few weeks
        for (let i = -4; i <= 8; i++) {
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() + (i * 7));
            const weekStartFormatted = this.getWeekStart(weekStart);
            const weekEnd = new Date(weekStartFormatted);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const weekNumber = this.getWeekNumber(weekStartFormatted);
            const option = document.createElement('option');
            option.value = `${weekStartFormatted.getFullYear()}-W${weekNumber}`;
            option.textContent = `Week ${weekNumber}, ${weekStartFormatted.getFullYear()} (${this.formatDateShort(weekStartFormatted)} - ${this.formatDateShort(weekEnd)})`;
            
            if (i === 0) option.selected = true;
            selector.appendChild(option);
        }
    }
    
    setupMonthGoalSelector() {
        const selector = document.getElementById('monthGoalSelector');
        if (!selector) return;
        
        selector.innerHTML = '';
        const currentYear = this.currentDate.getFullYear();
        
        for (let year = currentYear - 1; year <= currentYear + 1; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                const option = document.createElement('option');
                option.value = `${year}-${String(month + 1).padStart(2, '0')}`;
                option.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                
                if (year === currentYear && month === this.currentDate.getMonth()) {
                    option.selected = true;
                }
                selector.appendChild(option);
            }
        }
    }
    
    setupYearGoalSelector() {
        const selector = document.getElementById('yearGoalSelector');
        if (!selector) return;
        
        selector.innerHTML = '';
        const currentYear = this.currentDate.getFullYear();
        
        for (let year = currentYear - 2; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year.toString();
            option.textContent = year.toString();
            if (year === currentYear) {
                option.selected = true;
            }
            selector.appendChild(option);
        }
    }
    
    renderGoals() {
        this.loadWeeklyGoals();
        this.loadMonthlyGoals();
        this.loadYearlyGoals();
    }
    
    loadWeeklyGoals() {
        const selector = document.getElementById('weekGoalSelector');
        const textarea = document.getElementById('weeklyGoals');
        
        if (selector && textarea) {
            const weekKey = selector.value;
            textarea.value = this.goals.weekly[weekKey] || '';
        }
    }
    
    loadMonthlyGoals() {
        const selector = document.getElementById('monthGoalSelector');
        const textarea = document.getElementById('monthlyGoals');
        
        if (selector && textarea) {
            const monthKey = selector.value;
            textarea.value = this.goals.monthly[monthKey] || '';
        }
    }
    
    loadYearlyGoals() {
        const selector = document.getElementById('yearGoalSelector');
        const textarea = document.getElementById('yearlyGoals');
        
        if (selector && textarea) {
            const yearKey = selector.value;
            textarea.value = this.goals.yearly[yearKey] || '';
        }
    }
    
    saveWeeklyGoals() {
        const selector = document.getElementById('weekGoalSelector');
        const textarea = document.getElementById('weeklyGoals');
        
        if (selector && textarea) {
            const weekKey = selector.value;
            this.goals.weekly[weekKey] = textarea.value.trim();
            this.saveData();
            this.showToast('Weekly goals saved!', 'success');
        }
    }
    
    saveMonthlyGoals() {
        const selector = document.getElementById('monthGoalSelector');
        const textarea = document.getElementById('monthlyGoals');
        
        if (selector && textarea) {
            const monthKey = selector.value;
            this.goals.monthly[monthKey] = textarea.value.trim();
            this.saveData();
            this.showToast('Monthly goals saved!', 'success');
        }
    }
    
    saveYearlyGoals() {
        const selector = document.getElementById('yearGoalSelector');
        const textarea = document.getElementById('yearlyGoals');
        
        if (selector && textarea) {
            const yearKey = selector.value;
            this.goals.yearly[yearKey] = textarea.value.trim();
            this.saveData();
            this.showToast('Yearly goals saved!', 'success');
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
    
    // Entry Management
    goToToday() {
        const today = new Date();
        this.currentDate = today;
        this.currentWeekStart = this.getWeekStart(today);
        this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        this.currentYear = today.getFullYear();
        this.renderCurrentView();
        
        // Open today's entry if Today button clicked
        this.openDayEntry(today);
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
        console.log('Opening day entry for:', date);
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        
        // Set modal title with correct date
        const modalDate = document.getElementById('modalDate');
        if (modalDate) {
            modalDate.textContent = this.formatDateDisplay(date);
        }
        
        // Load existing entry
        const entry = this.entries[dateString] || { text: '', habits: {} };
        const dailyText = document.getElementById('dailyText');
        if (dailyText) {
            dailyText.value = entry.text || '';
        }
        
        this.renderHabits(entry.habits || {});
        
        const modal = document.getElementById('dailyModal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Focus on text area after modal opens
            setTimeout(() => {
                if (dailyText) dailyText.focus();
            }, 100);
        }
    }
    
    openEntryView(date) {
        const dateString = this.formatDate(date);
        const entry = this.entries[dateString];
        
        if (!entry) return;
        
        const entryViewDate = document.getElementById('entryViewDate');
        if (entryViewDate) {
            entryViewDate.textContent = `NEET-PG Study Entry - ${this.formatDateDisplay(date)}`;
        }
        
        const content = document.getElementById('entryViewContent');
        if (!content) return;
        
        content.innerHTML = '';
        
        // Full text
        if (entry.text) {
            const textSection = document.createElement('div');
            textSection.innerHTML = '<h4>Study Details</h4>';
            
            const textContent = document.createElement('div');
            textContent.className = 'entry-full-text';
            textContent.textContent = entry.text;
            
            textSection.appendChild(textContent);
            content.appendChild(textSection);
        }
        
        // Habits
        if (entry.habits) {
            const habitsSection = document.createElement('div');
            habitsSection.innerHTML = '<h4>Study Habits Completed</h4>';
            
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
        if (entryViewModal) {
            entryViewModal.classList.remove('hidden');
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
                removeBtn.title = 'Remove habit';
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
            this.showToast(`Added custom habit: ${habitName}`, 'success');
        } else if (habitName) {
            this.showToast('Habit already exists!', 'error');
        }
    }
    
    removeCustomHabit(habitName) {
        if (confirm(`Remove "${habitName}" habit? This will delete it from all entries.`)) {
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
            this.showToast(`Removed habit: ${habitName}`, 'success');
        }
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
        this.showToast('NEET-PG study entry saved!', 'success');
    }
    
    // Modal Management - Fixed
    closeModal() {
        const modal = document.getElementById('dailyModal');
        if (modal) modal.classList.add('hidden');
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
    
    openImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) modal.classList.remove('hidden');
    }
    
    closeImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) modal.classList.add('hidden');
    }
    
    // Export/Import Methods - Fixed
    exportData(format) {
        const data = {
            entries: this.entries,
            customHabits: this.customHabits,
            habitColors: this.habitColors,
            goals: this.goals,
            exportDate: new Date().toISOString(),
            version: "3.0.0",
            user: "Amit",
            purpose: "NEET-PG Study Tracking"
        };
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'json') {
            this.downloadFile(
                JSON.stringify(data, null, 2),
                `amit-neetpg-tracker-${timestamp}.json`,
                'application/json'
            );
        } else if (format === 'csv') {
            const csv = this.convertToCSV(data);
            this.downloadFile(
                csv,
                `amit-neetpg-tracker-${timestamp}.csv`,
                'text/csv'
            );
        }
        
        this.closeExportModal();
        this.showToast(`NEET-PG data exported as ${format.toUpperCase()}!`, 'success');
    }
    
    convertToCSV(data) {
        const headers = ['Date', 'Study Entry', 'Word Count', ...this.getAllHabits()];
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
        try {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            this.showToast('Error downloading file. Please try again.', 'error');
        }
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
                this.setupGoalsSelectors();
                this.closeImportModal();
                this.showToast('NEET-PG data imported successfully!', 'success');
                
            } catch (error) {
                this.showToast('Error importing data. Please check the file format.', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.onerror = () => {
            this.showToast('Error reading file. Please try again.', 'error');
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
    
    formatDateShort(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    showToast(message, type = 'success') {
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

// Initialize the NEET-PG tracker immediately when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting NEET-PG Tracker for Amit...');
    try {
        new NEETPGTracker();
        console.log('NEET-PG Tracker initialized successfully!');
    } catch (error) {
        console.error('Error initializing NEET-PG Tracker:', error);
    }
});