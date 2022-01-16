//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./Cart";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { expect } from "chai";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock local storage items
let local_storage_items = {};
local_storage_items["1234"] = {
  id: "1234",
  quantity: 2,
};
local_storage_items["12345"] = {
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
const server = setupServer(
  rest.get("/item/get_items", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(items));
  }),
  rest.post("/order/create_orders", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ client_secret: "1234" }));
  })
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
  test("Testing the component when the server sends an error", () => {
    //mocking the server to send an error
    server.use(
      rest.get("/item/get_items", (req, res, ctx) => {
        return res(ctx.status(500, "Server Error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={false} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Error: Server Error")).toBeVisible();
  });
  //------------------------------------------------------------------

  test("Testing the component when the items in local storage are not in good format, the items should be deleted from the local storage", () => {
    //creating some local storage items with bad format
    let bad_items = {};
    bad_items["123"] = {};
    bad_items["1234"] = {};
    localStorage.setItem("items", bad_items);
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={false} />
      </BrowserRouter>
    );
    //assertions
    expect(!localStorage.getItem("items")).toBe(true);
  });
  //--------------------------------------------------------------------

  test("Testing the component when the local storage items are not found in the server or its quantity is not available, the items should be removed from the local storage", () => {
    //mocking the server to return null
    server.use(
      rest.get("/item/get_items", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(null));
      })
    );
    //saving some items in the local storage
    localStorage.setItem("items", local_storage_items);
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={false} />
      </BrowserRouter>
    );
    //assertions
    expect(!localStorage.getItem("items")).toBe(true);
  });
  //-----------------------------------------------------------------------

  test("Testing the component with two items in the local storage the two items should be rendered with the total price", () => {
    //saving some items in the local storage
    localStorage.setItem("items", local_storage_items);
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={false} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Ray-Ban Rounded")).toBeVisible();
    expect(screen.getByText("Ray-Ban Aviator")).toBeVisible();
    expect(screen.getByText("Total Price: 900$")).toBeVisible();
  });
  //------------------------------------------------------------------------

  test('Testing the component with a user that is not logged in, the "Proceed Order" button should be disabled', () => {
    //saving some items in the local storage
    localStorage.setItem("items", local_storage_items);
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={false} />
      </BrowserRouter>
    );
    //assertions
    expect(
      screen.getByRole("button", { name: "Proceed Order" })
    ).toBeDisabled();
  });
  //-------------------------------------------------------------------------

  test('Testing the component with a logged in user and clicking the "Proceed Order button", the items should be removed from the local storage', () => {
    //saving some items in the local storage
    localStorage.setItem("items", local_storage_items);
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={true} />
      </BrowserRouter>
    );
    //clicking the "Proceed Order" button
    fireEvent.click(screen.getByRole("button", { name: "Proceed Order" }));
    //assertions
    expect(!localStorage.getItem("items")).toBe(true);
  });
  //------------------------------------------------------------------------------

  test('Testing the component with a logged in user and with no items in local storage, the "Proceed Order" button should be disabled', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Cart loggedIn={true} />
      </BrowserRouter>
    );
    //assertions
    expect(
      screen.getByRole("button", { name: "Proceed Order" })
    ).toBeDisabled();
  });
  //------------------------------------------------------------------------------------------
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
