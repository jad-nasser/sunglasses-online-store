//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import EditOrderDestination from "./EditOrderDestination";
import userEvent from "@testing-library/user-event";
//----------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

//creating mock server
const server = setupServer(
  rest.patch(
    process.env.REACT_APP_BASE_URL + "user/update_user",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  )
);
//-----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-----------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

describe("Testing EditOrderDestination component", () => {
  test("Testing the component whwn all input fields are empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditOrderDestination />
      </BrowserRouter>
    );
    //clicking 'Change order destination' button
    fireEvent.click(
      screen.getByRole("button", { name: /change order destination/i })
    );
    //assertions
    expect(screen.getByText("Select country")).toBeVisible();
    expect(
      screen.getByText("Enter state, province, or county name")
    ).toBeVisible();
    expect(screen.getByText("Enter city name")).toBeVisible();
    expect(screen.getByText("Enter street name")).toBeVisible();
    expect(screen.getByText(/enter appartment/i)).toBeVisible();
    expect(screen.getByText("Enter ZIP/Postal code")).toBeVisible();
  });
  //----------------------------------------------------------------

  test("Testing the component when the server reject the changes", async () => {
    //altering the mock server to return an error
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
        <EditOrderDestination />
      </BrowserRouter>
    );
    //entering state / province / county
    fireEvent.change(screen.getByPlaceholderText(/state/i), {
      target: { value: "London" },
    });
    //entering city
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "London" },
    });
    //entering street
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: "First Street" },
    });
    //entering apt / bldg and floor
    fireEvent.change(screen.getByPlaceholderText(/apt/i), {
      target: { value: "First bldg" },
    });
    //entering ZIP / Postal code
    fireEvent.change(screen.getByPlaceholderText(/zip/i), {
      target: { value: 1234 },
    });
    //selecting country
    userEvent.selectOptions(screen.getByTestId("country"), "United Kingdom");
    //clicking 'Change order destination' button
    fireEvent.click(
      screen.getByRole("button", { name: /change order destination/i })
    );
    //waiting for the error text to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //-------------------------------------------------------------------

  test("Testing the component when changes are successfully done", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <EditOrderDestination />
      </BrowserRouter>
    );
    //entering state / province / county
    fireEvent.change(screen.getByPlaceholderText(/state/i), {
      target: { value: "London" },
    });
    //entering city
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "London" },
    });
    //entering street
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: "First Street" },
    });
    //entering apt / bldg and floor
    fireEvent.change(screen.getByPlaceholderText(/apt/i), {
      target: { value: "First bldg" },
    });
    //entering ZIP / Postal code
    fireEvent.change(screen.getByPlaceholderText(/zip/i), {
      target: { value: 1234 },
    });
    //selecting country
    userEvent.selectOptions(screen.getByTestId("country"), "United Kingdom");
    //clicking 'Change order destination' button
    fireEvent.click(
      screen.getByRole("button", { name: /change order destination/i })
    );
    //waiting for the error text to appear
    await waitFor(() =>
      screen.getByText("Order destination successfully changed")
    );
    //assertions
    expect(
      screen.getByText("Order destination successfully changed")
    ).toBeVisible();
  });
  //---------------------------------------------------------------------
});
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
