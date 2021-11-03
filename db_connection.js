//importing modules
const mongoose = require("mongoose");
//---------------------------------------------------------------------------------

//connect to mongodb
function connect(database_name) {
  return mongoose
    .connect("mongodb://localhost:27017/" + database_name, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res, err) => {
      if (err) console.log(err);
      else console.log("Connected to mongodb on port 27017");
    });
}
//----------------------------------------------------------------------------

//disconnect from mongodb
function disconnect() {
  return mongoose.disconnect();
}
//------------------------------------------------------------------------------

module.exports = { connect, disconnect };
