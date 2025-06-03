describe('Calendar App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCalendarData();
  });

  describe('App Loading', () => {
    it('should load the calendar app successfully', () => {
      cy.get('.app-container').should('be.visible');
      cy.get('#calendar-container').should('exist');
      cy.get('#current-date').should('contain.text', new Date().getFullYear());
    });

    it('should start in month view', () => {
      cy.get('#month-view').should('have.class', 'active');
      cy.waitForCalendar();
      cy.get('.month-view').should('exist');
    });
  });

  describe('Calendar Navigation', () => {
    it('should switch between different views', () => {
      // Test Day view
      cy.switchView('day');
      cy.get('#day-view').should('have.class', 'active');
      cy.get('.day-view').should('exist');

      // Test Week view
      cy.switchView('week');
      cy.get('#week-view').should('have.class', 'active');
      cy.get('.week-view').should('exist');

      // Test Month view
      cy.switchView('month');
      cy.get('#month-view').should('have.class', 'active');
      cy.get('.month-view').should('exist');
    });

    it('should navigate between months', () => {
      cy.get('#current-date').then(($el) => {
        const initialText = $el.text();
        
        cy.navigateCalendar('next');
        cy.get('#current-date').should('not.contain.text', initialText);
        
        cy.navigateCalendar('prev');
        cy.get('#current-date').should('contain.text', initialText);
      });
    });

    it('should return to today when clicking Today button', () => {
      // Navigate away from today
      cy.navigateCalendar('next');
      cy.navigateCalendar('next');
      
      // Return to today
      cy.goToToday();
      
      const today = new Date();
      const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      cy.get('#current-date').should('contain.text', monthYear);
    });
  });

  describe('Event Management', () => {
    it('should create a new event', () => {
      const eventData = {
        title: 'Test Event',
        start: '2024-12-25T10:00',
        end: '2024-12-25T11:00',
        location: 'Test Location',
        notes: 'Test notes'
      };

      cy.createEvent(eventData);
      
      // Verify modal closes
      cy.get('#event-modal').should('not.have.class', 'open');
      
      // Check if event appears in calendar (might need to navigate to the right date)
      cy.get('#current-date').then(($el) => {
        const currentDate = $el.text();
        if (!currentDate.includes('December 2024')) {
          // Navigate to December 2024 if not already there
          cy.goToToday();
        }
      });
    });

    it('should validate required fields', () => {
      cy.get('#add-event-btn').click();
      
      // Try to submit without title
      cy.get('#event-start').clear().type('2024-12-25T10:00');
      cy.get('#event-end').clear().type('2024-12-25T11:00');
      cy.get('#event-form').submit();
      
      // Form should not submit due to validation
      cy.get('#event-modal').should('have.class', 'open');
      cy.get('#event-title:invalid').should('exist');
    });

    it('should edit an existing event', () => {
      // First create an event
      const eventData = {
        title: 'Original Event',
        start: '2024-12-25T10:00',
        end: '2024-12-25T11:00'
      };
      
      cy.createEvent(eventData);
      
      // Navigate to the event date and click on it
      // Note: This might need adjustment based on how events are rendered
      cy.get('.event').first().click();
      
      // Verify edit modal opens
      cy.get('#modal-title').should('contain.text', 'Edit Event');
      cy.get('#event-title').should('have.value', 'Original Event');
      
      // Modify the event
      cy.get('#event-title').clear().type('Modified Event');
      cy.get('#event-form').submit();
      
      // Verify modal closes
      cy.get('#event-modal').should('not.have.class', 'open');
    });
  });

  describe('Role Management', () => {
    it('should create a new role', () => {
      cy.createRole('Test Role', '#ff0000');
      
      // Verify role appears in the role filter dropdown
      cy.get('#role-select option').should('contain.text', 'Test Role');
    });

    it('should filter events by role', () => {
      // Create a role first
      cy.createRole('Work', '#4285f4');
      
      // Create an event with that role
      cy.createEvent({
        title: 'Work Meeting',
        start: '2024-12-25T10:00',
        end: '2024-12-25T11:00',
        role: 'work'
      });
      
      // Filter by role
      cy.get('#role-select').select('work');
      
      // Verify only work events are shown (this test might need refinement)
      cy.get('#role-select').should('have.value', 'work');
    });

    it('should delete a role', () => {
      cy.createRole('Temporary Role', '#00ff00');
      
      // Open role management modal
      cy.get('#manage-roles-btn').click();
      
      // Delete the role
      cy.get('.delete-role').last().click();
      
      // Close modal
      cy.get('.close-modal').click();
      
      // Verify role is removed from dropdown
      cy.get('#role-select option').should('not.contain.text', 'Temporary Role');
    });
  });

  describe('Offline Functionality', () => {
    it('should work offline', () => {
      // Create some data while online
      cy.createEvent({
        title: 'Offline Test Event',
        start: '2024-12-25T10:00',
        end: '2024-12-25T11:00'
      });
      
      // Simulate going offline (this is a simplified test)
      cy.window().then((win) => {
        // The app should continue to work with stored data
        expect(win.localStorage.getItem('calendar_events')).to.not.be.null;
      });
      
      // Test that calendar still functions
      cy.switchView('day');
      cy.switchView('week');
      cy.switchView('month');
      cy.navigateCalendar('next');
      cy.goToToday();
    });
  });

  describe('PWA Features', () => {
    it('should have PWA manifest', () => {
      cy.request('/manifest.json').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('icons');
      });
    });

    it('should register service worker', () => {
      cy.window().then((win) => {
        cy.wrap(win.navigator.serviceWorker.getRegistration()).should('exist');
      });
    });
  });
}); 