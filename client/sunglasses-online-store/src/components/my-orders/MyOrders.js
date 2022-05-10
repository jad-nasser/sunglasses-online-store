import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CustomerOrder from "../customer-order/CustomerOrder";
const MyOrders = () => {
  const [orders, setOrders] = useState(null);
  const error = useRef(null);
  useEffect(() => {
    const getCustomerOrders = async () => {
      try {
        let finalOrders = [];
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "order/get_customer_orders",
          { withCredentials: true }
        );
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status !== "Awaiting Payment") {
            res.data[i].date_time = new Date(res.data[i].date_time);
            finalOrders.push(res.data[i]);
          }
        }
        setOrders(finalOrders);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    };
    getCustomerOrders();
  }, []);
  return (
    <div>
      {orders &&
        orders.map((order, index) => (
          <CustomerOrder key={index} order={order} />
        ))}
      <div className="alert alert-danger text-start d-none" ref={error}>
        error
      </div>
    </div>
  );
};
export default MyOrders;
