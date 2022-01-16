//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartItem from "./CartItem";
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

//creating a mock local storage item
let items = {};
items["1234"] = {
  id: "1234",
  quantity: 2,
};
//creating a mock server item
let item = {
  _id: "1234",
  name: "Ray-Ban Rounded",
  brand: "Ray-Ban",
  size: "50 50-150",
  color: "Gold",
  ordered_quantity: 2,
  images: ["bla.jpg"],
  price: 200,
};
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

afterEach(() => {
  localStorage.removeItem("items");
});
//-----------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

describe("Testing CartItem component", () => {
  test("Testing the component when clicking the x button, the component should be removed from screen and local storage", () => {
    //saving an item in the local storage
    localStorage.setItem("items", JSON.stringify(items));
    //rendering the component
    render(
      <BrowserRouter>
        <CartItem item={item} />
      </BrowserRouter>
    );
    //clicking the x button
    fireEvent.click(screen.getByTestId("delete-cart-item"));
    //assertions
    expect(screen.queryByText("Ray-Ban Rounded")).not.toBeInTheDocument();
    expect(!localStorage.getItem("items")["1234"]).toBe(true);
  });
  //----------------------------------------------------------------------------------------------------

  test('Testing the component with an item in the local storage of quantity=2, the total price should be equal "400$"', () => {
    //saving an item in the local storage
    localStorage.setItem("items", JSON.stringify(items));
    //rendering the component
    render(
      <BrowserRouter>
        <CartItem item={item} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText(/400\$/)).toBeVisible();
  });
  //-----------------------------------------------------------------------------
});
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
