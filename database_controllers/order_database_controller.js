//importing order database model
const Order = require("../models/order");
//--------------------------------------------------------------------------------------

//find all orders for a specific customer in the database
async function find_customer_orders(customer_id) {
  const customer_orders = await Order.aggregate([
    {
      $match: {
        user_id: customer_id,
      },
    },
    {
      $addFields: {
        item_id: { $toObjectId: "$item_id" },
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "item_id",
        foreignField: "_id",
        as: "item_info",
      },
    },
    {
      $project: {
        "item_info.images": 1,
        item_name: 1,
        item_id: 1,
        status: 1,
        quantity: 1,
        date_time: 1,
        item_brand: 1,
        item_size: 1,
        item_color: 1,
        item_price: 1,
      },
    },
  ]);
  return customer_orders;
}
//--------------------------------------------------------------------------------------

//find orders in the database
async function find_orders(search_info) {
  const orders = await Order.find(search_info);
  return orders;
}
//-------------------------------------------------------------------------------------------

//find orders in the database and represent them for the seller
async function find_orders_for_seller(search_info) {
  const orders = await Order.aggregate([
    {
      $match: search_info,
    },
    {
      $addFields: {
        user_id: { $toObjectId: "$user_id" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $project: {
        "user_info.first_name": 1,
        "user_info.last_name": 1,
        "user_info.email": 1,
        "user_info.phone": 1,
        "user_info.country": 1,
        "user_info.city": 1,
        "user_info.street": 1,
        "user_info.state_province_county": 1,
        "user_info.bldg_apt_address": 1,
        "user_info.zip_code": 1,
        item_name: 1,
        item_id: 1,
        status: 1,
        quantity: 1,
        date_time: 1,
        item_brand: 1,
        item_size: 1,
        item_color: 1,
        item_price: 1,
        shipment_id: 1,
        _id: 1,
        total_price: { $multiply: ["$item_price", "$quantity"] },
      },
    },
  ]);
  return orders;
}
//--------------------------------------------------------------------------------------------

//update orders in the database
async function update_orders(search_info, update_info) {
  await Order.updateMany(search_info, update_info);
}
//--------------------------------------------------------------------------------------------

//this method is used when the seller updates the orders not the system
//the main purpose of this method is to make sure that the orders that have status= 'Awaiting Payment'
//will not updated
async function update_orders_by_seller(search_info, update_info) {
  await Order.updateMany(
    { $and: [{ status: { $ne: "Awaiting Payment" } }, search_info] },
    update_info
  );
}
//------------------------------------------------------------------------------

//add new orders to the database
async function create_orders(orders) {
  await Order.insertMany(orders);
}
//------------------------------------------------------------------------------------

//delete orders from the database
async function delete_orders(search_info) {
  await Order.deleteMany(search_info);
}
//------------------------------------------------------------------------------------

module.exports = {
  find_customer_orders,
  find_orders,
  update_orders,
  create_orders,
  delete_orders,
  find_orders_for_seller,
  update_orders_by_seller,
};
