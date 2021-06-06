// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { CyHttpMessages } from 'cypress/types/net-stubbing';

function hasOperation(req: CyHttpMessages.IncomingHttpRequest, operationName: string) {
  const { body } = req;
  return 'operationName' in body && body.operationName === operationName;
}

Cypress.Commands.add('interceptGraphQL', (operations: string[], prefix = 'gql') => {
  return cy.intercept('POST', '/api/graphql', (req) => {
    for (let operation of operations) {
      if (hasOperation(req, operation)) req.alias = 'gql' + operation;
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Intercept request to graphql endpoint (/api/graphql) and alias the given
       * operations.
       * @link https://docs.cypress.io/guides/testing-strategies/working-with-graphql
       *
       * @example
       * cy.interceptGraphQL(['ListRetreats']);
       *
       * cy.wait('@gqlListRetreats')
       *   .its('response.body.data.retreats.items')
       *   .should('have.length', 5)
       *
       * @param operations Operation names to alias
       * @param prefix Optional. Prefix before operation names. Defaults to 'gql'
       */
      interceptGraphQL(operations: string[], prefix?: string): Chainable<null>;
    }
  }
}
