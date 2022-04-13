//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  rest.patch(
    process.env.REACT_APP_BASE_URL + "item/update_items",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "item/get_items",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(items));
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

describe("Testing Items component", () => {
  test("Testing the component when the updates are succeeded", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestQuery={{}} />
      </BrowserRouter>
    );
    //Changing the quantities
    fireEvent.change(screen.getByPlaceholderText("Change Quantity"), {
      target: { value: 5 },
    });
    //clicking the update button
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    //waiting for the success message to appear
    await waitFor(() => screen.getByText("Items successfully updated"));
    //assertions
    expect(screen.getByText("Items successfully updated")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when the server sends an error", async () => {
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "item/get_items",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestQuery={{}} />
      </BrowserRouter>
    );
    //waiting for the error message to appear
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //----------------------------------------------------------------------

  test("Testing the component when there is no updates in the items updater, the update button should be disabled", () => {
    //rendering the component
    render(
      <BrowserRouter>
        <Items requestQuery={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });
  //----------------------------------------------------------------------
});
//--------------------------------------------------------------
//------------------------------------------------------------
