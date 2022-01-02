//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditEmail from "./EditEmail";
//----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch("/user/update_user", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/user/check_email", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ check_email: false }));
  })
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
    expect(screen.getByLabelText("Enter new email address")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user email address successfully changed", () => {
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
    //assertions
    expect(
      screen.getByText("Email address successfully changed")
    ).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the entered email is invalid", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditEmail />
      </BrowserRouter>
    );
    //entering a not valid email address
    fireEvent.change(screen.getByPlaceholderText("New Email Address"), {
      target: { value: "blabla" },
    });
    //assertions
    expect(screen.getByLabelText("Not valid email address")).toBeVisible();
  });
  //---------------------------------------------------------------------------

  test("Testing the component when the server rejects the email change", () => {
    //overriding the mock server method
    server.use(
      rest.patch("/user/update_user", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
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
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the entered email is already used", () => {
    //overriding the mock server method
    server.use(
      rest.get("/user/check_email", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ check_email: true }));
      })
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
    //assertions
    expect(screen.getByLabelText("Email already used")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
