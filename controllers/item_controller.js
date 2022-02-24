//importing modules
const fs = require("fs");
require("dotenv").config();
const item_database_controller = require("../database_controllers/item_database_controller");
const imageLinksCount_database_controller = require("../database_controllers/imageLinksCount_database_controller");
//------------------------------------------------------------------------------------------

//create a item
//The seller only can create a item
async function create_item(req, res) {
  //verify the existence of every needed field in the request
  if (!req.body.name) return res.status(404).send("Item name not found");
  if (!req.body.brand) return res.status(404).send("Item brand not found");
  if (!req.body.color) return res.status(404).send("Item color not found");
  if (!req.body.size) return res.status(404).send("Item size not found");
  if (!req.body.price) return res.status(404).send("Item price not found");
  if (!req.body.quantity)
    return res.status(404).send("Item quantity not found");
  if (!req.files || !Array.isArray(req.files) || req.files.length == 0)
    return res.status(404).send("At least one image is required");

  //gathering the necessary fields from the request body to item_info object
  var item_info = {};
  item_info.name = req.body.name;
  item_info.brand = req.body.brand;
  item_info.color = req.body.color;
  item_info.size = req.body.size;
  item_info.price = req.body.price;
  item_info.quantity = req.body.quantity;
  item_info.images = [];
  for (let i = 0; i < req.files.length; i++) {
    item_info.images[i] = req.files[i].path;
  }

  //adding new images count records to the database
  try {
    for (let i = 0; i < item_info.images.length; i++) {
      await imageLinksCount_database_controller.create_imageLinksCount({
        image: item_info.images[i],
      });
    }
  } catch (err) {
    return res.json(err);
  }

  //adding the new item to the database
  try {
    await item_database_controller.create_item(item_info);
  } catch (err) {
    return res.json(err);
  }

  return res.send("Item added successfully");
}
//-----------------------------------------------------------------------------------

//Search items
async function get_items(req, res) {
  //check the fields that are provided in the request to find items and gathering them in one object called
  //item_search_info.
  var item_search_info = {};
  if (req.body.name) item_search_info.name = new RegExp(req.body.name, "i");
  if (req.body.brand) item_search_info.brand = new RegExp(req.body.brand, "i");
  if (req.body.color) item_search_info.color = new RegExp(req.body.color, "i");
  if (req.body.size) item_search_info.size = new RegExp(req.body.size, "i");
  if (req.body.price) item_search_info.price = req.body.price;
  if (req.body.quantity) item_search_info.quantity = req.body.quantity;

  //using the item_search_info search data to find the items in the database
  let found_items = null;
  try {
    found_items = await item_database_controller.find_items(item_search_info);
  } catch (err) {
    return res.json(err);
  }

  return res.json(found_items);
}
//----------------------------------------------------------

//update items
//onlt the seller can update items
async function update_items(req, res) {
  //gathering the search info to know which items should be updated
  var item_search_info = {};
  if (req.body.search) {
    if (req.body.search.name)
      item_search_info.name = new RegExp(req.body.search.name, "i");
    if (req.body.search.brand)
      item_search_info.brand = new RegExp(req.body.search.brand, "i");
    if (req.body.search.color)
      item_search_info.color = new RegExp(req.body.search.color, "i");
    if (req.body.search.size)
      item_search_info.size = new RegExp(req.body.search.size, "i");
    if (req.body.search.price) item_search_info.price = req.body.search.price;
    if (req.body.search.quantity)
      item_search_info.quantity = req.body.search.quantity;
  }

  //gathering the update info
  var item_update_info = {};
  if (req.body.update) {
    if (req.body.update.name) item_update_info.name = req.body.update.name;
    if (req.body.update.brand) item_update_info.brand = req.body.update.brand;
    if (req.body.update.color) item_update_info.color = req.body.update.color;
    if (req.body.update.size) item_update_info.size = req.body.update.size;
    if (req.body.update.price) item_update_info.price = req.body.update.price;
    if (req.body.update.quantity)
      item_update_info.quantity = req.body.update.quantity;
  }
  if (req.files && Array.isArray(req.files)) {
    if (req.files.length > 0) {
      item_update_info.images = [];
      for (let i = 0; i < req.files.length; i++) {
        item_update_info.images[i] = req.files[i].path;
      }
    }
  }

  //in case there are new images to replace the item's old images the image links count of the old images
  //should be decremented or deleted in case there is only still one link available.
  //in case there are still only one link count to an image not only the count will be deleted from the
  //database but also the image will be deleted.
  //also the new images links count will be added to the database
  try {
    if (req.files && Array.isArray(req.files)) {
      if (req.files.length > 0) {
        //getting the items that will be updated later
        const unupdated_items = await item_database_controller.find_items(
          item_search_info
        );
        //get the image link count to each old image to each item and modify it
        for (let i = 0; i < unupdated_items.length; i++) {
          for (let j = 0; j < unupdated_items[i].images.length; j++) {
            //get the image link count
            let image_links_count =
              await imageLinksCount_database_controller.find_imageLinksCount({
                image: unupdated_items[i].images[j],
              });
            //in case the link count is greater than one the count will be decremented
            if (image_links_count.count > 1) {
              await imageLinksCount_database_controller.update_imageLinksCount(
                { image: unupdated_items[i].images[j] },
                { $inc: { count: -1 } }
              );
            }
            //else the count will be deleted and also the image will be deleted
            else {
              await imageLinksCount_database_controller.delete_imageLinksCount({
                image: unupdated_items[i].images[j],
              });
              fs.unlinkSync(unupdated_items[i].images[j]);
            }
          }
        }
        //add the new images links counts records in the database
        //the new images path will replace the old images of the items after the items update later
        for (let i = 0; i < item_update_info.images.length; i++) {
          await imageLinksCount_database_controller.create_imageLinksCount({
            image: item_update_info.images[i],
            count: unupdated_items.length,
          });
        }
      }
    }
  } catch (err) {
    return res.json(err);
  }

  //updating the items with the information provided
  try {
    await item_database_controller.update_items(item_search_info, {
      $set: item_update_info,
    });
  } catch (err) {
    return res.json(err);
  }

  return res.send("items successfully updated.");
}
//-----------------------------------------------------------------

//getting all the available brands
async function get_all_brands(req, res) {
  try {
    let found_brands = await item_database_controller.find_all_brands();
    return res.json({ brands: found_brands });
  } catch (err) {
    res.status(500).send(err);
  }
}
//----------------------------------------------------------------------------

module.exports = {
  create_item,
  get_items,
  update_items,
  get_all_brands,
};
