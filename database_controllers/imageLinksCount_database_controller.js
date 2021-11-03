//importing ImageLinksCount model
const ImageLinksCount = require("../models/imageLinksCount");
//----------------------------------------------------------------------------

//add imageLinksCount record to the database
async function create_imageLinksCount(info) {
  const imageLinksCount = new ImageLinksCount(info);
  await imageLinksCount.save();
}
//---------------------------------------------------------------------------------------

//find a imageLinksCount record in the database
async function find_imageLinksCount(info) {
  const found_imageLinksCount = ImageLinksCount.findOne(info);
  return found_imageLinksCount;
}
//-----------------------------------------------------------------------------------

//update a imageLinksCount record in the database
async function update_imageLinksCount(info, update_info) {
  await ImageLinksCount.updateOne(info, update_info);
}
//--------------------------------------------------------------------------------------

//delete a imageLinksCount record in the database
async function delete_imageLinksCount(info) {
  await ImageLinksCount.deleteOne(info);
}
//-------------------------------------------------------------------------------------

module.exports = {
  create_imageLinksCount,
  find_imageLinksCount,
  update_imageLinksCount,
  delete_imageLinksCount,
};
