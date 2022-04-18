//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewItem from "./ViewItem";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating mock items
let items = [];
items[0] = {
  _id: "1234",
  name: "Item1",
  brand: "Item",
  size: "size1",
  color: "color1",
  quantity: 5,
  images: ["bla.jpg"],
  price: 250,
  times_ordered: 10,
};
items[1] = {
  _id: "12345",
  name: "Item1",
  brand: "Item",
  size: "size2",
  color: "color1",
  quantity: 5,
  images: ["bla.jpg"],
  price: 250,
  times_ordered: 10,
};
items[2] = {
  _id: "123456",
  name: "Item1",
  brand: "Item",
  size: "size3",
  color: "color2",
  quantity: 6,
  images: ["bla.jpg"],
  price: 200,
  times_ordered: 10,
};
items[3] = {
  _id: "1234567",
  name: "Item1",
  brand: "Item",
  size: "size4",
  color: "color2",
  quantity: 6,
  images: ["bla.jpg"],
  price: 200,
  times_ordered: 10,
};
//------------------------------------------------------------------------
//--------------------------------------------------------------------------

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = function () {};
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//setting up the mock server
const server = setupServer(
  rest.get(
    process.env.REACT_APP_BASE_URL + "item/get_items",
    (req, res, ctx) => {
      return res(ctx.json(items));
    }
  )
);
//----------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => {
  localStorage.removeItem("items");
  server.resetHandlers();
});
afterAll(() => server.close());
//------------------------------------------------------------------

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing ViewItem component", () => {
  test('Testing the component when there is no item or the requested item is not found, it should display "Item not foumd" ', async () => {
    //mocking the server to return no items
    server.use(
      rest.get(
        process.env.REACT_APP_BASE_URL + "item/get_items",
        (req, res, ctx) => {
          return res(ctx.json([]));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem />
      </BrowserRouter>
    );
    //Waiting for the text to appear
    await waitFor(() => screen.getByText("Item not found"));
    //assertions
    expect(screen.getByText("Item not found")).toBeVisible();
  });
  //-----------------------------------------------------------------------------------------

  test("Testing the component without specifying the needed quantities", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //Waiting for button to appear
    await waitFor(() => screen.getByRole("button", { name: "Add to cart" }));
    //clicking the "Add to cart" button
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    //assertions
    expect(screen.getByText("Enter the needed quantities")).toBeVisible();
  });
  //-------------------------------------------------------------------------------------------

  test('Testing the component when everything is done correctly, it should display "Item added to the shopping cart" and the item should be saved in the local storage', async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //Waiting for the input to appear
    await waitFor(() => screen.getByLabelText("Quantity:"));
    //change the quantities input
    fireEvent.change(screen.getByLabelText("Quantity:"), {
      target: { value: "1" },
    });
    //clicking the "Add to cart" button
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    //Waiting for the success text to appear
    await waitFor(() => screen.getByText("Item added to the shopping cart"));
    //assertions
    expect(screen.getByText("Item added to the shopping cart")).toBeVisible();
    expect(localStorage.getItem("items")).toBeTruthy();
  });
  //------------------------------------------------------------------------------------------

  test('Testing the component selection functionalities after selecting "color2" with quantity=2 it should render the available sizes that are: "size3" and "size4" with "Price of One Piece: 200$" and "Total Price: 400$" and "Available Quantities: 6"', async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //Waiting for the selection to appear
    await waitFor(() => screen.getByLabelText("color2"));
    //selecting "color2" color
    fireEvent.click(screen.getByLabelText("color2"));
    //change the quantities input to "2"
    fireEvent.change(screen.getByLabelText("Quantity:"), {
      target: { value: "2" },
    });
    //Waiting for the total price to appear
    await waitFor(() => screen.getByText("400$"));

    //assertions:

    //size option size3
    expect(screen.getByLabelText("size3")).toBeVisible();
    //size option size4
    expect(screen.getByLabelText("size4")).toBeVisible();
    //price of one piece
    expect(screen.getByText("200$")).toBeVisible();
    //total price
    expect(screen.getByText("400$")).toBeVisible();
    //available quantity
    expect(screen.getByText("6")).toBeVisible();
  });
  //------------------------------------------------------------------------------------------
});
//--------------------------------------------------------------------
//--------------------------------------------------------------------
