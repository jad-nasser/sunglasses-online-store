import React from "react";
const CustomerOrder = (props) => {
  let statusBootstrapColor = "text-info";
  if (props.order.status === "Delivered") statusBootstrapColor = "text-success";
  return (
    <div className="bg-light border rounded m-4 d-flex flex-nowrap">
      <img
        className="me-2 rounded align-self-center"
        src={process.env.REACT_APP_BASE_URL + props.order.item_info.images[0]}
        alt={props.order.item_name}
        width="100"
        height="100"
      ></img>
      <div className="d-flex flex-wrap flex-grow-1 align-content-center">
        <span className="me-2">{props.order.item_name}</span>
        <span className="me-2">{props.order.item_color}</span>
        <span className="me-2">{props.order.item_size}</span>
        <span className="me-2">{props.order.item_price}$</span>
        <span className="me-2">Quantity: {props.order.quantity}</span>
        <span className="me-2">
          Total Price: {props.order.item_price * props.order.quantity}$
        </span>
        <span className="me-2">
          Ordered in: {props.order.date_time.toLocaleDateString()}{" "}
          {props.order.date_time.toLocaleTimeString()}
        </span>
      </div>
      <span className={"me-2 align-self-center " + statusBootstrapColor}>
        {props.order.status}
      </span>
    </div>
  );
};
export default CustomerOrder;
