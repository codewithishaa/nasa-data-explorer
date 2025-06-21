import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders NASA Data Explorer title", async () => {
  render(<App />);
  const heading = await screen.findByText(/NASA Data Explorer/i);
  expect(heading).toBeInTheDocument();
});
