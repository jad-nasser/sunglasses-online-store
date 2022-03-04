//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import SignIn from "./SignIn";
import { BrowserRouter } from "react-router-dom";
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//setting up the mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "user/user_login",
    (req, res, ctx) => {
      return res(
        ctx.status(404),
        ctx.json("Email or password are not correct")
      );
    }
  )
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
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    //clicking the sign in button
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    //assertions
    expect(screen.getByText("Enter your email address")).toBeVisible();
    expect(screen.getByText("Enter your password")).toBeVisible();
  });
  //----------------------------------------------------

  test('It should display "Error: Email or password are not correct"', async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    //filling the text inputs with wrong data
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "blabla@bla.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "blablabla" },
    });
    //clicking the sign in button
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    //waiting for the error alert to appear
    await waitFor(() =>
      screen.getByText("Error: Email or password are not correct")
    );
    //assertions
    expect(
      screen.getByText("Error: Email or password are not correct")
    ).toBeVisible();
  });
  //--------------------------------------------------------------------
});
//-----------------------------------------------------------------------------
//----------------------------------------------------------------------------
