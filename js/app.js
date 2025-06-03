// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calendar
    Calendar.init();
    
    // Initialize events
    EventManager.init();
    
    // Initialize roles
    RoleManager.init();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Show current month view by default
    Calendar.showMonth(new Date());
});

// Set up event listeners for UI interactions
function setupEventListeners() {
    // View navigation buttons
    document.querySelectorAll('.view-selector button').forEach(button => {
        button.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            setActiveView(view);
            Calendar.switchView(view);
        });
    });
    
    // Today button
    document.getElementById('today-btn').addEventListener('click', () => {
        Calendar.goToToday();
    });
    
    // Previous and next buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        Calendar.previous();
    });
    
    document.getElementById('next-btn').addEventListener('click', () => {
        Calendar.next();
    });
    
    // Add event button
    document.getElementById('add-event-btn').addEventListener('click', () => {
        EventManager.openAddEventModal();
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('open');
            });
        });
    });
    
    // Modal background click to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });
    
    // Event form submission
    document.getElementById('event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        EventManager.saveEvent();
    });
    
    // Delete event button
    document.getElementById('delete-event').addEventListener('click', () => {
        EventManager.deleteEvent();
    });
    
    // Role filter dropdown
    document.getElementById('role-select').addEventListener('change', (e) => {
        const roleId = e.target.value;
        EventManager.filterEventsByRole(roleId);
    });
    
    // Manage roles button
    document.getElementById('manage-roles-btn').addEventListener('click', () => {
        RoleManager.openRoleModal();
    });
    
    // Add role form submission
    document.getElementById('add-role-form').addEventListener('submit', (e) => {
        e.preventDefault();
        RoleManager.addRole();
    });
}

// Set active view in the view selector
function setActiveView(view) {
    document.querySelectorAll('.view-selector button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.view-selector button[data-view="${view}"]`).classList.add('active');
}

// Helper functions
const Utils = {
    // Format date as YYYY-MM-DD
    formatDate(date) {
        return date.toISOString().split('T')[0];
    },
    
    // Normalize date by setting time to midnight (00:00:00)
    normalizeDate(date) {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    },
    
    // Format date for display (e.g., "June 2025")
    formatMonthYear(date) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    
    // Format time for display (e.g., "3:30 PM")
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    },
    
    // Generate a unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    // Check if date is today
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    },
    
    // Parse date string to Date object
    parseDate(dateString) {
        return new Date(dateString);
    }
}; 