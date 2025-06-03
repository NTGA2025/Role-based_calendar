// Load required modules
require('../js/app.js');
require('../js/calendar.js');

describe('Calendar', () => {
  beforeEach(() => {
    Calendar.init();
  });

  describe('Calendar Initialization', () => {
    test('should initialize with current date', () => {
      const currentDate = Calendar.getCurrentDate();
      const today = new Date();
      
      expect(currentDate.getDate()).toBe(today.getDate());
      expect(currentDate.getMonth()).toBe(today.getMonth());
      expect(currentDate.getFullYear()).toBe(today.getFullYear());
    });

    test('should start with month view', () => {
      const currentView = Calendar.getCurrentView();
      expect(currentView).toBe('month');
    });
  });

  describe('View Switching', () => {
    test('should switch to day view', () => {
      Calendar.switchView('day');
      
      const currentView = Calendar.getCurrentView();
      expect(currentView).toBe('day');
      
      const container = document.getElementById('calendar-container');
      expect(container.innerHTML).toContain('day-view');
    });

    test('should switch to week view', () => {
      Calendar.switchView('week');
      
      const currentView = Calendar.getCurrentView();
      expect(currentView).toBe('week');
      
      const container = document.getElementById('calendar-container');
      expect(container.innerHTML).toContain('week-view');
    });

    test('should switch to month view', () => {
      Calendar.switchView('month');
      
      const currentView = Calendar.getCurrentView();
      expect(currentView).toBe('month');
      
      const container = document.getElementById('calendar-container');
      expect(container.innerHTML).toContain('month-view');
    });

    test('should default to month view for invalid view', () => {
      Calendar.switchView('invalid');
      
      const currentView = Calendar.getCurrentView();
      expect(currentView).toBe('month');
    });
  });

  describe('Navigation', () => {
    test('should navigate to previous day in day view', () => {
      Calendar.switchView('day');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.previous();
      
      const newDate = Calendar.getCurrentDate();
      expect(newDate.getDate()).toBe(initialDate.getDate() - 1);
    });

    test('should navigate to next day in day view', () => {
      Calendar.switchView('day');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.next();
      
      const newDate = Calendar.getCurrentDate();
      expect(newDate.getDate()).toBe(initialDate.getDate() + 1);
    });

    test('should navigate to previous week in week view', () => {
      Calendar.switchView('week');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.previous();
      
      const newDate = Calendar.getCurrentDate();
      const expectedDate = new Date(initialDate);
      expectedDate.setDate(expectedDate.getDate() - 7);
      
      expect(newDate.getDate()).toBe(expectedDate.getDate());
    });

    test('should navigate to next week in week view', () => {
      Calendar.switchView('week');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.next();
      
      const newDate = Calendar.getCurrentDate();
      const expectedDate = new Date(initialDate);
      expectedDate.setDate(expectedDate.getDate() + 7);
      
      expect(newDate.getDate()).toBe(expectedDate.getDate());
    });

    test('should navigate to previous month in month view', () => {
      Calendar.switchView('month');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.previous();
      
      const newDate = Calendar.getCurrentDate();
      expect(newDate.getMonth()).toBe(initialDate.getMonth() - 1);
    });

    test('should navigate to next month in month view', () => {
      Calendar.switchView('month');
      const initialDate = new Date(Calendar.getCurrentDate());
      
      Calendar.next();
      
      const newDate = Calendar.getCurrentDate();
      expect(newDate.getMonth()).toBe(initialDate.getMonth() + 1);
    });
  });

  describe('Today Navigation', () => {
    test('should return to today from any date', () => {
      // Navigate to a different month
      Calendar.previous();
      Calendar.previous();
      
      // Go back to today
      Calendar.goToToday();
      
      const currentDate = Calendar.getCurrentDate();
      const today = new Date();
      
      expect(currentDate.getDate()).toBe(today.getDate());
      expect(currentDate.getMonth()).toBe(today.getMonth());
      expect(currentDate.getFullYear()).toBe(today.getFullYear());
    });
  });

  describe('Month View Structure', () => {
    test('should create month grid with day cells', () => {
      Calendar.switchView('month');
      
      const container = document.getElementById('calendar-container');
      const monthView = container.querySelector('.month-view');
      const dayCells = monthView.querySelectorAll('.day-cell');
      
      expect(monthView).toBeTruthy();
      expect(dayCells.length).toBe(42); // 6 rows × 7 days
    });

    test('should highlight today in month view', () => {
      Calendar.goToToday();
      Calendar.switchView('month');
      
      const container = document.getElementById('calendar-container');
      const todayCell = container.querySelector('.day-cell.today');
      
      expect(todayCell).toBeTruthy();
    });
  });

  describe('Week View Structure', () => {
    test('should create week grid with correct structure', () => {
      Calendar.switchView('week');
      
      const container = document.getElementById('calendar-container');
      const weekView = container.querySelector('.week-view');
      const daysHeader = weekView.querySelector('.days-header');
      const dayHeaders = daysHeader.querySelectorAll('.day-header');
      
      expect(weekView).toBeTruthy();
      expect(dayHeaders.length).toBe(7); // 7 days in a week
    });
  });

  describe('Day View Structure', () => {
    test('should create day view with timeline', () => {
      Calendar.switchView('day');
      
      const container = document.getElementById('calendar-container');
      const dayView = container.querySelector('.day-view');
      const timeline = dayView.querySelector('.timeline');
      const allDaySection = dayView.querySelector('.all-day-section');
      
      expect(dayView).toBeTruthy();
      expect(timeline).toBeTruthy();
      expect(allDaySection).toBeTruthy();
    });
  });
}); 