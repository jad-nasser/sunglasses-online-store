//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditPassword from "./EditPassword";
//----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch(
    process.env.REACT_APP_BASE_URL + "user/update_user",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "user/check_password",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ check_password: true }));
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
    expect(screen.getByText("Enter new password")).toBeVisible();
    expect(screen.getByText("Enter old password")).toBeVisible();
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user password successfully changed", async () => {
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
      target: { value: "Qw!7asdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Qw!7asdf" },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //waiting for the success message to appear
    await waitFor(() => screen.getByText("Password successfully changed"));
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
    //clicking change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByText(/password length/i)).toBeVisible();
  });
  //---------------------------------------------------------------------------

  test("Testing the component when the server rejects the password change", async () => {
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
        <EditPassword />
      </BrowserRouter>
    );
    //filling the input fields with some info and making sure that the password is valid and the password
    //confirmation match the new password
    fireEvent.change(screen.getByPlaceholderText("Old password"), {
      target: { value: "qwertY8," },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "Qw!7asdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Qw!7asdf" },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when assuming that the entered old password is incorrect", async () => {
    //overriding the mock server method
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
        <EditPassword />
      </BrowserRouter>
    );
    //filling the input fields with some info and making sure that the password is valid and the password
    //confirmation match the new password
    fireEvent.change(screen.getByPlaceholderText("Old password"), {
      target: { value: "qwertY8," },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "Qw!7asdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Qw!7asdf" },
    });
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Old password is not correct"));
    //assertions
    expect(
      screen.getByText("Error: Old password is not correct")
    ).toBeVisible();
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
    //clicking the change password button
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    //assertions
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
