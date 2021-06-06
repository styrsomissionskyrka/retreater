beforeEach(() => {
  cy.login();
  cy.visit('/admin/retreater');
});

it('resets page query when page is 1', () => {
  cy.findByRole('link', { name: 'Nästa' }).click();
  cy.location('search').should('include', 'page=2');

  cy.findByRole('link', { name: 'Föregående' }).click();
  cy.location('search').should('not.include', 'page=1');
});
