
describe('registration', () => {
  it('Click Register Link and Complete Registration Form.', () => {
    cy.visit('/');
    cy.get('a[href="register.htm"]').click();
    cy.fixture('registration').then((data) => {
    data.userName = Date.now();
    cy.get('#customer.firstName').type(data.firstName);
    cy.get('#customer.lastName').type(data.lastName);
    cy.get('#customer.address.street').type(data.address);
    cy.get('#customer.address.city').type(data.city);
    cy.get('#customer.address.state').type(data.state);
    cy.get('#customer.address.zipCode').type(data.zipCode);
    cy.get('#customer.phoneNumber').type(data.phoneNumber);
    cy.get('#customer.ssn').type(data.ssn);
    cy.get('#customer.username').type(data.userName);
    cy.get('#customer.password').type(data.password);
    cy.get('#repeatedPassword').type(data.password);
    cy.get('[class="button"][value="Register"]').click();
    cy.get('[class="title"]').should('contain','Welcome ' + data.userName);
    cy.get('#rightPanel p').should('contain', 'Your account was created successfully. You are now logged in.');
    })
  })
});

// Make Login with newly created registration username and password.