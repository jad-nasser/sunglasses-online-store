import React from "react";
const Order = (props) => {
  const orderDateTime = new Date(props.order.date_time);
  return (
    <div className="d-inline-flex">
      <div
        className="m-4 p-2 rounded border row"
        style={{
          maxWidth: "400px",
          fontSize: "0.9rem",
        }}
      >
        <div className="col">
          <div>Order ID: {props.order._id}</div>
          <div>Item ID: {props.order.item_id}</div>
          <div>Shipment ID: {props.order.shipment_id}</div>
          <div>
            Date and Time:{" "}
            {orderDateTime.toLocaleDateString() +
              " " +
              orderDateTime.toLocaleTimeString()}
          </div>
          <div>First Name: {props.order.user_info[0].first_name}</div>
          <div>Last Name: {props.order.user_info[0].last_name}</div>
          <div>Email: {props.order.user_info[0].email}</div>
          <div>Phone: {props.order.user_info[0].phone}</div>
          <div>Country: {props.order.user_info[0].country}</div>
          <div>
            State/Province/County:{" "}
            {props.order.user_info[0].state_province_county}
          </div>
          <div>City: {props.order.user_info[0].city}</div>
          <div>Street: {props.order.user_info[0].street}</div>
        </div>
        <div className="col">
          <div>
            Bldg/Apt Address: {props.order.user_info[0].bldg_apt_address}
          </div>
          <div>ZIP Code: {props.order.user_info[0].zip_code}</div>
          <div>Item Brand: {props.order.item_brand}</div>
          <div>Item Name: {props.order.item_name}</div>
          <div>Item Color: {props.order.item_color}</div>
          <div>Item Size: {props.order.item_size}</div>
          <div>Item Price: {props.order.item_price}$</div>
          <div>Quantity: {props.order.quantity}</div>
          <div>Total Price: {props.order.total_price}$</div>
          <div>Status: {props.order.status}</div>
        </div>
      </div>
    </div>
  );
};
export default Order;
