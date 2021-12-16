//importing modules
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserItem from "./UserItem";
import { BrowserRouter } from "react-router-dom";
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//creating some mock sunglasses items that will be used in the tests
let items = [];
let images = [];
images[0] = "blablabla";
items[0] = {
  name: "Sunglasses 1",
  price: 200,
  images,
};
items[1] = {
  name: "Sunglasses 1",
  price: 230,
  images,
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

describe("Testing UserItem component", () => {
  //testing user item by creating a one with props that contains items with different prices.
  //It should render the price as "200$ - 230$"
  test('It should render "200$ - 230$" as a range price', () => {
    //rendering the user item
    render(
      <BrowserRouter>
        <UserItem items={items} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("200$ - 230$")).toBeVisible();
  });
  //--------------------------------------------------------------------------------------------

  //testing UserItem component by creating a one and sending to it items that have the same price
  //it should render 200$
  test('It should render "200$" as price', () => {
    //changing the items so that they have the same price
    items[1].price = 200;
    //rendering the user item component
    render(
      <BrowserRouter>
        <UserItem items={items} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getByText("200$")).toBeVisible();
  });
  //----------------------------------------------------------------------------------------
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
