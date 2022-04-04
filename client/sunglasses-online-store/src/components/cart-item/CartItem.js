import React, { useRef } from "react";
const CartItem = (props) => {
  const mainDiv = useRef(null);
  const removeItem = () => {
    let items = JSON.parse(localStorage.getItem("items"));
    let newItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== props.item._id) newItems.push(items[i]);
    }
    localStorage.setItem("items", JSON.stringify(newItems));
    mainDiv.current.classList.add("d-none");
    props.checkLocalStorage();
    props.substractPrice(props.item.price, props.item.ordered_quantity);
  };
  return (
    <div
      className="bg-light border rounded m-4 d-flex flex-nowrap"
      ref={mainDiv}
    >
      <img
        className="me-2 rounded align-self-center"
        src={props.item.images[0]}
        alt={props.item.name}
        width="100"
        height="100"
      ></img>
      <div className="d-flex flex-wrap flex-grow-1 align-content-center">
        <span className="me-2">{props.item.name}</span>
        <span className="me-2">{props.item.color}</span>
        <span className="me-2">{props.item.size}</span>
        <span className="me-2">Quantity: {props.item.ordered_quantity}</span>
        <span className="me-2">Price of One Item: {props.item.price}$</span>
        <span className="me-2">
          Total Price: {props.item.price * props.item.ordered_quantity}$
        </span>
      </div>
      <button
        className="btn btn-close"
        type="button"
        onClick={removeItem}
        data-testid="delete-cart-item"
      ></button>
    </div>
  );
};
export default CartItem;
