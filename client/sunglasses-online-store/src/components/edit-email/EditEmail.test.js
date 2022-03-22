//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditEmail from "./EditEmail";
//----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch(
    process.env.REACT_APP_BASE_URL + "user/update_user",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  )
);
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

describe("Testing EditEmail component", () => {
  test("Testing the component when the input fields are empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditEmail />
      </BrowserRouter>
    );
    //clicking the change email button
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    //assertions
    expect(screen.getByText("Enter new email address")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the entered email is not valid", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditEmail />
      </BrowserRouter>
    );
    //typing a not valid email
    fireEvent.change(screen.getByPlaceholderText("New Email Address"), {
      target: { value: "blabla" },
    });
    //clicking the change email button
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    //assertions
    expect(screen.getByText("Enter a valid email address")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user email address successfully changed", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditEmail />
      </BrowserRouter>
    );
    //entering an email address
    fireEvent.change(screen.getByPlaceholderText("New Email Address"), {
      target: { value: "testtest@test.com" },
    });
    //clicking the change email button
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    //waiting for the success text to appear
    await waitFor(() => screen.getByText("Email address successfully changed"));
    //assertions
    expect(
      screen.getByText("Email address successfully changed")
    ).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the server rejects the email change", async () => {
    //overriding the mock server method
    server.use(
      rest.patch(
        process.env.REACT_APP_BASE_URL + "user/update_user",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <EditEmail />
      </BrowserRouter>
    );
    //entering an email address
    fireEvent.change(screen.getByPlaceholderText("New Email Address"), {
      target: { value: "testtest@test.com" },
    });
    //clicking the change email button
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    //waiting for the error text to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
