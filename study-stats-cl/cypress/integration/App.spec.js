describe ('Test App', () => {

    it ('launches', () => {
      cy.visit ('/');
    });

    it ('Shows Class Title', () => {
        cy.visit ('/');
        cy.get('[data-cy=class]').should('contain', 'Algorithms');
    });

    it('shows log when assignment is clicked', () => {
        cy.visit ('/');
        cy.get('[data-cy=class]').first().click();
        cy.get('[data-cy=submit]').click();
    });
  });