context('Retreats List', () => {
  beforeEach(() => {
    cy.login();
  });

  it('is possible to search retreats', () => {
    cy.interceptGraphQL(['ListRetreats']);
    cy.visit('/admin/retreater');

    cy.findByLabelText('Sök retreater').type('vitae');
    cy.findByRole('button', { name: 'Sök' }).click();

    cy.wait('@gqlListRetreats').its('request.body.variables.search').should('equal', 'vitae');
    cy.location('search').should('include', 'search=vitae');

    cy.findByLabelText('Sök retreater').clear();
    cy.location('search').should('not.include', 'search=vitae');
  });
});
