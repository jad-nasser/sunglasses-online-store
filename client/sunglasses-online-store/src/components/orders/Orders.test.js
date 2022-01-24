//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import Orders from "./Orders";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating mock orders
let orders = [];
orders[0] = {
  user_info: {
    first_name: "Test",
    last_name: "Test",
    email: "testtest@test.com",
    phone: "+54564654545",
    country: "Sweden",
    city: "Sweden",
    street: "first street",
    state_province_county: "Sweden",
    bldg_apt_address: "First bldg, first floor",
    zip_code: 1234,
  },
  item_name: "item1",
  item_id: "123",
  status: "Awaiting Shipment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "50 150-50",
  item_color: "Gold",
  item_price: 230,
  shipment_id: "123",
  total_price: 230,
  _id: "123",
};
orders[1] = {
  user_info: {
    first_name: "Test",
    last_name: "Test",
    email: "testtest@test.com",
    phone: "+54564654545",
    country: "Sweden",
    city: "Sweden",
    street: "first street",
    state_province_county: "Sweden",
    bldg_apt_address: "First bldg, first floor",
    zip_code: 1234,
  },
  item_name: "item1",
  item_id: "123",
  status: "Awaiting Shipment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "50 150-50",
  item_color: "Gold",
  item_price: 230,
  shipment_id: "123",
  total_price: 230,
  _id: "1234",
};
orders[2] = {
  user_info: {
    first_name: "Test",
    last_name: "Test",
    email: "testtest@test.com",
    phone: "+54564654545",
    country: "Sweden",
    city: "Sweden",
    street: "first street",
    state_province_county: "Sweden",
    bldg_apt_address: "First bldg, first floor",
    zip_code: 1234,
  },
  item_name: "item2",
  item_id: "1234",
  status: "Awaiting Payment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "50 150-50",
  item_color: "Gold",
  item_price: 230,
  shipment_id: "123",
  total_price: 230,
  _id: "12345",
};
//------------------------------------------------------------------------
//--------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch("/order/update_orders", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/order/get_orders", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(orders));
  })
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing Orders component", () => {
  test("It should render 2 orders, and the third order with the status= Awaiting Payment should not be rendered, and also the total price of the two rendered orders that it is 460$ should be rendered", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Orders requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getAllByText(/Awaiting/).length).toBe(2);
    expect(screen.getAllByText(/Awaiting Shipment/).length).toBe(2);
    expect(screen.getByText("Total Orders Price: 460$")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the updates are succeeded", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Orders requestBody={{}} />
      </BrowserRouter>
    );
    //changing "Change Status" input in Orders Editor
    fireEvent.change(screen.getByPlaceholderText("Change Status"), {
      target: { value: "Delivered" },
    });
    //clicking the update button
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    //assertions
    expect(screen.getByText("Orders successfully updated")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", () => {
    server.use(
      rest.get("/order/get_orders", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <Orders requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when there is no updates in the Orders updater, the update button should be disabled", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Orders requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
