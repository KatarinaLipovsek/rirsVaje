import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import EditEntryForm from "../components/EditEntryForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("axios");

describe("EditEntryForm ", () => {
  const mockEntryData = {
    hoursWorked: "8",
    date: "2024-12-01",
    description: "Worked on project",
  };

  const entryId = "123";

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockEntryData });
    axios.put.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("prikaže vnosna okna in podatke", async () => {
    render(<EditEntryForm entryId={entryId} />);

    await waitFor(() => {
      const hoursWorkedField = screen.getByLabelText(/Oddelane ure/i);
      const dateField = screen.getByLabelText(/Datum/i);
      const descriptionField = screen.getByLabelText(/Opombe/i);

      expect(hoursWorkedField.value).toEqual(mockEntryData.hoursWorked);
      expect(dateField.value).toEqual(mockEntryData.date);
      expect(descriptionField.value).toEqual(mockEntryData.description);
    });
  });

  const theme = createTheme();

  test("gumb shrani primary barve", () => {
    render(
      <ThemeProvider theme={theme}>
        <EditEntryForm entryId={entryId} />
      </ThemeProvider>
    );

    const button = screen.getByText(/Shrani/i);

    const buttonStyle = window.getComputedStyle(button);

    expect(buttonStyle.backgroundColor).toBe("rgb(25, 118, 210)"); 
  });
});
