import React from "react";

import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText, 
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"))

    expect(getByText("Leopold Silvers").toBeInTheDocument)
      
  });

  it("loads data, books and interview and reduces the spots remaining for the first day by 1", async () => {
    // Render container
    const { container } = render(<Application />);

    // Wait for DOM to load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Find appointments using test ID
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    // User interactions 
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText(appointment, "Save"));
    
    // Wait for Saving to finish
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    // Find Monday in day list
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    // Check that Monday states no spots remaining
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

  });
});