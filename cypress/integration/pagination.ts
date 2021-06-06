beforeEach(() => {
  cy.login();
  cy.visit('/admin');
});

it('works', () => {
  cy.findByRole('link', { name: 'Retreater' }).click();
  cy.location('pathname').should('equal', '/admin/retreater');
});
