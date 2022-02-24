//importing modules
const express = require("express");
const multer = require("multer");
const item_controller = require("../controllers/item_controller");
const user_controller = require("../controllers/user_controller");
//----------------------------------------

//creating router
const router = express.Router();
//----------------------------------------------------

//defining the storage of the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});
//---------------------------------------------------------------------

//filter function that accepts only jpg and png images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else {
    cb(new Error("The image should be jpg or png"), false);
  }
};
//-------------------------------------------------------------------------------------

//initialise multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});
//------------------------------------------------------------------------------

//create a item
//The seller only can create a item
router.post(
  "/create_item",
  user_controller.readCookie,
  user_controller.authenticateSellerToken,
  upload.array("ItemImage", 10),
  item_controller.create_item
);
//-----------------------------------------------------------------------------------

//Search items
router.get("/get_items", item_controller.get_items);
//----------------------------------------------------------

//update items
//onlt the seller can update items
router.patch(
  "/update_items",
  user_controller.readCookie,
  user_controller.authenticateSellerToken,
  upload.array("ItemImage", 10),
  item_controller.update_items
);
//-----------------------------------------------------------------

//get all available brands
router.get("/get_all_brands", item_controller.get_all_brands);
//--------------------------------------------------------------------------

module.exports = router;
