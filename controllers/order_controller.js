//importing modules
require("dotenv").config;
const stripe = require("../stripe");
const order_database_controller = require("../database_controllers/order_database_controller");
const user_database_controller = require("../database_controllers/user_database_controller");
const item_database_controller = require("../database_controllers/item_database_controller");
//--------------------------------------------------------------------

//get all orders for a specific customer
async function get_customer_orders(req, res) {
  try {
    const user_orders = await order_database_controller.find_customer_orders(
      req.user.user_id
    );
    return res.json(user_orders);
  } catch (err) {
    return res.json(err);
  }
}
//------------------------------------------------------------------------------------

//get orders from search query
//this is only for the seller
async function get_orders(req, res) {
  //gathering the search information
  let search_info = {};
  if (req.query.shipment_id) search_info.shipment_id = req.query.shipment_id;
  if (req.query.quantity) search_info.quantity = req.query.quantity;
  if (req.query.status) search_info.status = new RegExp(req.query.status, "i");
  if (req.query.date_time)
    search_info.date_time = new RegExp(req.query.date_time, "i");
  if (req.query.item_name)
    search_info.item_name = new RegExp(req.query.item_name, "i");
  if (req.query.item_brand)
    search_info.item_brand = new RegExp(req.query.item_brand, "i");
  if (req.query.item_color)
    search_info.item_color = new RegExp(req.query.item_color, "i");
  if (req.query.item_size)
    search_info.item_size = new RegExp(req.query.item_size, "i");

  //getting the orders from the database
  try {
    const found_orders = await order_database_controller.find_orders_for_seller(
      search_info
    );
    return res.json(found_orders);
  } catch (err) {
    return res.json(err);
  }
}
//---------------------------------------------------------------------------------------------

//update orders
//only the seller can update the orders
async function update_orders(req, res) {
  //gathering search_info
  let search_info = {};
  if (req.body.search) {
    if (req.body.search.shipment_id)
      search_info.shipment_id = req.body.search.shipment_id;
    if (req.body.search.quantity)
      search_info.quantity = req.body.search.quantity;
    if (req.body.search.status)
      search_info.status = new RegExp(req.body.search.status, "i");
    if (req.body.search.date_time)
      search_info.date_time = new RegExp(req.body.search.date_time, "i");
    if (req.body.search.item_name)
      search_info.item_name = new RegExp(req.body.search.item_name, "i");
    if (req.body.search.item_brand)
      search_info.item_brand = new RegExp(req.body.search.item_brand, "i");
    if (req.body.search.item_color)
      search_info.item_color = new RegExp(req.body.search.item_color, "i");
    if (req.body.search.item_size)
      search_info.item_size = new RegExp(req.body.search.item_size, "i");
  }

  //gathering update info
  let update_info = {};
  if (req.body.update) {
    if (req.body.update.shipment_id)
      update_info.shipment_id = req.body.update.shipment_id;
    if (req.body.update.status) update_info.status = req.body.update.status;
  }

  //updating the orders in the database
  try {
    await order_database_controller.update_orders(search_info, {
      $set: update_info,
    });
    return res.send("Orders successfully updated");
  } catch (err) {
    return res.json(err);
  }
}
//-------------------------------------------------------------------------------------

//this will create the orders but it will not confirmed until the payment is occured
async function create_orders(req, res) {
  let orders = [];
  let total_price = 0;

  //checking if there is ordered items existing in the request
  if (
    !req.body.items ||
    !Array.isArray(req.body.items) ||
    req.body.items.length == 0
  )
    return res.status(404).send("No ordered items found");

  //checking if the number of ordered items is greater than 20 to send a 404 bad request
  if (req.body.items.length > 20)
    return res
      .status(404)
      .send("Number of orders in a session should not be greater than 20");

  //checking if there is a duplicated items
  for (let i = 0; i < req.body.items.length; i++) {
    for (let j = i + 1; j < req.body.items.length; j++) {
      if (req.body.items[i].id === req.body.items[j].id)
        return res.status(404).send("Duplicated items are not allowded");
    }
  }

  //checking if the customer email and phone are verified
  try {
    const user = await user_database_controller.find_user({
      _id: req.user.user_id,
    });
    if (!user.is_phone_verified)
      return res
        .status(403)
        .send("You need to verify your phone to proceed this order");
    if (!user.is_email_verified)
      return res
        .status(403)
        .send("You need to verify your email to proceed this order");
  } catch (err) {
    return res.json(err);
  }

  // checking the format of the items in the request, and checking if these items are really available
  //in the database with the enought quantity, and finally if the conditions before are true the
  //total price of the order will be calculated and this order will be added to the list of the orders
  //that will be added to the database later.
  for (let i = 0; i < req.body.items.length; i++) {
    //checking if an item in the request is in good format
    if (
      !req.body.items[i].id ||
      !req.body.items[i].quantity ||
      typeof req.body.items[i].quantity !== "number" ||
      req.body.items[i].quantity <= 0
    ) {
      return res.status(404).send("Bad request");
    }
    //getting an item from the database
    let item = null;
    try {
      item = await item_database_controller.find_item({
        _id: req.body.items[i].id,
      });
    } catch (err) {
      return res.json(err);
    }
    //checking if an item is found
    if (!item)
      return res.status(404).send("Some items in your request is not found");
    //checking if there is enougth quantity according to the request
    if (item.quantity < req.body.items[i].quantity)
      return res
        .status(404)
        .send("Some ordered item quantity are not available in our store");
    //adding the price of the order in total price variable
    total_price = total_price + item.price * req.body.items[i].quantity;
    //putting the found item in some variables
    let order = {};
    order.item_id = item._id;
    order.user_id = req.user.user_id;
    order.quantity = req.body.items[i].quantity;
    order.item_name = item.name;
    order.item_price = item.price;
    order.item_size = item.size;
    order.item_brand = item.brand;
    order.item_color = item.color;
    orders[i] = order;
  }

  //creating the payment intent
  let paymentIntent = null;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: total_price * 100,
      currency: "usd",
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });
  } catch (err) {
    return res.json(err);
  }

  //add the payment intent id to each order in the orders list
  for (let i = 0; i < orders.length; i++) {
    orders[i].payment_intent_id = paymentIntent.id;
  }

  //inserting the orders in the database
  try {
    await order_database_controller.create_orders(orders);
  } catch (err) {
    return res.json(err);
  }

  //sending the client_secret to the user
  return res.json({ client_secret: paymentIntent.client_secret });
}
//-------------------------------------------------------------------------------------

//this method to handle purchase events
//this method will procced the order if a payment is successfully recieved
//this method also will delete the orders of the canceled payment intents
async function webhook(request, response) {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    //payment successfully recieved
    case "payment_intent.succeeded":
      try {
        //getting the orders of this payment intent from the database
        const orders = await order_database_controller.find_orders({
          payment_intent_id: request.body.data.object.id,
        });
        //decrementing the items quantities according to orders quantities
        for (let i = 0; i < orders.length; i++) {
          await item_database_controller.update_item(
            { _id: orders[i].item_id },
            { $inc: { quantity: -orders[i].quantity } }
          );
        }
        //procceeding the orders by updating its status
        await order_database_controller.update_orders(
          { payment_intent_id: request.body.data.object.id },
          { $set: { status: "Awaiting Shipment" } }
        );
      } catch (err) {
        console.log(err);
      }
      console.log("successful purchase");
      break;

    //when the payment intent is canceled
    case "payment_intent.canceled":
      try {
        //deleting the orders from the database
        await order_database_controller.delete_orders({
          payment_session_id: request.body.data.object.id,
        });
      } catch (err) {
        console.log(err);
      }
      console.log("Payment intent canceled");
      break;

    //for the events that you not need to do anything when they occure
    default:
      console.log("unhandled event type");
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
}
//--------------------------------------------------------------------------------

module.exports = {
  get_customer_orders,
  get_orders,
  update_orders,
  create_orders,
  webhook,
};
