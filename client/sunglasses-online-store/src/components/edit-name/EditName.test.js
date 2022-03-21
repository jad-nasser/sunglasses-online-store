//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditName from "./EditName";
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

describe("Testing EditName component", () => {
  test("Testing the component when the input fields are empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditName />
      </BrowserRouter>
    );
    //clicking the change name button
    fireEvent.click(screen.getByRole("button", { name: /change name/i }));
    //assertions
    expect(screen.getByText("Enter new first name")).toBeVisible();
    expect(screen.getByText("Enter new last name")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user name successfully changed", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditName />
      </BrowserRouter>
    );
    //entering first name
    fireEvent.change(screen.getByPlaceholderText("New First Name"), {
      target: { value: "Test" },
    });
    //entering last name
    fireEvent.change(screen.getByPlaceholderText("New Last Name"), {
      target: { value: "Test" },
    });
    //clicking the change name button
    fireEvent.click(screen.getByRole("button", { name: /change name/i }));
    //waiting for the success message to appear
    await waitFor(() => screen.getByText("Name successfully changed"));
    //assertions
    expect(screen.getByText("Name successfully changed")).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the server rejects the changes", async () => {
    //changing the mock server method
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
        <EditName />
      </BrowserRouter>
    );
    //entering first name
    fireEvent.change(screen.getByPlaceholderText("New First Name"), {
      target: { value: "Test" },
    });
    //entering last name
    fireEvent.change(screen.getByPlaceholderText("New Last Name"), {
      target: { value: "Test" },
    });
    //clicking the change name button
    fireEvent.click(screen.getByRole("button", { name: /change name/i }));
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //------------------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
