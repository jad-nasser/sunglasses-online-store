//importing item database model
const Item = require("../models/item");
//----------------------------------------------------------------------------------

//add a new item to the database
async function create_item(item_info) {
  const item = new Item(item_info);
  await item.save();
}
//---------------------------------------------------------------------------------------------

//find items in the database
async function find_items(items_info) {
  const found_items = await Item.find(items_info);
  return found_items;
}
//----------------------------------------------------------------------------------------

//update items in the database
async function update_items(items_info, update_info) {
  await Item.updateMany(items_info, update_info);
}
//----------------------------------------------------------------------------------

//find a item in the database
async function find_item(item_info) {
  const found_item = await Item.findOne(item_info);
  return found_item;
}
//---------------------------------------------------------------------------------------------------

//update an item in the database
async function update_item(items_info, update_info) {
  await Item.updateOne(items_info, update_info);
}
//---------------------------------------------------------------------------------------------

module.exports = {
  create_item,
  find_items,
  update_items,
  find_item,
  update_item,
};
