//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import SignIn from "./SignIn";
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//setting up the mock server
const server = setupServer(
  rest.post("/user/user-login", (req, res, ctx) => {
    return res(ctx.status(404, "Email or password are not correct"));
  })
);
//-----------------------------------------------------------------------------
//-------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

describe("Testing SignIn component", () => {
  test('It should display "Enter your email address" and "Enter your password"', () => {
    //renderring the component
    render(<SignIn />);
    //clicking the sign in button
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    //assertions
    expect(screen.getByText("Enter your email address")).toBeVisible();
    expect(screen.getByText("Enter your password")).toBeVisible();
  });
  //----------------------------------------------------

  test('It should display "Error: Email or password are not correct"', () => {
    //rendering the component
    render(<SignIn />);
    //filling the text inputs with wrong data
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "blabla@bla.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "blablabla" },
    });
    //clicking the sign in button
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    //assertions
    expect(
      screen.getByText("Error: Email or password are not correct")
    ).toBeVisible();
  });
  //--------------------------------------------------------------------
});
//-----------------------------------------------------------------------------
//----------------------------------------------------------------------------
