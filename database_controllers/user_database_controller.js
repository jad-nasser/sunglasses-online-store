//importing user model
const User = require("../models/user");
//--------------------------------------------------------------------------

//create a user in the database
async function create_user(user_info) {
  const user = new User(user_info);
  await user.save();
}
//------------------------------------------------------------------------------

//find a user in the database
async function find_user(user_info) {
  const found_user = await User.findOne(user_info);
  return found_user;
}
//----------------------------------------------------------------------------------------------

//delete a user from database
async function delete_user(user_info) {
  await User.deleteOne(user_info);
}
//----------------------------------------------------------------------------------------------------------

//update a user in the database
async function update_user(user_info, update_info) {
  await User.updateOne(user_info, update_info);
}
//----------------------------------------------------------------------------------------------

module.exports = {
  create_user,
  find_user,
  delete_user,
  update_user,
};
