//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cart from "./Cart";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock local storage items
let local_storage_items = [];
local_storage_items[0] = {
  id: "1234",
  quantity: 2,
};
local_storage_items[1] = {
  id: "12345",
  quantity: 2,
};
//creating mock server items
let items = [];
items[0] = {
  _id: "1234",
  name: "Ray-Ban Rounded",
  brand: "Ray-Ban",
  size: "50 50-150",
  color: "Gold",
  quantity: 5,
  images: ["bla.jpg"],
  price: 250,
};
items[1] = {
  _id: "12345",
  name: "Ray-Ban Aviator",
  brand: "Ray-Ban",
  size: "50 50-150",
  color: "Gold",
  quantity: 5,
  images: ["bla.jpg"],
  price: 200,
};
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

//creating a mock server
let numberOfTimes = 0;
const server = setupServer(
  rest.get(
    process.env.REACT_APP_BASE_URL + "item/get_items",
    (req, res, ctx) => {
      numberOfTimes++;
      if (numberOfTimes - 1 === 0)
        return res(ctx.status(200), ctx.json([items[0]]));
      else return res(ctx.status(200), ctx.json([items[1]]));
    }
  )
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.removeItem("items");
});
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing Cart component", () => {
  test("Testing the component when the server sends an error", async () => {
    //mocking the server to send an error
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "item/get_items",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //adding some items to the local storage
    localStorage.setItem("items", JSON.stringify(local_storage_items));
    //rendering the component
    render(
      <Elements stripe={stripe}>
        <BrowserRouter>
          <Cart loggedIn={false} />
        </BrowserRouter>
      </Elements>
    );
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //------------------------------------------------------------------

  test("Testing the component when the local storage items are not found in the server, the items should be removed from the local storage", async () => {
    //mocking the server to return empty array
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "item/get_items",
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      )
    );
    //saving some items in the local storage
    localStorage.setItem("items", JSON.stringify(local_storage_items));
    //rendering the component
    render(
      <Elements stripe={stripe}>
        <BrowserRouter>
          <Cart loggedIn={false} />
        </BrowserRouter>
      </Elements>
    );
    //waiting for the local storage items to be removed
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem("items")).length).toBe(0)
    );
    //assertions
    expect(JSON.parse(localStorage.getItem("items")).length).toBe(0);
  });
  //-----------------------------------------------------------------------

  test("Testing the component when the local storage items quantities are not available, the items should be removed from the local storage", async () => {
    //mocking the server to return items with quantity=0
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "item/get_items",
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([{ _id: "1234", quantity: 0 }]));
        }
      )
    );
    //saving some items in the local storage
    localStorage.setItem("items", JSON.stringify(local_storage_items));
    //rendering the component
    render(
      <Elements stripe={stripe}>
        <BrowserRouter>
          <Cart loggedIn={false} />
        </BrowserRouter>
      </Elements>
    );
    //waiting for the local storage items to be removed
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem("items")).length).toBe(0)
    );
    //assertions
    expect(JSON.parse(localStorage.getItem("items")).length).toBe(0);
  });
  //-----------------------------------------------------------------------

  test("Testing the component with two items in the local storage the two items should be rendered with the total price", async () => {
    //saving some items in the local storage
    localStorage.setItem("items", JSON.stringify(local_storage_items));
    //rendering the component
    render(
      <Elements stripe={stripe}>
        <BrowserRouter>
          <Cart loggedIn={false} />
        </BrowserRouter>
      </Elements>
    );
    //waiting for the items with the total price to appear
    await waitFor(() => screen.getByText("Total Price: 900$"));
    //assertions
    expect(screen.getByText("Ray-Ban Rounded")).toBeVisible();
    expect(screen.getByText("Ray-Ban Aviator")).toBeVisible();
    expect(screen.getByText("Total Price: 900$")).toBeVisible();
  });
  //------------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
