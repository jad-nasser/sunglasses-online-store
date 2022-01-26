//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import ViewItem from "./ViewItem";
import { BrowserRouter } from "react-router-dom";
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

afterEach(() => localStorage.removeItem("items"));
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing ViewItem component", () => {
  test('Testing the component when there is no item or the requested item is not found, it should display "Item not foumd" and the "Add to cart" button should be disabled', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("Item not found")).toBeVisible();
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled();
  });
  //-----------------------------------------------------------------------------------------

  test('Testing the component without specifying the needed quantities', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
        //clicking the "Add to cart" button
        fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    //assertions
    expect(screen.getByText("Enter the needed quantities")).toBeVisible();
  });
  //-------------------------------------------------------------------------------------------

  test('Testing the component when clicking the "Add to cart" button with quantites that are greater than the available quantities it should display "Error: Not available quantities" ', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //change the quantities input for a value that is larger than the available quantities
    fireEvent.change(screen.getByLabelText("Quantity:"), {
      target: { value: "100" },
    });
    //clicking the "Add to cart" button
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    //assertions
    expect(screen.getByText("Error: Not available quantities")).toBeVisible();
  });
  //-----------------------------------------------------------------------------------------

  test('Testing the component when everything is done correctly, it should display "Item added to the shopping cart" and the item should be saved in the local storage', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //change the quantities input
    fireEvent.change(screen.getByLabelText("Quantity:"), {
      target: { value: "1" },
    });
    //clicking the "Add to cart" button
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    //assertions
    expect(screen.getByText("Item added to the shopping cart")).toBeVisible();
    expect(localStorage.getItem("items")).toBeTruthy();
  });
  //------------------------------------------------------------------------------------------

  test('Testing the component selection functionalities after selecting "color2" with quantity=2 it should render the available sizes that are: "size3" and "size4" with "Price of One Piece: 200$" and "Total Price: 400$" and "Available Quantities: 6"', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <ViewItem items={items} />
      </BrowserRouter>
    );
    //selecting "color2" color
    fireEvent.click(screen.getByLabelText("color2"));
    //change the quantities input to "2"
    fireEvent.change(screen.getByLabelText("Quantity:"), {
      target: { value: "2" },
    });
    //assertions
    expect(screen.getByLabelText("size3")).toBeVisible();
    expect(screen.getByLabelText("size4")).toBeVisible();
    expect(screen.getByText("Size of One Piece: 200$")).toBeVisible();
    expect(screen.getByText("Total Price: 400$")).toBeVisible();
    expect(screen.getByText("Available Quantities: 6")).toBeVisible();
  });
  //------------------------------------------------------------------------------------------
});
//--------------------------------------------------------------------
//--------------------------------------------------------------------
