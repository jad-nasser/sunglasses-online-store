//importing modules
const jwt = require("jsonwebtoken");
require("dotenv").config();
const user_database_controller = require("../database_controllers/user_database_controller");
//----------------------------------------------------------------------------------------------

//create a user
async function create_user(req, res) {
  //verify the existence of every needed field in the request
  if (!req.body.first_name)
    return res.status(404).send("User first name not found");
  if (!req.body.last_name)
    return res.status(404).send("User last name not found");
  if (!req.body.email) return res.status(404).send("User email not found");
  if (!req.body.password)
    return res.status(404).send("User password not found");
  if (!req.body.phone) return res.status(404).send("User phone not found");
  if (!req.body.country) return res.status(404).send("User country not found");
  if (!req.body.city) return res.status(404).send("User city not found");
  if (!req.body.street) return res.status(404).send("User street not found");
  if (!req.body.state_province_county)
    return res.status(404).send("User state_province_county not found");
  if (!req.body.bldg_apt_address)
    return res.status(404).send("User bldg_apt_address not found");
  if (!req.body.zip_code)
    return res.status(404).send("User zip_code not found");

  //check if email, password, and phone are valid by checking the results created by the
  //validation middlewares
  if (!req.body.email_validate)
    return res.status(404).send("The email is not valid");
  if (!req.body.password_validate)
    return res.status(404).send("The password is not valid");
  if (!req.body.phone_validate)
    return res.status(404).send("The phone is not valid");

  //gathering the necessary fields from the request body to user_info object
  var user_info = {};
  user_info.first_name = req.body.first_name;
  user_info.last_name = req.body.last_name;
  user_info.email = req.body.email;
  user_info.password = req.body.password;
  user_info.phone = req.body.phone;
  user_info.country = req.body.country;
  user_info.city = req.body.city;
  user_info.street = req.body.street;
  user_info.state_province_county = req.body.state_province_county;
  user_info.bldg_apt_address = req.body.bldg_apt_address;
  user_info.zip_code = req.body.zip_code;

  //adding the new user to the database
  try {
    await user_database_controller.create_user(user_info);
  } catch (err) {
    res.json(err);
  }

  //user created successfully
  return res.send("User added successfully");
}
//-----------------------------------------------------------------------------------

//user login
async function user_login(req, res) {
  //check if the email and password fields are exist
  let user = {};
  if (!req.body.email) return res.status(404).send("Email not found");
  else user.email = req.body.email;
  if (!req.body.password) return res.status(404).send("Password not found");
  else user.password = req.body.password;

  //find the user in the database
  let found_user = null;
  try {
    found_user = await user_database_controller.find_user(user);
  } catch (err) {
    return res.json(err);
  }

  //check if the user is not found
  if (!found_user) {
    return res.status(404).send("User not found");
  }

  //give a token to the user according to the user type
  let user_token_info = {};
  user_token_info.user_id = found_user._id;
  user_token_info.user_type = found_user.user_type;
  if (found_user.user_type === "seller") {
    const seller_token = jwt.sign(
      user_token_info,
      process.env.SELLER_LOGIN_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", JSON.stringify({ token: seller_token }), {
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 1000 * 60 * 60 * 24),
    });
    return res.status(200).json({ token: seller_token });
  } else if (found_user.user_type === "customer") {
    const customer_token = jwt.sign(
      user_token_info,
      process.env.CUSTOMER_LOGIN_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", JSON.stringify({ token: customer_token }), {
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 1000 * 60 * 60 * 24),
    });
    return res.status(200).json({ token: customer_token });
  }
}
//-------------------------------------------------------------------------------------------

//customer token authentication middleware function
function authenticateCustomerToken(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(404).send("No token found");
  jwt.verify(token, process.env.CUSTOMER_LOGIN_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Not valid token");
    req.user = user;
    next();
  });
}
//-----------------------------------------------------------------------------------------------

//seller token authentication middleware function
function authenticateSellerToken(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(404).send("No token found");
  jwt.verify(token, process.env.SELLER_LOGIN_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Not valid token");
    req.user = user;
    next();
  });
}
//----------------------------------------------------------------------------------------------

//read cookie middleware function
//this function is used to read the authentication info in cookies sent by users
function readCookie(req, res, next) {
  if (!req.cookies || !req.cookies.token)
    return res.status(404).send("No token found");
  req.headers.authorization = "Bearer " + req.cookies.token;
  next();
}
//----------------------------------------------------------------------------------------------

//this function is to check if the customer is logged in
function check_customer_login(req, res) {
  if (!req.cookies || !req.cookies.token) return res.send(false);
  jwt.verify(
    req.cookies.token,
    process.env.CUSTOMER_LOGIN_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.send(false);
      return res.send(true);
    }
  );
}
//---------------------------------------------------------------------------------------------

//this function is to check if the seller is logged in
function check_seller_login(req, res) {
  if (!req.cookies || !req.cookies.token) return res.send(false);
  jwt.verify(
    req.cookies.token,
    process.env.SELLER_LOGIN_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.send(false);
      return res.send(true);
    }
  );
}
//----------------------------------------------------------------------------------------------

//this function is for user sign out
function sign_out(req, res) {
  res.cookie("token", "", {
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - 1 * 1000 * 60 * 60 * 24),
  });
  return res.status(200).send("Successfully signed out");
}
//----------------------------------------------------------------------------------------------

//delete a user
//only the user can delete its own account
async function delete_user(req, res) {
  try {
    await user_database_controller.delete_user({
      _id: req.user.user_id,
    });
  } catch (err) {
    return res.json(err);
  }
  return res.send(
    "The user with the ID:" + req.user.user_id + " is successfully deleted."
  );
}
//------------------------------------------------------------

//update user info
//only the user can update its own account
async function update_user(req, res) {
  //check the fields that the user want to update and gathering them in one object called user_update_info.
  //during checking also the email, phone, and password will be checked for their validation results by the
  //validation middlewares if the user want to change any of them.
  var user_update_info = {};
  if (req.body.first_name) user_update_info.first_name = req.body.first_name;
  if (req.body.last_name) user_update_info.last_name = req.body.last_name;
  if (req.body.email) {
    if (!req.body.email_validate)
      return res.status(404).send("The email is not valid");
    user_update_info.email = req.body.email;
    user_update_info.is_email_verified = false;
  }
  if (req.body.password) {
    if (!req.body.password_validate)
      return res.status(404).send("The password is not valid");
    user_update_info.password = req.body.password;
  }
  if (req.body.phone) {
    if (!req.body.phone_validate)
      return res.status(404).send("The phone is not valid");
    user_update_info.phone = req.body.phone;
    user_update_info.is_phone_verified = false;
  }
  if (req.body.country) user_update_info.country = req.body.country;
  if (req.body.city) user_update_info.city = req.body.city;
  if (req.body.street) user_update_info.street = req.body.street;
  if (req.body.state_province_county)
    user_update_info.state_province_county = req.body.state_province_county;
  if (req.body.bldg_apt_address)
    user_update_info.bldg_apt_address = req.body.bldg_apt_address;
  if (req.body.zip_code) user_update_info.zip_code = req.body.zip_code;

  //update the user info with the information the user provided
  try {
    await user_database_controller.update_user(
      { _id: req.user.user_id },
      { $set: user_update_info }
    );
  } catch (err) {
    return res.json(err);
  }

  //user successfully updated
  return res.json("User successfully updated.");
}
//-----------------------------------------------------------------

//this method is to get the logged in user info
async function get_user(req, res) {
  //finding the user in the database
  let user_info = {};
  try {
    user_info = await user_database_controller.find_user({
      _id: req.user.user_id,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
  //removing the password for security reasons
  delete user_info.password;
  //returning user_info
  return res.json({ user_info });
}
//-------------------------------------------------------------------------------------------

//this method is used to check if the current email is already exists
async function check_email(req, res) {
  //checking if email field is not exist
  if (!req.body.email) return res.status(404).send("Write an email address");
  //getting the user that has that email from the database
  let user_info = {};
  try {
    user_info = await user_database_controller.find_user({
      email: req.body.email,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
  //checking if no email found
  if (!user_info) return res.json({ check_email: false });
  //returning true after the email is found
  return res.json({ check_email: true });
}
//-------------------------------------------------------------------------------------------

//this method is used to check if the entered password is correct
//the user can only check his/her password
async function check_password(req, res) {
  //checking if password field is not exist
  if (!req.body.password) return res.status(404).send("Write your password");
  //getting the logged in user from the database
  let user_info = {};
  try {
    user_info = await user_database_controller.find_user({
      _id: req.user.user_id,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
  //checking if the entered password is not correct
  if (req.body.password !== user_info.password)
    return res.json({ check_password: false });
  //returning true because the entered password is correct
  return res.json({ check_password: true });
}
//-------------------------------------------------------------------------------------------

//this method is for testing only you should use an api to verify email address
//this method is to verify the email address of a customer
async function verify_email_for_testing_only(req, res) {
  try {
    await user_database_controller.update_user(
      { _id: req.user.user_id },
      { $set: { is_email_verified: true } }
    );
  } catch (err) {
    return res.json(err);
  }
  return res.send("Your email address is succesfully verified");
}
//----------------------------------------------------------------------------------------

//this method is only for testing the actual one should use an api for that
//this method is to verify phone number of a customer
async function verify_phone_for_testing_only(req, res) {
  try {
    await user_database_controller.update_user(
      { _id: req.user.user_id },
      { $set: { is_phone_verified: true } }
    );
  } catch (err) {
    return res.json(err);
  }
  return res.send("Your phone number is succesfully verified");
}
//---------------------------------------------------------------------------------------------------------

//email validation middleware
async function email_validate(req, res, next) {
  //check the existence of the email field and also check if it has the legal length
  if (!req.body.email || req.body.email.length > 40) {
    req.body.email_validate = false;
    next();
    return;
  }

  //checking if the email is valid by using a regex
  let email_re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email_re.test(req.body.email)) {
    req.body.email_validate = false;
    next();
    return;
  }

  //checking if other user have the same email
  let already_existing_email = null;
  try {
    already_existing_email = await user_database_controller.find_user({
      email: req.body.email,
    });
  } catch (err) {
    return res.json(err);
  }
  if (already_existing_email) {
    req.body.email_validate = false;
    next();
    return;
  }

  //after everythings is validated correctly the email_validate field is added to the request so the other
  //middleware can read this info
  req.body.email_validate = true;
  next();
}
//------------------------------------------------------------------------------------

//password validation middleware
function password_validate(req, res, next) {
  //check if password exists in the request and also check if it has the apropriate length
  if (!req.body.password || req.body.password.length > 32) {
    req.body.password_validate = false;
    next();
    return;
  }

  //validation using regex
  let pass_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  if (!pass_re.test(req.body.password)) {
    req.body.password_validate = false;
    next();
    return;
  }

  //after everythings is validated correctly the password_validate field is added to the request so the other
  //middleware can read this info
  req.body.password_validate = true;
  next();
}
//--------------------------------------------------------------------------------------------

//phone validation middleware
function phone_validate(req, res, next) {
  //check if phone exists in the request and also check if it has the appropriate length
  if (!req.body.phone || req.body.phone.length > 40) {
    req.body.phone_validate = false;
    next();
    return;
  }

  //validation using regex
  let phone_re = /^\+[0-9]+/;
  if (!phone_re.test(req.body.phone)) {
    req.body.phone_validate = false;
    next();
    return;
  }

  //after everythings is validated correctly the phone_validate field is added to the request so the other
  //middleware can read this info
  req.body.phone_validate = true;
  next();
}
//--------------------------------------------------------------------------------------------

module.exports = {
  create_user,
  user_login,
  delete_user,
  update_user,
  verify_email_for_testing_only,
  verify_phone_for_testing_only,
  authenticateCustomerToken,
  email_validate,
  password_validate,
  phone_validate,
  authenticateSellerToken,
  get_user,
  check_password,
  check_email,
  readCookie,
  check_seller_login,
  check_customer_login,
  sign_out,
};
