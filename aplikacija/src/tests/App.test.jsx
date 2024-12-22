import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

// Mock komponent
jest.mock("../components/Header", () => () => <div>Header</div>);
jest.mock("../components/EmployeeEntryForm", () => () => <div>EmployeeEntryForm</div>);
jest.mock("../components/EditEntryForm", () => () => <div>EditEntryForm</div>);
jest.mock("../components/LoginForm", () => ({ onLogin }) => (
  <div>
    <button onClick={onLogin}>Login</button>
  </div>
));
jest.mock("../components/EmployeeHoursTable", () => () => <div>EmployeeHoursTable</div>);
jest.mock("../components/Overview", () => () => <div>Overview</div>);

describe("App", () => {
  it("na zacetku prikaze login view", () => {
    render(<App />); 

    const loginButton = screen.getByText("Login");
    expect(loginButton).not.toBeNull();
  });

  it("po loginu preusmeritev na employee stran", async () => {
    render(<App />); 

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      const employeeEntryForm = screen.queryByText("EmployeeEntryForm");
      expect(employeeEntryForm).not.toBeNull();
    });
  });

 
  

  
});
