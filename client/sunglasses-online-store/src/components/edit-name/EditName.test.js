//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditName from "./EditName";
//----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch("/user/update_user", (req, res, ctx) => {
    return res(ctx.status(200));
  })
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
    expect(screen.getByLabelText("Enter new first name")).toBeVisible();
    expect(screen.getByLabelText("Enter new last name")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user name successfully changed", () => {
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
    //assertions
    expect(screen.getByText("Name successfully changed")).toBeVisible();
  });
  //-------------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
