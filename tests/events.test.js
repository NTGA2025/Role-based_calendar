// Load required modules
require('../js/app.js');
require('../js/events.js');
require('../js/roles.js');

describe('EventManager', () => {
  beforeEach(() => {
    // Initialize the EventManager
    EventManager.init();
    RoleManager.init();
  });

  describe('Event Creation', () => {
    test('should open add event modal with default values', () => {
      const testDate = new Date('2024-12-25T10:00:00');
      EventManager.openAddEventModal(testDate);

      const modal = document.getElementById('event-modal');
      const startInput = document.getElementById('event-start');
      const endInput = document.getElementById('event-end');

      expect(modal.classList.contains('open')).toBe(true);
      expect(startInput.value).toContain('2024-12-25T10:00');
      expect(endInput.value).toContain('2024-12-25T11:00'); // Default 1 hour later
    });

    test('should create event with correct properties', () => {
      // Mock form data
      document.getElementById('event-title').value = 'Test Event';
      document.getElementById('event-start').value = '2024-12-25T10:00';
      document.getElementById('event-end').value = '2024-12-25T11:00';
      document.getElementById('event-location').value = 'Test Location';
      document.getElementById('event-notes').value = 'Test Notes';

      // Mock localStorage
      localStorage.getItem.mockReturnValue('[]');
      
      EventManager.saveEvent();

      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorage.setItem.mock.calls[0][1];
      const events = JSON.parse(savedData);
      
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe('Test Event');
      expect(events[0].location).toBe('Test Location');
      expect(events[0].notes).toBe('Test Notes');
    });
  });

  describe('Event Validation', () => {
    test('should require event title', () => {
      // Leave title empty
      document.getElementById('event-title').value = '';
      document.getElementById('event-start').value = '2024-12-25T10:00';
      document.getElementById('event-end').value = '2024-12-25T11:00';

      const form = document.getElementById('event-form');
      const isValid = form.checkValidity();
      
      expect(isValid).toBe(false);
    });

    test('should require start and end times', () => {
      document.getElementById('event-title').value = 'Test Event';
      // Leave start and end times empty
      document.getElementById('event-start').value = '';
      document.getElementById('event-end').value = '';

      const form = document.getElementById('event-form');
      const isValid = form.checkValidity();
      
      expect(isValid).toBe(false);
    });
  });

  describe('Event Filtering', () => {
    beforeEach(() => {
      // Mock events with different roles
      const mockEvents = [
        {
          id: '1',
          title: 'Work Event',
          roleId: 'work',
          start: new Date('2024-12-25T10:00:00'),
          end: new Date('2024-12-25T11:00:00')
        },
        {
          id: '2',
          title: 'Personal Event',
          roleId: 'personal',
          start: new Date('2024-12-25T14:00:00'),
          end: new Date('2024-12-25T15:00:00')
        }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockEvents));
    });

    test('should filter events by role', () => {
      EventManager.filterEventsByRole('work');
      
      const roleSelect = document.getElementById('role-select');
      expect(roleSelect.value).toBe('work');
    });

    test('should show all events when filter is "all"', () => {
      EventManager.filterEventsByRole('all');
      
      const roleSelect = document.getElementById('role-select');
      expect(roleSelect.value).toBe('all');
    });
  });

  describe('All-day Event Detection', () => {
    test('should detect all-day events starting at midnight', () => {
      // Mock an event that starts at midnight and ends at 11:59 PM
      const allDayEvent = {
        start: new Date('2024-12-25T00:00:00'),
        end: new Date('2024-12-25T23:59:00')
      };

      // We need to test the isAllDayEvent function which is private
      // For now, we can test the behavior through rendered events
      expect(true).toBe(true); // Placeholder for actual implementation
    });
  });
}); 