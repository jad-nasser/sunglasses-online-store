import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CartItem from "../cart-item/CartItem";
import Card from "../card/Card";
const Cart = (props) => {
  const [items, setItems] = useState(null);
  const proceedOrderButton = useRef(null);
  const card = useRef(null);
  const error = useRef(null);
  const totalPrice = useRef(0);
  const totalPriceDiv = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getItems = async () => {
      let lsItems = JSON.parse(localStorage.getItem("items"));
      if (!lsItems) lsItems = [];
      try {
        let foundItems = [];

        //this variable is to replace the current local storage and the items that are
        //not found in the database will not be included
        let newLsItems = [];

        //finding the local storage items in the database
        for (let i = 0; i < lsItems.length; i++) {
          let res = await axios.get(
            process.env.REACT_APP_BASE_URL + "item/get_items",
            { params: { id: lsItems[i].id }, withCredentials: true }
          );
          if (
            res.data.length > 0 &&
            res.data[0].quantity >= lsItems[i].quantity
          ) {
            let foundItem = res.data[0];
            foundItem.ordered_quantity = lsItems[i].quantity;
            foundItems.push(foundItem);
            newLsItems.push(lsItems[i]);
          }
        }
        //replacing the old local storage items with the new ones
        localStorage.setItem("items", JSON.stringify(newLsItems));
        //make the "proceed order" button appear if there is atleast one item
        if (foundItems.length > 0)
          proceedOrderButton.current.classList.remove("d-none");
        //add the found items to the state variable
        setItems(foundItems);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    };
    getItems();
  }, []);
  //calculate total price of the cart items
  if (items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total = total + items[i].price * items[i].ordered_quantity;
    }
    totalPrice.current = total;
  }
  //this method called by child components CartItem when the close button is clicked to
  //make the "proceed order" button invisible if there are no more items in the local storage
  const checkLocalStorage = () => {
    let lsItems = JSON.parse(localStorage.getItem("items"));
    if (lsItems.length === 0)
      proceedOrderButton.current.classList.add("d-none");
  };
  //this method called by child components CartItem when the close button is clicked to
  //substract the cart item price from the total price
  const substractPrice = (itemPrice, quantity) => {
    totalPrice.current = totalPrice.current - itemPrice * quantity;
    if (totalPrice.current === 0) totalPriceDiv.current.classList.add("d-none");
    else
      totalPriceDiv.current.textContent =
        "Total Price: " + totalPrice.current + "$";
  };
  //handling proceed order button click
  const handleProceedOrderClick = (e) => {
    if (props.loggedIn) {
      card.current.classList.remove("d-none");
      e.target.classList.add("d-none");
    } else navigate("/sign_in");
  };
  return (
    <div>
      <h3 className="text-center my-4">Shopping Cart</h3>
      {items &&
        items.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            checkLocalStorage={checkLocalStorage}
            substractPrice={substractPrice}
          />
        ))}
      {items && (
        <div ref={totalPriceDiv} className="text-center m-2">
          Total Price: {totalPrice.current}$
        </div>
      )}
      <div className="row">
        <button
          className="btn btn-primary border mx-auto w-auto d-none"
          ref={proceedOrderButton}
          onClick={handleProceedOrderClick}
        >
          Proceed Order
        </button>
      </div>
      <div className="d-none" ref={card}>
        <Card />
      </div>
      <div className="alert alert-danger mx-4 my-2 d-none" ref={error}>
        error
      </div>
    </div>
  );
};
export default Cart;
