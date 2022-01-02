//importing modules
import { render, screen } from "@testing-library/react";
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
  rest.get("/user/get_user", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ user_info: test_user }));
  })
);
//-----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

describe("Testing AccountInfo component", function () {
  test("Testing the component with a user that has verified email and phone", () => {
    //altering the user so it have verified phone and email
    test_user.is_email_verified = true;
    test_user.is_phone_verified = true;
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getAllByText("Verified").length).toBe(2);
  });
  //----------------------------------------------------------------------------

  test("Testing the component with a user that do not have verified email and phone", () => {
    //altering the user so it does not have verified phone and email
    test_user.is_email_verified = false;
    test_user.is_phone_verified = false;
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getAllByText("Not verified").length).toBe(2);
  });
  //-------------------------------------------------------------------------------------

  test("Testing the component when the server sends an error", () => {
    //altering the mock server to return an error
    server.user(
      rest.get("/user/get_user", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <AccountInfo />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //---------------------------------------------------------------------------
});
//------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
