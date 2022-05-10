//importing modules
import { render, screen, waitFor } from "@testing-library/react";
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
  date_time: new Date(Date.now()),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
  item_info: [{ images: ["blabla.jpg"] }],
};
let order2 = {
  item_name: "Ray-Ban Rounded",
  item_id: "1",
  status: "Awaiting Shipment",
  quantity: 1,
  date_time: new Date(Date.now()),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
  item_info: [{ images: ["blabla.jpg"] }],
};
let order3 = {
  item_name: "Ray-Ban Aviator",
  item_id: "2",
  status: "Awaiting Payment",
  quantity: 1,
  date_time: new Date(Date.now()),
  item_brand: "Ray-Ban",
  item_size: "1",
  item_color: "Gold",
  item_price: 200,
  item_info: [{ images: ["blabla.jpg"] }],
};
orders[0] = order1;
orders[1] = order2;
orders[2] = order3;
const server = setupServer(
  rest.get(
    process.env.REACT_APP_BASE_URL + "order/get_customer_orders",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(orders));
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

describe("Testing MyOrders component", () => {
  test("Testing the component it should not render the order that its status is 'Awaiting Payment'", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );
    //waiting for the orders to be visible on the screen
    await waitFor(() => screen.getAllByText(/ray-ban/i));
    //assertions
    //the third order should not be rendered
    expect(screen.getAllByText(/ray-ban/i).length).toBe(2);
    expect(screen.getAllByText(/rounded/i).length).toBe(2);
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", async () => {
    //modifying the mock server method to return an error
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "order/get_customer_orders",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
