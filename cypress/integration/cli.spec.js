context('Cli', () => {
  it('cy.exec() - execute a system command', () => {
    // https://on.cypress.io/exec

    cy.exec('yarn build code')
      .its('stdout')
      .should('contain', 'Done in');

    cy.exec('yarn build partials')
      .its('stdout')
      .should('contain', 'Done in');

    cy.exec('yarn build html')
      .its('stdout')
      .should('contain', 'Done in');

    cy.exec('yarn build')
      .its('stdout')
      .should('contain', 'Done in');

    cy.exec('yarn clean')
      .its('stdout')
      .should('contain', 'Done in');

    cy.exec('yarn lint')
      .its('stdout')
      .should('contain', 'Done in');
  });
});
