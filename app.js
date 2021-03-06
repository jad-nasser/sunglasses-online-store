//importing modules
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieparser = require("cookie-parser");
//--------------------------------------------------------------------------

//importing router files
const user_router = require("./routes/user_router");
const item_router = require("./routes/item_router");
const order_router = require("./routes/order_router");
//--------------------------------------------------------------------------------

//initialise express
const app = express();
//--------------------------------------------------------------------------------

//adding middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyparser.json());
app.use(cookieparser());
//------------------------------------------------------------------------------

//initialising routes
app.use("/user", user_router);
app.use("/item", item_router);
app.use("/order", order_router);
//------------------------------------------------------------------------------------

//set static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//------------------------------------------------------------------------------------------

//catch all get requests that dont match any route in the server
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//------------------------------------------------------------------------------------------

module.exports = app;
