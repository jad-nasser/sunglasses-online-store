//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditPassword from "./EditPassword";
//----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch("/user/update_user", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/user/check_password", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ check_password: true }));
  })
);
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

describe("Testing EditPassword component", () => {
  test("Testing the component when the input fields are empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByLabelText("Enter new password")).toBeVisible();
    expect(screen.getByLabelText("Enter old password")).toBeVisible();
    expect(screen.getByLabelText("Confirm your password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user password successfully changed", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //filling the input fields with some info and making sure that the password is valid and the password
    //confirmation match the new password
    fireEvent.change(screen.getByPlaceholderText("Old password"), {
      target: { value: "qwertY8," },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "qwertY7," },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "qwertY7," },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByText("Password successfully changed")).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the entered password is invalid", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //entering a not valid password
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "blabla" },
    });
    //assertions
    expect(screen.getByLabelText(/the password size/i)).toBeVisible();
  });
  //---------------------------------------------------------------------------

  test("Testing the component when the server rejects the password change", () => {
    //overriding the mock server method
    server.use(
      rest.patch("/user/update_user", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //filling the input fields with some info and making sure that the password is valid and the password
    //confirmation match the new password
    fireEvent.change(screen.getByPlaceholderText("Old password"), {
      target: { value: "qwertY8," },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "qwertY7," },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "qwertY7," },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when assuming that the entered old password is incorrect", () => {
    //overriding the mock server method
    server.use(
      rest.get("/user/check_password", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ check_password: false }));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //filling the input fields with some info and making sure that the password is valid and the password
    //confirmation match the new password
    fireEvent.change(screen.getByPlaceholderText("Old password"), {
      target: { value: "qwertY8," },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "qwertY7," },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "qwertY7," },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByLabelText("Old password is not correct")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the password confirmation dont match the new password", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPassword />
      </BrowserRouter>
    );
    //entering new password
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "qwertY7," },
    });
    //entering password confirmation that dont match the new password
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "qwertY8," },
    });
    //assertions
    expect(
      screen.getByLabelText(
        "Password confirmation not matching the new password"
      )
    ).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
