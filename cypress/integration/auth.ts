describe('auth', () => {
  it('is not possible to reach admin without signing in', () => {
    cy.visit('/admin');
    cy.findByText('Redirecting...');
  });

  it('is possible to view auth pages after signing in', () => {
    cy.login();
    cy.visit('/admin');
    cy.findByText('Dashboard').should('exist');
  });
});
