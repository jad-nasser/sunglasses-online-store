//importing modules
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import AccountInfo from "./AccountInfo";
//----------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

//creating mock server
let test_user = {
  first_name: "Test",
  last_name: "Test",
  email: "testtest@test.com",
  password: "qwertY7,",
  phone: "+2125415454",
  country: "United Kingdom",
  city: "London",
  state_province_county: "London",
  street: "First street",
  bldg_apt_address: "First bldg, first floor",
  zip_code: 1234,
  is_phone_verified: true,
  is_email_verified: true,
};
const server = setupServer(
  rest.get(
    process.env.REACT_APP_BASE_URL + "user/get_user",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ user_info: test_user }));
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

describe("Testing AccountInfo component", function () {
  test("Testing the component with a user that has verified email and phone", async () => {
    //altering the user so it have verified phone and email
    test_user.is_email_verified = true;
    test_user.is_phone_verified = true;
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //waiting for the user info to be fetched from the database
    await waitFor(() => screen.getAllByText(test_user.first_name));
    //assertions
    expect(screen.getAllByText("Verified").length).toBe(2);
  });
  //----------------------------------------------------------------------------

  test("Testing the component with a user that do not have verified email and phone", async () => {
    //altering the user so it does not have verified phone and email
    test_user.is_email_verified = false;
    test_user.is_phone_verified = false;
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //waiting for the Not verified texts to appear
    await waitFor(() => screen.getAllByText("Not verified"));
    //assertions
    expect(screen.getAllByText("Not verified").length).toBe(2);
  });
  //-------------------------------------------------------------------------------------

  test("Testing the component when the server sends an error", async () => {
    //altering the mock server to return an error
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "user/get_user",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //---------------------------------------------------------------------------
});
//------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
