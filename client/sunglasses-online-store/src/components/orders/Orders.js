import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Order from "../order/Order";
import OrderUpdator from "../order-updator/OrderUpdator";
const Orders = (props) => {
  const [orders, setOrders] = useState(null);
  const error = useRef(null);
  const totalPrice = useRef(0);
  //getting the orders from the database
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BASE_URL + "order/get_orders",
          { params: props.requestQuery }
        );
        //remove the orders that has status= 'Awaiting Payment' and calculating all orders total price
        let foundOrders = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status !== "Awaiting Payment") {
            totalPrice.current = totalPrice.current + res.data[i].total_price;
            foundOrders.push(res.data[i]);
          }
        }
        setOrders(foundOrders);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    };
    getOrders();
  }, [props.requestQuery]);
  //the component
  return (
    <div>
      <h3 className="text-center m-4">Orders</h3>
      <div className="m-2 text-center">Update Orders</div>
      <OrderUpdator requestQuery={props.requestQuery} />
      <div className="alert alert-danger mx-4 d-none" ref={error}>
        error
      </div>
      <div className="mt-4 text-center">
        Total Orders Price: {totalPrice.current}$
      </div>
      {orders &&
        orders.map((order, index) => <Order order={order} key={index} />)}
    </div>
  );
};
export default Orders;
