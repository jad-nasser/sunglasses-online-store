//importing modules
import { render, screen } from "@testing-library/react";
import AccountSettings from "./AccountSettings";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock server
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
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing AccountSettings component", () => {
  test("Testing the component it should load AccountInfo component by default", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <AccountSettings />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Account Info")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
