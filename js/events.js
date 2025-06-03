// Events module for handling calendar events
const EventManager = (() => {
    // Private variables
    let events = [];
    let currentEventId = null;
    let activeRoleFilter = 'all';
    let defaultRoleId = 'all'; // Add a variable to track the default role ID
    
    // Initialize events manager
    function init() {
        // Load events from localStorage
        loadEvents();
    }
    
    // Load events from localStorage
    function loadEvents() {
        const storedEvents = localStorage.getItem('calendar_events');
        if (storedEvents) {
            try {
                events = JSON.parse(storedEvents);
                
                // Convert string dates back to Date objects
                events.forEach(event => {
                    event.start = new Date(event.start);
                    event.end = new Date(event.end);
                });
            } catch (error) {
                console.error('Error parsing stored events:', error);
                events = [];
            }
        }
    }
    
    // Save events to localStorage
    function saveEvents() {
        try {
            localStorage.setItem('calendar_events', JSON.stringify(events));
        } catch (error) {
            console.error('Error saving events to localStorage:', error);
        }
    }
    
    // Open modal to add a new event
    function openAddEventModal(startDate = new Date(), endDate = null) {
        currentEventId = null;
        
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const modalTitle = document.getElementById('modal-title');
        const deleteBtn = document.getElementById('delete-event');
        
        modalTitle.textContent = 'Add Event';
        form.reset();
        deleteBtn.style.display = 'none';
        
        // Set default start and end times
        if (!endDate) {
            endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1);
        }
        
        // Format dates for datetime-local input
        const startDateInput = document.getElementById('event-start');
        startDateInput.value = formatDateTimeForInput(startDate);
        
        const endDateInput = document.getElementById('event-end');
        endDateInput.value = formatDateTimeForInput(endDate);
        
        // Populate roles dropdown
        populateRolesDropdown();
        
        // Set the default role to match the active filter role if it's not "all"
        if (defaultRoleId !== 'all') {
            const roleSelect = document.getElementById('event-role');
            roleSelect.value = defaultRoleId;
        }
        
        // Show the modal
        modal.classList.add('open');
    }
    
    // Open modal to edit an existing event
    function openEditEventModal(eventId) {
        currentEventId = eventId;
        const event = events.find(e => e.id === eventId);
        
        if (!event) return;
        
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const modalTitle = document.getElementById('modal-title');
        const deleteBtn = document.getElementById('delete-event');
        
        modalTitle.textContent = 'Edit Event';
        deleteBtn.style.display = 'block';
        
        // Fill form with event data
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-start').value = formatDateTimeForInput(event.start);
        document.getElementById('event-end').value = formatDateTimeForInput(event.end);
        document.getElementById('event-location').value = event.location || '';
        document.getElementById('event-notes').value = event.notes || '';
        
        // Populate roles dropdown and select current role
        populateRolesDropdown(event.roleId);
        
        // Show the modal
        modal.classList.add('open');
    }
    
    // Save event (create new or update existing)
    function saveEvent() {
        const title = document.getElementById('event-title').value;
        const start = new Date(document.getElementById('event-start').value);
        const end = new Date(document.getElementById('event-end').value);
        const location = document.getElementById('event-location').value;
        const notes = document.getElementById('event-notes').value;
        const roleId = document.getElementById('event-role').value;
        
        if (currentEventId) {
            // Update existing event
            const eventIndex = events.findIndex(e => e.id === currentEventId);
            if (eventIndex !== -1) {
                events[eventIndex] = {
                    ...events[eventIndex],
                    title,
                    start,
                    end,
                    location,
                    notes,
                    roleId: roleId || null
                };
            }
        } else {
            // Create new event
            const newEvent = {
                id: Utils.generateId(),
                title,
                start,
                end,
                location,
                notes,
                roleId: roleId || null
            };
            
            events.push(newEvent);
        }
        
        // Save events to localStorage
        saveEvents();
        
        // Close modal
        document.getElementById('event-modal').classList.remove('open');
        
        // Refresh calendar view
        refreshCurrentView();
    }
    
    // Delete an event
    function deleteEvent() {
        if (!currentEventId) return;
        
        // Filter out the event to delete
        events = events.filter(event => event.id !== currentEventId);
        
        // Save events to localStorage
        saveEvents();
        
        // Close modal
        document.getElementById('event-modal').classList.remove('open');
        
        // Refresh calendar view
        refreshCurrentView();
    }
    
    // Render events for a specific day
    function renderEventsForDay(date) {
        // Clear any existing events first
        const allDaySection = document.querySelector('.all-day-section');
        Array.from(allDaySection.children).forEach(child => {
            if (child.classList.contains('event')) {
                allDaySection.removeChild(child);
            }
        });
        
        const hourContents = document.querySelectorAll('.hour-content');
        hourContents.forEach(cell => {
            Array.from(cell.children).forEach(child => {
                if (child.classList.contains('event')) {
                    cell.removeChild(child);
                }
            });
            // Set position relative for proper absolute positioning of events
            cell.style.position = 'relative';
        });
        
        // Create a normalized date for comparison (with time set to midnight)
        const normalizedDate = Utils.normalizeDate(date);
        
        // Get all events for this day
        const dayEvents = filterEvents(events).filter(event => {
            // Compare the normalized dates to check if they're the same day
            return Utils.normalizeDate(event.start).getTime() === normalizedDate.getTime();
        });
        
        // Sort events by start time
        dayEvents.sort((a, b) => a.start - b.start);
        
        // Separate all-day events from timed events
        const allDayEvents = dayEvents.filter(isAllDayEvent);
        const timedEvents = dayEvents.filter(event => !isAllDayEvent(event));
        
        // Render all-day events
        allDayEvents.forEach(event => {
            const eventElement = createEventElement(event, 'day');
            allDaySection.appendChild(eventElement);
        });
        
        // Render timed events
        timedEvents.forEach(event => {
            const startHour = event.start.getHours();
            
            // Find the correct hour content element for the start time
            let hourContent;
            
            if (startHour >= 6) {
                // Regular hours (6 AM - 11 PM)
                hourContent = document.querySelector(`.hour-content[data-hour="${startHour}"]:not([data-early-morning])`);
            } else {
                // Early morning hours (12 AM - 5 AM)
                hourContent = document.querySelector(`.hour-content[data-hour="${startHour}"][data-early-morning="true"]`);
            }
            
            if (hourContent) {
                const eventElement = createEventElement(event, 'day');
                hourContent.appendChild(eventElement);
            }
        });
    }
    
    // Render events for a specific week
    function renderEventsForWeek(startOfWeek) {
        // Clear any existing events first
        const hourCells = document.querySelectorAll('.hour-cell');
        hourCells.forEach(cell => {
            // Remove all event elements but keep the cell itself
            Array.from(cell.children).forEach(child => {
                if (child.classList.contains('event')) {
                    cell.removeChild(child);
                }
            });
        });
        
        // Calculate the end of the week (6 days after start)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // End of the last day
        
        // Get all events that fall within this week
        const weekEvents = filterEvents(events).filter(event => {
            // Check if the event overlaps with the week
            return (event.start <= endOfWeek && event.end >= startOfWeek);
        });
        
        // Sort events by start time
        weekEvents.sort((a, b) => a.start - b.start);
        
        // Process each event
        weekEvents.forEach(event => {
            // Get the event date (using start date)
            const eventDate = new Date(event.start);
            
            // Create a normalized event date for finding the correct day cell
            const normalizedEventDate = Utils.normalizeDate(eventDate);
            
            // Find the corresponding day in the week view
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + i);
                const normalizedDayDate = Utils.normalizeDate(dayDate);
                
                // Check if this is the correct day
                if (normalizedEventDate.getTime() === normalizedDayDate.getTime()) {
                    const hour = eventDate.getHours();
                    const dateStr = Utils.formatDate(dayDate);
                    
                    // Find the correct cell for this event
                    let targetCell;
                    
                    if (hour >= 6) {
                        // Regular hour (6 AM - 11 PM)
                        targetCell = document.querySelector(`.hour-cell[data-date="${dateStr}"][data-hour="${hour}"]:not([data-early-morning])`);
                    } else {
                        // Early morning hour (12 AM - 5 AM)
                        targetCell = document.querySelector(`.hour-cell[data-date="${dateStr}"][data-hour="${hour}"][data-early-morning="true"]`);
                    }
                    
                    // If we found a cell, add the event
                    if (targetCell) {
                        const eventElement = createEventElement(event, 'week');
                        targetCell.appendChild(eventElement);
                    }
                    
                    break; // Found the correct day, no need to continue
                }
            }
        });
    }
    
    // Render events for a specific month
    function renderEventsForMonth(date) {
        // Get the year and month
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Clear any existing events from day cells
        const dayCells = document.querySelectorAll('.day-cell');
        dayCells.forEach(cell => {
            Array.from(cell.children).forEach(child => {
                if (child.classList.contains('event') || child.classList.contains('more-events')) {
                    cell.removeChild(child);
                }
            });
        });
        
        // Filter events for the active role
        const filteredEvents = filterEvents(events);
        
        // Group events by date
        const eventsByDate = {};
        
        filteredEvents.forEach(event => {
            // Normalize the event date to midnight for proper day comparison
            const eventDate = Utils.normalizeDate(event.start);
            
            // Use ISO string date part as the key
            const dateStr = Utils.formatDate(eventDate);
            
            if (!eventsByDate[dateStr]) {
                eventsByDate[dateStr] = [];
            }
            eventsByDate[dateStr].push(event);
        });
        
        // Add events to each day cell
        dayCells.forEach(cell => {
            const dateStr = cell.getAttribute('data-date');
            const eventsForDay = eventsByDate[dateStr] || [];
            
            // Sort events by start time from early to late
            eventsForDay.sort((a, b) => a.start.getTime() - b.start.getTime());
            
            // Set to display exactly 3 events per cell
            const maxEventsToDisplay = 3;
            const displayEvents = eventsForDay.slice(0, maxEventsToDisplay);
            const remainingCount = eventsForDay.length - maxEventsToDisplay;
            
            // Add event elements
            displayEvents.forEach(event => {
                const eventElement = createEventElement(event, 'month');
                cell.appendChild(eventElement);
            });
            
            // Add "+X" indicator if needed
            if (remainingCount > 0) {
                const moreElement = document.createElement('div');
                moreElement.className = 'more-events';
                moreElement.textContent = `+${remainingCount}`;
                
                moreElement.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the cell's click event
                    // Show the day view for this date
                    const date = new Date(dateStr);
                    Calendar.showDay(date);
                });
                
                cell.appendChild(moreElement);
            }
        });
    }
    
    // Create an event DOM element
    function createEventElement(event, viewType = 'month') {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        
        // Check if it's an all-day event
        const isAllDay = isAllDayEvent(event);
        
        // Create event title and time elements
        const titleSpan = document.createElement('span');
        titleSpan.className = 'event-title';
        titleSpan.textContent = event.title;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'event-time';
        
        if (isAllDay) {
            timeSpan.textContent = 'All day';
        } else {
            // Format start and end times
            const startTime = event.start.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            const endTime = event.end.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            timeSpan.textContent = `${startTime} - ${endTime}`;
        }
        
        eventElement.appendChild(titleSpan);
        eventElement.appendChild(timeSpan);
        
        // Add event color based on role
        if (event.roleId) {
            const role = RoleManager.getRoleById(event.roleId);
            if (role) {
                eventElement.style.backgroundColor = role.color;
                eventElement.style.color = getContrastColor(role.color);
            }
        } else {
            // Default color for events without a role
            eventElement.style.backgroundColor = '#4285f4';
            eventElement.style.color = '#ffffff';
        }
        
        // Calculate position and height for day view
        if (viewType === 'day' && !isAllDay) {
            const startHour = event.start.getHours();
            const startMinutes = event.start.getMinutes();
            const endHour = event.end.getHours();
            const endMinutes = event.end.getMinutes();
            
            // Calculate duration in minutes
            const durationMinutes = (event.end - event.start) / (1000 * 60);
            
            // Calculate top position (offset from the start of the hour)
            const topOffset = (startMinutes / 60) * 60; // 60px per hour
            
            // Calculate height based on duration
            const height = (durationMinutes / 60) * 60; // 60px per hour
            
            // Apply positioning
            eventElement.style.position = 'absolute';
            eventElement.style.top = `${topOffset}px`;
            eventElement.style.height = `${Math.max(height, 20)}px`; // Minimum height of 20px
            eventElement.style.left = '0';
            eventElement.style.right = '0';
            eventElement.style.margin = '0 4px';
            eventElement.style.zIndex = '1';
        }
        
        // Add click event to open edit modal
        eventElement.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditEventModal(event.id);
        });
        
        return eventElement;
    }
    
    // Check if an event is an all-day event
    function isAllDayEvent(event) {
        // Get start and end times
        const startHour = event.start.getHours();
        const startMinutes = event.start.getMinutes();
        const endHour = event.end.getHours();
        const endMinutes = event.end.getMinutes();
        
        // Calculate duration in milliseconds
        const duration = event.end - event.start;
        const durationHours = duration / (1000 * 60 * 60);
        
        // Consider an event "all day" if:
        // 1. It starts at midnight (00:00) and ends at midnight or 23:59 of the same or another day
        // 2. It spans 23+ hours (nearly a full day or multiple days)
        return (
            // Starts at midnight (00:00)
            (startHour === 0 && startMinutes === 0 && 
             // Ends at 23:59 or 00:00 of any day
             ((endHour === 23 && endMinutes === 59) || (endHour === 0 && endMinutes === 0))) ||
            // Or spans at least 23 hours (nearly a full day or multiple days)
            durationHours >= 23
        );
    }
    
    // Filter events by the active role
    function filterEvents(eventsList) {
        if (activeRoleFilter === 'all') {
            return eventsList;
        }
        
        return eventsList.filter(event => event.roleId === activeRoleFilter);
    }
    
    // Filter events by role
    function filterEventsByRole(roleId) {
        activeRoleFilter = roleId;
        defaultRoleId = roleId; // Set the default role ID to match the active filter
        
        // Update the role filter dropdown UI to reflect the selected role
        const roleSelect = document.getElementById('role-select');
        roleSelect.value = roleId;
        
        // Refresh the current view to apply filter
        refreshCurrentView();
    }
    
    // Get event count for a specific month
    function getEventCountForMonth(year, month) {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        
        return filterEvents(events).filter(event => {
            return event.start >= startOfMonth && event.start <= endOfMonth;
        }).length;
    }
    
    // Populate the roles dropdown in the event form
    function populateRolesDropdown(selectedRoleId = '') {
        const roleSelect = document.getElementById('event-role');
        
        // Clear existing options except the first one
        while (roleSelect.options.length > 1) {
            roleSelect.remove(1);
        }
        
        // Add role options
        const roles = RoleManager.getAllRoles();
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            option.style.backgroundColor = role.color;
            option.style.color = getContrastColor(role.color);
            roleSelect.appendChild(option);
        });
        
        // Set selected role if provided, otherwise use the default role
        if (selectedRoleId) {
            roleSelect.value = selectedRoleId;
        } else if (defaultRoleId !== 'all') {
            roleSelect.value = defaultRoleId;
        }
    }
    
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    function formatDateTimeForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Get contrasting text color (black or white) based on background color
    function getContrastColor(hexColor) {
        // Remove # if present
        hexColor = hexColor.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black for bright colors, white for dark colors
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    // Refresh the current calendar view
    function refreshCurrentView() {
        const currentView = Calendar.getCurrentView();
        Calendar.switchView(currentView);
    }
    
    // Public API
    return {
        init,
        openAddEventModal,
        openEditEventModal,
        saveEvent,
        deleteEvent,
        renderEventsForDay,
        renderEventsForWeek,
        renderEventsForMonth,
        filterEventsByRole,
        getEventCountForMonth
    };
})(); 