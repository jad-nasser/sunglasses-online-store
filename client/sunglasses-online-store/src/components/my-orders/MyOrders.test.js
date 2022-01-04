//importing modules
import { render, screen } from "@testing-library/react";
import MyOrders from "./MyOrders";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock server
let orders = [];
let order1 = {
  item_name: "Ray-Ban Rounded",
  item_id: "1",
  status: "Awaiting Shipment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
};
let order2 = {
  item_name: "Ray-Ban Rounded",
  item_id: "1",
  status: "Awaiting Shipment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
};
let order3 = {
  item_name: "Ray-Ban Aviator",
  item_id: "2",
  status: "Awaiting Payment",
  quantity: 1,
  date_time: Date.now(),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
};
orders[0] = order1;
orders[1] = order2;
order[2] = order3;
const server = setupServer(
  rest.get("/order/get_customer_orders", (req, res, ctx) => {
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

describe("Testing MyOrders component", () => {
  test("Testing the component it should not render the order that its status is 'Awaiting Payment'", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );
    //assertions
    //the third order should not be rendered
    expect(screen.getAllByText(/ray-ban/i).length).toBe(2);
    expect(screen.getAllByText(/rounded/i).length).toBe(2);
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", () => {
    //modifying the mock server method to return an error
    server.use(
      rest.get("/order/get_customer_orders", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
