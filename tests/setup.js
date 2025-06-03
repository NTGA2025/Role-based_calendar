// Jest setup file
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup DOM structure that the app expects
beforeEach(() => {
  document.body.innerHTML = `
    <div class="app-container">
      <header class="app-header">
        <div class="header-left">
          <div class="date-navigation">
            <button id="prev-btn">&lt;</button>
            <button id="today-btn">Today</button>
            <button id="next-btn">&gt;</button>
          </div>
          <div id="current-date">December 2024</div>
        </div>
        <div class="header-right">
          <div class="view-selector">
            <button id="day-view" class="view-btn">Day</button>
            <button id="week-view" class="view-btn">Week</button>
            <button id="month-view" class="view-btn active">Month</button>
          </div>
          <select id="role-select">
            <option value="all">All Events</option>
          </select>
          <button id="manage-roles-btn">Manage Roles</button>
          <button id="add-event-btn">+</button>
        </div>
      </header>
      <main id="calendar-container"></main>
      
      <!-- Event Modal -->
      <div id="event-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Add Event</h2>
            <button class="close-modal">&times;</button>
          </div>
          <form id="event-form">
            <input type="text" id="event-title" placeholder="Event Title" required>
            <input type="datetime-local" id="event-start" required>
            <input type="datetime-local" id="event-end" required>
            <input type="text" id="event-location" placeholder="Location">
            <textarea id="event-notes" placeholder="Notes"></textarea>
            <select id="event-role">
              <option value="">No Role</option>
            </select>
            <div class="modal-actions">
              <button type="button" id="delete-event" class="delete-btn">Delete</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Role Management Modal -->
      <div id="role-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Manage Roles</h2>
            <button class="close-modal">&times;</button>
          </div>
          <div id="roles-list"></div>
          <form id="add-role-form">
            <input type="text" id="role-name" placeholder="Role Name" required>
            <input type="color" id="role-color" value="#4285f4">
            <button type="submit">Add Role</button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Clear localStorage before each test
  localStorage.clear();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
}); 