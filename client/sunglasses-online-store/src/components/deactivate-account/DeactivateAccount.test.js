//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import DeactivateAccount from "./DeactivateAccount";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.delete("/user/delete_user", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/user/check_password", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ check_password: true }));
  })
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing DeactivateAccount component", () => {
  test("Testing the component when the password input field is empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <DeactivateAccount />
      </BrowserRouter>
    );
    //clicking the deactivate account button
    fireEvent.click(
      screen.getByRole("button", { name: /deactivate account/i })
    );
    //assertions
    expect(screen.getByLabelText("Enter your password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when assuming that the entered password is wrong", () => {
    //modifying the mock server method to return an error
    server.use(
      rest.get("/user/check_password", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ check_password: false }));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <DeactivateAccount />
      </BrowserRouter>
    );
    //writing password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "qwertY7," },
    });
    //clicking the deactivate account button
    fireEvent.click(
      screen.getByRole("button", { name: /deactivate account/i })
    );
    //assertions
    expect(screen.getByLabelText("Incorrect password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", () => {
    //modifying the mock server method to return an error
    server.use(
      rest.delete("/user/delete_user", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <DeactivateAccount />
      </BrowserRouter>
    );
    //writing password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "qwertY7," },
    });
    //clicking the deactivate account button
    fireEvent.click(
      screen.getByRole("button", { name: /deactivate account/i })
    );
    //clicking the yes button in the pop up
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
