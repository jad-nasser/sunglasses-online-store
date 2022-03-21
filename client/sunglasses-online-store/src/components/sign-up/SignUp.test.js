//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./SignUp";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "user/create_user",
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

describe("Testing SignUp component", () => {
  test("Testing the component when the inputs are all empty", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    //clicking the sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //assertions
    expect(screen.getByText("Enter your first name")).toBeVisible();
    expect(screen.getByText("Enter your last name")).toBeVisible();
    expect(screen.getByText("Enter your email address")).toBeVisible();
    expect(screen.getByText("Enter your phone number")).toBeVisible();
    expect(screen.getByText("Enter your account password")).toBeVisible();
    expect(screen.getByText("Confirm your account password")).toBeVisible();
    expect(screen.getByText("Select country")).toBeVisible();
    expect(
      screen.getByText("Enter state, province, or county name")
    ).toBeVisible();
    expect(screen.getByText("Enter city name")).toBeVisible();
    expect(screen.getByText("Enter street name")).toBeVisible();
    expect(screen.getByText(/enter appartment/i)).toBeVisible();
    expect(screen.getByText("Enter ZIP/Postal code")).toBeVisible();
  });
  //---------------------------------------------------------------------------------------------

  test("Testing the component when email and password are invalid", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    //writing invalid email address
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "blablabla" },
    });
    //writing an invalid password that don't match the password requirements
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "qwerty" },
    });
    //clicking the sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //assertions
    expect(screen.getByText("Enter a valid email address")).toBeVisible();
    expect(screen.getByText(/password length/i)).toBeVisible();
  });
  //--------------------------------------------------------------------------------------------

  test("Testing the component when the confirmation password do not match the password", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    //writing a password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "qwertY6," },
    });
    //writing password confirmation that dont match the password
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "blablabla" },
    });
    //clicking the sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //assertions
    expect(screen.getByText("Confirm your account password")).toBeVisible();
  });
  //----------------------------------------------------------------------------------------------

  test("Testing the component when everything is done correctly", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    //entering first name
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    //entering last name
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Test" },
    });
    //entering Email Address
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testtest@test.com" },
    });
    //entering phone code
    userEvent.selectOptions(screen.getByTestId("code"), "+44");
    //entering phone number
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: 12345 },
    });
    //entering password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Qw!7asdf" },
    });
    //entering password confirmation
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Qw!7asdf" },
    });
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
    //clicking sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //wait for the success message to appear
    await waitFor(() => screen.getByText("Account successfully created"));
    //assertions
    expect(screen.getByText("Account successfully created")).toBeVisible();
  });
  //----------------------------------------------------------------------------------------------

  test("Testing the component when recieving an error request from the server", async () => {
    //overriding the mock server so it returns an error
    server.use(
      rest.post(
        process.env.REACT_APP_BASE_URL + "user/create_user",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    //entering first name
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    //entering last name
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Test" },
    });
    //entering Email Address
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testtest@test.com" },
    });
    //entering phone code
    userEvent.selectOptions(screen.getByTestId("code"), "+44");
    //entering phone number
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: 12345 },
    });
    //entering password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Qw!7asdf" },
    });
    //entering password confirmation
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Qw!7asdf" },
    });
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
    //clicking sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //wait for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //-----------------------------------------------------------------------------------------------
});
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
