//importing modules
const express = require("express");
const bodyparser = require("body-parser");
const order_controller = require("../controllers/order_controller");
const user_controller = require("../controllers/user_controller");
//--------------------------------------------------------------------

//initialising router
const router = express.Router();
//---------------------------------------------------------------

//get all orders for a specific customer
router.get(
  "/get_customer_orders",
  user_controller.authenticateCustomerToken,
  order_controller.get_customer_orders
);
//------------------------------------------------------------------------------------

//get orders from search query
//this is only for the seller
router.get(
  "/get_orders",
  user_controller.authenticateSellerToken,
  order_controller.get_orders
);
//---------------------------------------------------------------------------------------------

//update orders
//only the seller can update the orders
router.patch(
  "/update_orders",
  user_controller.authenticateSellerToken,
  order_controller.update_orders
);
//-------------------------------------------------------------------------------------

//this will create the orders but it will not confirmed until the payment is occured
//the customer can only create orders
router.post(
  "/create_orders",
  user_controller.authenticateCustomerToken,
  order_controller.create_orders
);
//-------------------------------------------------------------------------------------

//this method will check if the orders quantities are still available at the store
//this method will be triggered before the purchase is done
//if the orders are not valid its payment_intent will be cancelled
router.get("/check_orders_validity", order_controller.check_orders_validity);
//--------------------------------------------------------------------------------------

//this method to handle purchase events
//this method will procced the order if a payment is successfully recieved
//this method also will delete the orders of the canceled payment intents
router.post(
  "/webhook",
  bodyparser.raw({ type: "application/json" }),
  order_controller.webhook
);
//--------------------------------------------------------------------------------

module.exports = router;
