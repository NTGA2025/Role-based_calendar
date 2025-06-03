// Load the Utils module
require('../js/app.js');

describe('Utils', () => {
  describe('formatDate', () => {
    test('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-12-25T10:30:00');
      expect(Utils.formatDate(date)).toBe('2024-12-25');
    });

    test('should handle different months and days', () => {
      const date = new Date('2024-01-05T00:00:00');
      expect(Utils.formatDate(date)).toBe('2024-01-05');
    });
  });

  describe('normalizeDate', () => {
    test('should set time to midnight', () => {
      const date = new Date('2024-12-25T15:30:45');
      const normalized = Utils.normalizeDate(date);
      
      expect(normalized.getHours()).toBe(0);
      expect(normalized.getMinutes()).toBe(0);
      expect(normalized.getSeconds()).toBe(0);
      expect(normalized.getMilliseconds()).toBe(0);
    });

    test('should preserve the date part', () => {
      const date = new Date('2024-12-25T15:30:45');
      const normalized = Utils.normalizeDate(date);
      
      expect(normalized.getFullYear()).toBe(2024);
      expect(normalized.getMonth()).toBe(11); // December is month 11
      expect(normalized.getDate()).toBe(25);
    });
  });

  describe('formatTime', () => {
    test('should format time in 12-hour format', () => {
      const date = new Date('2024-12-25T15:30:00');
      const formatted = Utils.formatTime(date);
      expect(formatted).toMatch(/3:30 PM/);
    });

    test('should handle AM times', () => {
      const date = new Date('2024-12-25T09:15:00');
      const formatted = Utils.formatTime(date);
      expect(formatted).toMatch(/9:15 AM/);
    });
  });

  describe('isToday', () => {
    test('should return true for today\'s date', () => {
      const today = new Date();
      expect(Utils.isToday(today)).toBe(true);
    });

    test('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(Utils.isToday(yesterday)).toBe(false);
    });

    test('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(Utils.isToday(tomorrow)).toBe(false);
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    test('should generate non-empty strings', () => {
      const id = Utils.generateId();
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('parseDate', () => {
    test('should parse date strings correctly', () => {
      const dateString = '2024-12-25';
      const parsed = Utils.parseDate(dateString);
      
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(11); // December is month 11
      expect(parsed.getDate()).toBe(25);
    });
  });
}); 