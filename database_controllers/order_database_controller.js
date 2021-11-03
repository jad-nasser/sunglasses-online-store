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

//update orders in the database
async function update_orders(search_info, update_info) {
  await Order.updateMany(search_info, update_info);
}
//--------------------------------------------------------------------------------------------

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
};
