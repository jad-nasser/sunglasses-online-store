//importing modules
const express = require("express");
const user_controller = require("../controllers/user_controller");
//----------------------------------------

//creating router
const router = express.Router();
//----------------------------------------------------

//create a user
router.post(
  "/create_user",
  user_controller.email_validate,
  user_controller.password_validate,
  user_controller.phone_validate,
  user_controller.create_user
);
//-----------------------------------------------------------------------------------

//user login
router.post("/user_login", user_controller.user_login);
//-------------------------------------------------------------------------------------------

//delete a user
//only the user can delete its own account
router.delete(
  "/delete_user",
  user_controller.authenticateCustomerToken,
  user_controller.delete_user
);
//------------------------------------------------------------

//update user info
//only the user can update its own account
router.patch(
  "/update_user",
  user_controller.authenticateCustomerToken,
  user_controller.email_validate,
  user_controller.password_validate,
  user_controller.phone_validate,
  user_controller.update_user
);
//-----------------------------------------------------------------

//this method is for testing only you should use an api to verify email address
//this method is to verify the email address of a customer
router.post(
  "/verify_email_for_testing_only",
  user_controller.authenticateCustomerToken,
  user_controller.verify_email_for_testing_only
);
//----------------------------------------------------------------------------------------

//this method is only for testing the actual one should use an api for that
//this method is to verify phone number of a customer
router.post(
  "/verify_phone_for_testing_only",
  user_controller.authenticateCustomerToken,
  user_controller.verify_phone_for_testing_only
);
//---------------------------------------------------------------------------------------------------------

module.exports = router;
