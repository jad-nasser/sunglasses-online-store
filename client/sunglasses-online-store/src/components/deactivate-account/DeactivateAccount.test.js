//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeactivateAccount from "./DeactivateAccount";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.delete(
    process.env.REACT_APP_BASE_URL + "user/delete_user",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "user/check_password",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ check_password: true }));
    }
  ),
  rest.delete(
    process.env.REACT_APP_BASE_URL + "user/sign_out",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  )
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
    expect(screen.getByText("Enter your password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when assuming that the entered password is wrong", async () => {
    //modifying the mock server method to return an error
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "user/check_password",
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ check_password: false }));
        }
      )
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
    //waiting for the error text to appear
    await waitFor(() => screen.getByText("Error: Incorrect password"));
    //assertions
    expect(screen.getByText("Error: Incorrect password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", async () => {
    //modifying the mock server method to return an error
    server.use(
      rest.delete(
        process.env.REACT_APP_BASE_URL + "user/delete_user",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
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
    //waiting for the pop up message to appear
    await waitFor(() => screen.getByRole("button", { name: "Yes" }));
    //clicking the yes button in the pop up
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    //waiting for the error text to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when every thing is done correctly", async () => {
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
    //waiting for the pop up message to appear
    await waitFor(() => screen.getByRole("button", { name: "Yes" }));
    //clicking the yes button in the pop up
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    //waiting for the success text to appear
    await waitFor(() => screen.getByText("Account successfully deactivated"));
    //assertions
    expect(screen.getByText("Account successfully deactivated")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
