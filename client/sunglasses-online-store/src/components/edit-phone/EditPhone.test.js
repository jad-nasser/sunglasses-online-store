//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditPhone from "./EditPhone";
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

describe("Testing EditPhone component", () => {
  test("Testing the component when the input fields are empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPhone />
      </BrowserRouter>
    );
    //clicking the change phone button
    fireEvent.click(screen.getByRole("button", { name: /change phone/i }));
    //assertions
    expect(screen.getByLabelText("Enter new phone number")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user phone number successfully changed", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPhone />
      </BrowserRouter>
    );
    //entering an phone number
    fireEvent.change(screen.getByPlaceholderText("New phone number"), {
      target: { value: 544465945545 },
    });
    //clicking the change phone button
    fireEvent.click(screen.getByRole("button", { name: /change phone/i }));
    //assertions
    expect(screen.getByText("Phone number successfully changed")).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the server rejects the phone change", () => {
    //overriding the mock server method
    server.use(
      rest.patch("/user/update_user", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <EditPhone />
      </BrowserRouter>
    );
    //entering an phone number
    fireEvent.change(screen.getByPlaceholderText("New phone number"), {
      target: { value: 466546476565 },
    });
    fireEvent.click(screen.getByRole("button", { name: /change phone/i }));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
