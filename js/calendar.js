// Calendar module for handling calendar rendering and navigation
const Calendar = (() => {
    // Private variables
    let currentDate = new Date();
    let currentView = 'month';
    
    // Initialize calendar
    function init() {
        // Set initial date to today
        currentDate = new Date();
    }
    
    // Switch between different calendar views
    function switchView(view) {
        currentView = view;
        
        switch (view) {
            case 'day':
                showDay(currentDate);
                break;
            case 'week':
                showWeek(currentDate);
                break;
            case 'month':
                showMonth(currentDate);
                break;
            default:
                showMonth(currentDate);
        }
    }
    
    // Show the day view
    function showDay(date) {
        currentDate = new Date(date);
        updateHeader();
        
        const container = document.getElementById('calendar-container');
        container.innerHTML = '';
        
        // Create day view structure
        const dayView = document.createElement('div');
        dayView.className = 'day-view';
        
        // Add all-day events section
        const allDaySection = document.createElement('div');
        allDaySection.className = 'all-day-section';
        allDaySection.innerHTML = '<h3>All Day</h3>';
        dayView.appendChild(allDaySection);
        
        // Add hourly timeline
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        // Start from 6 AM instead of midnight
        for (let hour = 6; hour < 24; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            
            const hourLabel = document.createElement('div');
            hourLabel.className = 'hour-label';
            hourLabel.textContent = hour === 0 ? '12 AM' : 
                                   hour < 12 ? `${hour} AM` : 
                                   hour === 12 ? '12 PM' : 
                                   `${hour - 12} PM`;
            
            const hourContent = document.createElement('div');
            hourContent.className = 'hour-content';
            hourContent.setAttribute('data-hour', hour);
            hourContent.addEventListener('click', (e) => {
                if (e.target === hourContent) {
                    const startTime = new Date(currentDate);
                    startTime.setHours(hour, 0, 0, 0);
                    
                    const endTime = new Date(startTime);
                    endTime.setHours(hour + 1, 0, 0, 0);
                    
                    EventManager.openAddEventModal(startTime, endTime);
                }
            });
            
            hourRow.appendChild(hourLabel);
            hourRow.appendChild(hourContent);
            timeline.appendChild(hourRow);
        }
        
        // Add early morning hours (12 AM - 6 AM) at the bottom
        for (let hour = 0; hour < 6; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            hourRow.setAttribute('data-early-morning', 'true');
            
            const hourLabel = document.createElement('div');
            hourLabel.className = 'hour-label';
            hourLabel.textContent = hour === 0 ? '12 AM' : `${hour} AM`;
            
            const hourContent = document.createElement('div');
            hourContent.className = 'hour-content';
            hourContent.setAttribute('data-hour', hour);
            hourContent.setAttribute('data-early-morning', 'true');
            hourContent.addEventListener('click', (e) => {
                if (e.target === hourContent) {
                    const startTime = new Date(currentDate);
                    startTime.setHours(hour, 0, 0, 0);
                    
                    const endTime = new Date(startTime);
                    endTime.setHours(hour + 1, 0, 0, 0);
                    
                    EventManager.openAddEventModal(startTime, endTime);
                }
            });
            
            hourRow.appendChild(hourLabel);
            hourRow.appendChild(hourContent);
            timeline.appendChild(hourRow);
        }
        
        dayView.appendChild(timeline);
        container.appendChild(dayView);
        
        // Render events for this day
        EventManager.renderEventsForDay(currentDate);
    }
    
    // Show the week view
    function showWeek(date) {
        currentDate = new Date(date);
        updateHeader();
        
        // Get the first day of the week (Monday instead of Sunday)
        const firstDayOfWeek = new Date(currentDate);
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Calculate days to subtract to get to Monday
        // If today is Sunday (0), we need to go back 6 days to get to last Monday
        // If today is any other day (1-6), we go back (currentDay - 1) days
        const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
        firstDayOfWeek.setDate(currentDate.getDate() - daysToSubtract);
        
        const container = document.getElementById('calendar-container');
        container.innerHTML = '';
        
        // Create week view structure
        const weekView = document.createElement('div');
        weekView.className = 'week-view';
        
        // Add day headers
        const daysHeader = document.createElement('div');
        daysHeader.className = 'days-header';
        
        // Add time column header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-header';
        daysHeader.appendChild(timeHeader);
        
        // Add day columns headers - starting with Monday
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(firstDayOfWeek);
            day.setDate(firstDayOfWeek.getDate() + i);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            if (Utils.isToday(day)) {
                dayHeader.classList.add('today');
            }
            
            const dayName = document.createElement('div');
            dayName.className = 'day-name';
            dayName.textContent = weekdays[i];
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day.getDate();
            
            const dayDate = document.createElement('div');
            dayDate.className = 'day-date';
            dayDate.textContent = day.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
            });
            
            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dayNumber);
            dayHeader.appendChild(dayDate);
            daysHeader.appendChild(dayHeader);
        }
        
        weekView.appendChild(daysHeader);
        
        // Add time grid
        const timeGrid = document.createElement('div');
        timeGrid.className = 'time-grid';
        
        // Add hour rows - start from 6 AM
        for (let hour = 6; hour < 24; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            
            // Add time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = hour === 0 ? '12 AM' : 
                                   hour < 12 ? `${hour} AM` : 
                                   hour === 12 ? '12 PM' : 
                                   `${hour - 12} PM`;
            hourRow.appendChild(timeLabel);
            
            // Add day columns
            for (let i = 0; i < 7; i++) {
                const day = new Date(firstDayOfWeek);
                day.setDate(firstDayOfWeek.getDate() + i);
                
                const hourCell = document.createElement('div');
                hourCell.className = 'hour-cell';
                hourCell.setAttribute('data-date', Utils.formatDate(day));
                hourCell.setAttribute('data-hour', hour);
                
                hourCell.addEventListener('click', (e) => {
                    if (e.target === hourCell) {
                        const clickedDate = new Date(day);
                        clickedDate.setHours(hour, 0, 0, 0);
                        
                        const endTime = new Date(clickedDate);
                        endTime.setHours(hour + 1, 0, 0, 0);
                        
                        EventManager.openAddEventModal(clickedDate, endTime);
                    }
                });
                
                hourRow.appendChild(hourCell);
            }
            
            timeGrid.appendChild(hourRow);
        }
        
        // Add early morning hours (12 AM - 6 AM) at the bottom
        for (let hour = 0; hour < 6; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            hourRow.setAttribute('data-early-morning', 'true');
            
            // Add time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = hour === 0 ? '12 AM' : `${hour} AM`;
            hourRow.appendChild(timeLabel);
            
            // Add day columns
            for (let i = 0; i < 7; i++) {
                const day = new Date(firstDayOfWeek);
                day.setDate(firstDayOfWeek.getDate() + i);
                
                const hourCell = document.createElement('div');
                hourCell.className = 'hour-cell';
                hourCell.setAttribute('data-date', Utils.formatDate(day));
                hourCell.setAttribute('data-hour', hour);
                hourCell.setAttribute('data-early-morning', 'true');
                
                hourCell.addEventListener('click', (e) => {
                    if (e.target === hourCell) {
                        const clickedDate = new Date(day);
                        clickedDate.setHours(hour, 0, 0, 0);
                        
                        const endTime = new Date(clickedDate);
                        endTime.setHours(hour + 1, 0, 0, 0);
                        
                        EventManager.openAddEventModal(clickedDate, endTime);
                    }
                });
                
                hourRow.appendChild(hourCell);
            }
            
            timeGrid.appendChild(hourRow);
        }
        
        weekView.appendChild(timeGrid);
        container.appendChild(weekView);
        
        // Render events for this week
        EventManager.renderEventsForWeek(firstDayOfWeek);
    }
    
    // Show the month view
    function showMonth(date) {
        currentDate = new Date(date);
        updateHeader();
        
        const container = document.getElementById('calendar-container');
        container.innerHTML = '';
        
        // Create month view structure
        const monthView = document.createElement('div');
        monthView.className = 'month-view';
        
        // Add day headers (Sun, Mon, etc.)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            monthView.appendChild(dayHeader);
        });
        
        // Get first day of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Get last day of the month
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const totalDaysInMonth = lastDayOfMonth.getDate();
        
        // Get last day of previous month
        const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const daysInPrevMonth = lastDayOfPrevMonth.getDate();
        
        // Create day cells for previous month (if needed)
        for (let i = 0; i < startingDayOfWeek; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell other-month';
            
            const prevMonthDay = daysInPrevMonth - startingDayOfWeek + i + 1;
            const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDay);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-cell-header';
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = prevMonthDay;
            
            const dayInfo = document.createElement('div');
            dayInfo.className = 'day-info';
            dayInfo.textContent = prevMonthDate.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
            });
            
            dayHeader.appendChild(dayNumber);
            dayHeader.appendChild(dayInfo);
            dayCell.appendChild(dayHeader);
            
            dayCell.setAttribute('data-date', Utils.formatDate(prevMonthDate));
            
            dayCell.addEventListener('click', (e) => {
                if (!e.target.closest('.event')) {
                    EventManager.openAddEventModal(prevMonthDate);
                }
            });
            
            monthView.appendChild(dayCell);
        }
        
        // Create day cells for current month
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            const currentMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            if (Utils.isToday(currentMonthDate)) {
                dayCell.classList.add('today');
            }
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-cell-header';
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            
            const dayInfo = document.createElement('div');
            dayInfo.className = 'day-info';
            dayInfo.textContent = currentMonthDate.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
            });
            
            dayHeader.appendChild(dayNumber);
            dayHeader.appendChild(dayInfo);
            dayCell.appendChild(dayHeader);
            
            dayCell.setAttribute('data-date', Utils.formatDate(currentMonthDate));
            
            dayCell.addEventListener('click', (e) => {
                if (!e.target.closest('.event')) {
                    EventManager.openAddEventModal(currentMonthDate);
                }
            });
            
            monthView.appendChild(dayCell);
        }
        
        // Calculate how many cells we need to fill for the next month
        const totalCells = 42; // 6 rows of 7 days
        const remainingCells = totalCells - (startingDayOfWeek + totalDaysInMonth);
        
        // Create day cells for next month
        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell other-month';
            
            const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-cell-header';
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            
            const dayInfo = document.createElement('div');
            dayInfo.className = 'day-info';
            dayInfo.textContent = nextMonthDate.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
            });
            
            dayHeader.appendChild(dayNumber);
            dayHeader.appendChild(dayInfo);
            dayCell.appendChild(dayHeader);
            
            dayCell.setAttribute('data-date', Utils.formatDate(nextMonthDate));
            
            dayCell.addEventListener('click', (e) => {
                if (!e.target.closest('.event')) {
                    EventManager.openAddEventModal(nextMonthDate);
                }
            });
            
            monthView.appendChild(dayCell);
        }
        
        container.appendChild(monthView);
        
        // Render events for this month
        EventManager.renderEventsForMonth(currentDate);
    }
    
    // Navigate to the previous period (day, week, month)
    function previous() {
        switch (currentView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() - 1);
                showDay(currentDate);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() - 7);
                showWeek(currentDate);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() - 1);
                showMonth(currentDate);
                break;
        }
    }
    
    // Navigate to the next period (day, week, month)
    function next() {
        switch (currentView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + 1);
                showDay(currentDate);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7);
                showWeek(currentDate);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                showMonth(currentDate);
                break;
        }
    }
    
    // Go to today
    function goToToday() {
        currentDate = new Date();
        switchView(currentView);
    }
    
    // Update the header with current date information
    function updateHeader() {
        const headerElement = document.getElementById('current-date');
        
        switch (currentView) {
            case 'day':
                headerElement.textContent = currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                });
                break;
            case 'week':
                // Get first (Monday) and last (Sunday) day of the week
                const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
                const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
                
                const firstDay = new Date(currentDate);
                firstDay.setDate(currentDate.getDate() - daysToSubtract);
                
                const lastDay = new Date(firstDay);
                lastDay.setDate(firstDay.getDate() + 6);
                
                // Format date range
                const firstDayStr = firstDay.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                });
                
                const lastDayStr = lastDay.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                });
                
                headerElement.textContent = `${firstDayStr} - ${lastDayStr}`;
                break;
            case 'month':
                headerElement.textContent = currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric'
                });
                break;
        }
    }
    
    // Public API
    return {
        init,
        switchView,
        showDay,
        showWeek,
        showMonth,
        previous,
        next,
        goToToday,
        getCurrentDate: () => new Date(currentDate),
        getCurrentView: () => currentView
    };
})(); 