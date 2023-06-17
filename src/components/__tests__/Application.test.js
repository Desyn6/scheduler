import React from "react";

import { 
  render, 
  cleanup, 
  waitForElement, 
  waitForElementToBeRemoved,
  fireEvent, 
  getByText, 
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

beforeEach(cleanup);
afterEach(cleanup);

import axios from "axios";

import Application from "components/Application";

describe("Application", () => {

  /* Test number four */
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application/>);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Check inititial number of free spots
    const dayInit = getAllByTestId(container, "day")
      .find(dayInit => queryByText(dayInit, "Monday"));

    expect(getByText(dayInit, /1 spot remaining/i)).toBeInTheDocument();

    // 4. Click the "Edit" button.
    fireEvent.click(getByAltText(container, "Edit"))

    // 5. Input new student name and select different interviewer.
    fireEvent.change(getByPlaceholderText(container, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.change(getByAltText(container, "Sylvia Palmer"))

    // 6. Click the "Save" button.
    fireEvent.click(container, "Save");

    // 7. Check that the number of spots for dayListItem "Monday" is unchanged with the value from step 3.
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });
  
  /* Test number one */
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"))

    expect(getByText("Leopold Silvers").toBeInTheDocument)
      
  });

    /* Test number two */
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

    /* test number six */
  it("shows the save error when failing to save an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // Render container
    const { container } = render(<Application />);

    // Wait for DOM to load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Find appointments using test ID
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    // User interactions 
    // 3. Click the "delete"
    fireEvent.click(getByAltText(container, "Delete"));

    // 4 Check that the confirmation message is shown.
    expect(getByText(container, /are you sure you would like to delete/i)).toBeInTheDocument();

    // 5. Click the "confirm" button
    fireEvent.click(getByText(container, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(container, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the text "Deleting" is no longer displayed
    await waitForElementToBeRemoved(() => getByText(container, "Deleting"));

    expect(getByText(container, /Could not cancel appointment/i))
      .toBeInTheDocument();
  });

  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // Render container
    const { container } = render(<Application />);

    // Wait for DOM to load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Find appointments using test ID
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    // Click the "Add" button
    fireEvent.click(getByAltText(appointment, "Add"));

    // Input student name and select interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // Check that "Saving" is displayed
    expect(getByText(container, /saving/i));

    // Wait for "Saving" to disappear
    await waitForElementToBeRemoved(() => getByText(container, "Saving"));

    // Check for unable to save dialogue
    expect(getByText(container, /Could not save appointment/i))
      .toBeInTheDocument();
  });

  /* Test number three */
  it("loads data, delete interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "delete"
    fireEvent.click(getByAltText(container, "Delete"));

    // 4 Check that the confirmation message is shown.
    expect(getByText(container, /are you sure you would like to delete/i)).toBeInTheDocument();

    // 5. Click the "confirm" button
    fireEvent.click(getByText(container, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(container, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the text "Deleting" is no longer displayed
    await waitForElementToBeRemoved(() => getByText(container, "Deleting"));

    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });
});