//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartItem from "./CartItem";
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

describe("Testing CartItem component", () => {
  test("Testing the component when clicking the x button, the component should be removed from screen and local storage", () => {
    //saving an item in the local storage
    let items = {};
    items["1234"] = {
      id: "1234",
      quantity: 2,
    };
    localStorage.setItem("items", JSON.stringify(items));
    //creating a mock item
    let item = {
      _id: "1234",
      name: "Ray-Ban Rounded",
      brand: "Ray-Ban",
      size: "50 50-150",
      color: "Gold",
      ordered_quantity: 2,
      images: ["bla.jpg"],
    };
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
});
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
