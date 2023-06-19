describe("Appointment", () => {
  xit("should book an interview", () => {
    // resets database
    cy.request("GET", "/api/debug/reset")

    // Visits the root of our web server
    cy.visit("/");
    cy.contains('Monday')

    // Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add")
      .first()
      .click();

    // enters their name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // selects an interviewer
    cy.get("[alt='Sylvia Palmer']").click();

    // clicks the save button
    cy.contains('Save').click();

    // sees the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  xit("should edit an interview", () => {
    // resets database
    cy.request("GET", "/api/debug/reset");

    // visits the root of our server
    cy.visit("/");

    // reveals and clicks the edit button for the existing appointment
    cy.get('[alt="Edit"]')
      .invoke('show')
      .click();

    // changes the interviewer
    cy.get('[alt="Tori Malcolm"')
      .click();

    // changes the student name
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");

    // clicks the save button
    cy.contains('Save').click();

    // sees the edits to the appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  });

  it("should cancel an interview", () => {
    // resets database
    cy.request("GET", "/api/debug/reset")

    // Visits the root of our web server
    cy.visit("/");

    // Sees that the appointment slot is filled and day only has 1 spot
    cy.contains('Archie Cohen');
    cy.contains('Sylvia Palmer');
    cy.contains('.day-list__item--selected', "1 spot remaining")

    // reveals and clicks the delete button for the existing appointment
    cy.get('[alt="Delete"]')
    .invoke('show')
    .click();

    // Clicks the confirm button
    cy.contains('Confirm').click();

    // Sees that 2 spots are free to confirm that appointment is deleted
    cy.contains('.day-list__item--selected', "2 spots remaining")
  });
});