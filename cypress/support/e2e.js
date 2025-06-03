// Custom commands for calendar testing

Cypress.Commands.add('clearCalendarData', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

Cypress.Commands.add('createEvent', (eventData) => {
  cy.get('#add-event-btn').click();
  cy.get('#event-title').type(eventData.title);
  cy.get('#event-start').clear().type(eventData.start);
  cy.get('#event-end').clear().type(eventData.end);
  
  if (eventData.location) {
    cy.get('#event-location').type(eventData.location);
  }
  
  if (eventData.notes) {
    cy.get('#event-notes').type(eventData.notes);
  }
  
  if (eventData.role) {
    cy.get('#event-role').select(eventData.role);
  }
  
  cy.get('#event-form').submit();
});

Cypress.Commands.add('createRole', (roleName, color = '#4285f4') => {
  cy.get('#manage-roles-btn').click();
  cy.get('#role-name').type(roleName);
  cy.get('#role-color').invoke('val', color).trigger('change');
  cy.get('#add-role-form').submit();
  cy.get('.close-modal').click();
});

Cypress.Commands.add('switchView', (view) => {
  cy.get(`#${view}-view`).click();
});

Cypress.Commands.add('navigateCalendar', (direction) => {
  cy.get(`#${direction}-btn`).click();
});

Cypress.Commands.add('goToToday', () => {
  cy.get('#today-btn').click();
});

// Wait for calendar to be fully rendered
Cypress.Commands.add('waitForCalendar', () => {
  cy.get('#calendar-container').should('exist');
  cy.get('.month-view, .week-view, .day-view').should('exist');
}); 