//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import Items from "./Items";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

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
  times_ordered: 10,
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
  times_ordered: 10,
};
//------------------------------------------------------------------------
//--------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.patch("/item/update_items", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/item/get_items", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(items));
  })
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing Items component", () => {
  test("Testing the component when substracting more than the available items, it should return an error message 'Not enough quantities to substract' ", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestBody={{}} />
      </BrowserRouter>
    );
    //clicking the "Substract" radio button
    fireEvent.click(screen.getByLabelText("Substract"));
    //writing a value that is bigger than the available quantity
    fireEvent.change(screen.getByPlaceholderText("Value to substract"), {
      target: { value: "10" },
    });
    //clicking the update button
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    //assertions
    expect(
      screen.getByText("Error: Not enough quantities to substract")
    ).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the updates are succeeded", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestBody={{}} />
      </BrowserRouter>
    );
    //clicking the "Substract" radio button
    fireEvent.click(screen.getByLabelText("Substract"));
    //writing a value that is smaller than the available quantity
    fireEvent.change(screen.getByPlaceholderText("Value to substract"), {
      target: { value: "2" },
    });
    //clicking the update button
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    //assertions
    expect(screen.getByText("Items successfully updated")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", () => {
    server.use(
      rest.get("/item/get_items", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when there is no updates in the items updater, the update button should be disabled", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the query not find any item, the update button should be disabled", () => {
    //mocking the server to be not find any item
    server.use(
      rest.get("/item/get_items", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestBody={{}} />
      </BrowserRouter>
    );
    //clicking the "Substract" radio button
    fireEvent.click(screen.getByLabelText("Substract"));
    //changing the value
    fireEvent.change(screen.getByPlaceholderText("Value to substract"), {
      target: { value: "2" },
    });
    //assertions
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
