//importing modules
const app = require("./app");
const mongoose = require("./db_connection");
//--------------------------------------------------------------------------

//connect to mongodb
mongoose.connect("sunglasses-online-store");
//------------------------------------------------------------------------------------------

//start server listenning
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
//--------------------------------------------------------------------------------------------------
