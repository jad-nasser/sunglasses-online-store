//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import EditPhone from "./EditPhone";
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
    expect(screen.getByText("Enter new phone number")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the user phone number successfully changed", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditPhone />
      </BrowserRouter>
    );
    //selecting phone code
    userEvent.selectOptions(screen.getByTestId("code"), "+44");
    //entering an phone number
    fireEvent.change(screen.getByPlaceholderText("New phone number"), {
      target: { value: 544465945545 },
    });
    //clicking the change phone button
    fireEvent.click(screen.getByRole("button", { name: /change phone/i }));
    //waiting for the success text to appear
    await waitFor(() => screen.getByText("Phone number successfully changed"));
    //assertions
    expect(screen.getByText("Phone number successfully changed")).toBeVisible();
  });
  //-------------------------------------------------------------------------

  test("Testing the component when the server rejects the phone change", async () => {
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
        <EditPhone />
      </BrowserRouter>
    );
    //selecting phone code
    userEvent.selectOptions(screen.getByTestId("code"), "+44");
    //entering an phone number
    fireEvent.change(screen.getByPlaceholderText("New phone number"), {
      target: { value: 466546476565 },
    });
    fireEvent.click(screen.getByRole("button", { name: /change phone/i }));
    //waiting for the error text to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
