# Testing Guide for Offline Calendar App

This document provides comprehensive guidance on how to test your offline calendar application.

## Quick Start

### 1. Manual Testing
Start the local server and test manually:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### 2. Automated Testing
Install dependencies and run tests:
```bash
npm install
npm test                # Run unit tests
npm run test:coverage   # Run tests with coverage report
npm run e2e:open        # Open Cypress for interactive testing
npm run e2e             # Run Cypress tests headlessly
```

## Testing Approaches

### 1. Manual Testing Checklist

#### Core Functionality
- [ ] **Calendar Navigation**
  - Switch between Day, Week, Month views
  - Navigate using Previous/Next buttons
  - Click "Today" to return to current date
  - Verify date header updates correctly

- [ ] **Event Management**
  - Create new events via "+" button
  - Create events by clicking on time slots/days
  - Edit existing events by clicking on them
  - Delete events using delete button
  - Test all-day vs timed events
  - Verify event validation (required fields)

- [ ] **Role Management**
  - Create custom roles with different colors
  - Assign roles to events
  - Filter calendar view by role
  - Delete roles and verify event updates
  - Test role dropdown updates

- [ ] **Data Persistence**
  - Create events and refresh browser
  - Create roles and refresh browser
  - Verify localStorage contains data

- [ ] **Offline Functionality**
  - Disconnect internet (airplane mode)
  - Create/edit/delete events while offline
  - Navigate calendar views offline
  - Verify app continues to function

#### Cross-Browser Testing
Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test touch interactions
- [ ] Test PWA installation on mobile

#### Performance Testing
- [ ] Create 100+ events and test performance
- [ ] Test with multiple roles (10+)
- [ ] Test calendar navigation speed
- [ ] Check memory usage over time

### 2. Unit Testing

Unit tests are located in the `tests/` directory and test individual functions and modules:

#### What's Tested:
- **Utils functions**: Date formatting, validation, ID generation
- **EventManager**: Event creation, editing, deletion, filtering
- **RoleManager**: Role creation, deletion, retrieval
- **Calendar**: View switching, navigation, rendering

#### Running Unit Tests:
```bash
npm test                # Run once
npm run test:watch      # Watch mode for development
npm run test:coverage   # Generate coverage report
```

#### Test Structure:
```javascript
describe('ComponentName', () => {
  describe('FeatureName', () => {
    test('should do something specific', () => {
      // Test implementation
    });
  });
});
```

### 3. End-to-End Testing with Cypress

E2E tests simulate real user interactions and test the complete application flow.

#### Running E2E Tests:
```bash
# Interactive mode (recommended for development)
npm run e2e:open

# Headless mode (for CI/CD)
npm run e2e
```

#### Custom Cypress Commands:
```javascript
cy.clearCalendarData()                    // Clear localStorage
cy.createEvent(eventData)                 // Create an event
cy.createRole(name, color)                // Create a role
cy.switchView('day|week|month')           // Switch calendar view
cy.navigateCalendar('prev|next')          // Navigate calendar
cy.goToToday()                           // Return to today
cy.waitForCalendar()                     // Wait for calendar render
```

#### E2E Test Coverage:
- App loading and initialization
- Calendar navigation and view switching
- Event creation, editing, deletion
- Role management
- Offline functionality
- PWA features

### 4. Performance Testing

#### Lighthouse Testing:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:8000 --output html --output-path ./lighthouse-report.html
```

Key metrics to monitor:
- Performance score > 90
- Accessibility score > 95
- Best Practices score > 90
- SEO score > 90
- PWA score > 90

#### Load Testing:
Create test data for performance testing:
```javascript
// Create 500 events for testing
function createTestEvents() {
  const events = [];
  for (let i = 0; i < 500; i++) {
    events.push({
      id: `test-${i}`,
      title: `Test Event ${i}`,
      start: new Date(2024, 0, 1 + (i % 365)),
      end: new Date(2024, 0, 1 + (i % 365)),
      roleId: ['work', 'personal', 'family'][i % 3]
    });
  }
  localStorage.setItem('calendar_events', JSON.stringify(events));
}
```

## Testing Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Test one thing per test case
- Use beforeEach/afterEach for setup/cleanup

### 2. Test Data Management
- Use factories for creating test data
- Clear data between tests
- Use realistic test data
- Test edge cases and boundary conditions

### 3. Assertions
- Use specific assertions
- Test both positive and negative cases
- Verify UI state changes
- Check data persistence

### 4. Debugging Tests
```bash
# Debug Jest tests
npm test -- --verbose

# Debug Cypress tests
npm run e2e:open  # Use interactive mode
```

## Common Issues and Solutions

### 1. localStorage Mocking
```javascript
// Mock localStorage in Jest tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### 2. Date Testing
```javascript
// Mock Date for consistent testing
const mockDate = new Date('2024-12-25T10:00:00');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
```

### 3. DOM Testing
```javascript
// Ensure DOM elements exist before testing
const element = document.getElementById('test-element');
expect(element).toBeTruthy();
```

## Continuous Integration

### GitHub Actions Example:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run e2e
```

## Coverage Goals

Aim for the following coverage targets:
- **Unit Tests**: > 80% code coverage
- **E2E Tests**: Cover all critical user paths
- **Manual Tests**: Cover all browser/device combinations

## Reporting Issues

When reporting bugs found during testing:
1. Include steps to reproduce
2. Specify browser/device
3. Include console errors
4. Provide screenshots/videos
5. Note expected vs actual behavior

## Test Maintenance

- Review and update tests when adding features
- Remove obsolete tests
- Refactor tests to reduce duplication
- Keep test documentation current
- Monitor test execution time 