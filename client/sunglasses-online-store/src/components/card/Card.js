import React, { useRef } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
const Card = () => {
  const info = useRef(null);
  const success = useRef(null);
  const error = useRef(null);
  const element = useElements();
  const stripe = useStripe();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!element || !stripe) return;
    //telling the user "Payment proceeding"
    info.current.textContent = "Payment proceeding...";
    info.current.classList.remove("d-none");
    try {
      //getting the cart items from the local storage
      const items = JSON.parse(localStorage.getItem("items"));
      //creating the payment intent on the server
      let res = await axios.post(
        process.env.REACT_APP_BASE_URL + "order/create_orders",
        { items: items }
      );
      let clientSecret = res.data.client_secret;
      //confirm the payment on the client
      let { stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: element.getElement(CardElement) } }
      );
      //displaying the result to the user
      info.current.classList.add("d-none");
      if (stripeError) {
        error.current.textContent = "Error: " + stripeError.message;
        error.current.classList.remove("d-none");
      } else if (paymentIntent.status === "succeeded") {
        success.current.textContent = "Payment succeeded";
        success.current.classList.remove("d-none");
      } else {
        error.current.textContent = "Payment " + paymentIntent.status;
        error.current.classList.remove("d-none");
      }
    } catch (err) {
      info.current.classList.add("d-none");
      error.current.textContent = "Error: " + err.response.data;
      error.current.classList.remove("d-none");
    }
  };
  return (
    <div className="my-4 mx-auto" style={{ maxWidth: "400px" }}>
      <form className="shadow rounded" onSubmit={handleFormSubmit}>
        <label htmlFor="card-element" className="m-2">
          Card
        </label>
        <CardElement id="card-element" className="m-2" />
        <button type="submit" className="btn btn-primary m-2">
          Pay
        </button>
      </form>
      <div className="alert alert-success d-none my-2" ref={success}>
        success
      </div>
      <div className="alert alert-info d-none my-2" ref={info}>
        info
      </div>
      <div className="alert alert-danger d-none my-2" ref={error}>
        error
      </div>
    </div>
  );
};
export default Card;
