import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the App component div", () => {
  render(<App />);
  const AppDiv = screen.getByTestId("App-div");
  expect(AppDiv).toBeInTheDocument();
});
