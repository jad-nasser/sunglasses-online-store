//importing modules
const express= require('express');
const multer= require('multer');
const fs= require('fs');
const { validate, count } = require('../models/item');
const jwt= require('jsonwebtoken');
require('dotenv').config();
//----------------------------------------

//import item schema
const Item= require('../models/item');
//-------------------------------------------------

//importing ImageLinksCount schema
const ImageLinksCount= require('../models/imageLinksCount');
//-------------------------------------------------------------------------------

//creating router
const router=express.Router();
//----------------------------------------------------

//defining the storage of the images
const storage= multer.diskStorage({

    destination: (req,file,cb)=>{
        cb(null,'./uploads');
    },

    filename: (req,file,cb)=>{
        cb(null,Date.now().toString()+file.originalname);
    }

});
//---------------------------------------------------------------------

//filter function that accepts only jpg and png images
const fileFilter= (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null,true);
    else {
        cb(new Error("The image should be jpg or png"),false);
    }
};
//-------------------------------------------------------------------------------------

//initialise multer
const upload=multer({
    storage: storage, 
    limits:{fileSize: 1024*1024*5},
    fileFilter: fileFilter
});
//------------------------------------------------------------------------------

//create a item
//The seller only can create a item
router.post('/create_item',authenticateSellerToken,upload.array('ItemImage',10), async (req,res)=>{

    //verify the existence of every needed field in the request
    if(!req.body.name) return res.status(404).send("Item name not found");
    if(!req.body.brand) return res.status(404).send("Item brand not found");
    if(!req.body.color) return res.status(404).send("Item color not found");
    if(!req.body.size) return res.status(404).send("Item size not found");
    if(!req.body.price) return res.status(404).send("Item price not found");
    if(!req.body.quantity) return res.status(404).send("Item quantity not found");
    if(!req.files||!req.files.length||req.files.length==0) return res.status(404).send("At least one image is required");

    //gathering the necessary fields from the request body to item_info object
    var item_info= {};
    item_info.name= req.body.name
    item_info.brand= req.body.brand
    item_info.color= req.body.color;
    item_info.size= req.body.size;
    item_info.price= req.body.price;
    item_info.quantity= req.body.quantity;
    item_info.images= [];
    for(let i=0;i<req.files.length;i++){
        item_info.images[i]= req.files[i].path;
    }

    try{

        //adding the images count records to the database
        for(let i=0;i<item_info.images.length;i++){
            const imageLinksCount= new ImageLinksCount({image: item_info.images[i]});
            await imageLinksCount.save();
        }

        //adding the new item to the database
        const item= new Item(item_info);
        const saved_item=await item.save();
        res.send("Item added successfully");

    }
    catch(err) {
        res.json(err);
    }

});
//-----------------------------------------------------------------------------------

//Search items
router.get('/get_items', async (req,res)=>{

    //check the fields that are provided in the request to find items and gathering them in one object called 
    //item_search_info.
    var item_search_info={};
    if(req.body.name) item_search_info.name=new RegExp(req.body.name,"i");
    if(req.body.brand) item_search_info.brand=new RegExp(req.body.brand,"i");
    if(req.body.color) item_search_info.color=new RegExp(req.body.color,"i");
    if(req.body.size) item_search_info.size=new RegExp(req.body.size,"i");
    if(req.body.price) item_search_info.price=req.body.price;
    if(req.body.quantity) item_search_info.quantity=req.body.quantity;

    //using the item_search_info search data to find the items in the database
    try{
        const found_items= await Item.find(item_search_info);
        res.json(found_items);
    }
    catch(err){
        res.json(err);
    }
});
//----------------------------------------------------------

//update items
//onlt the seller can update items
router.patch('/update_items',authenticateSellerToken,upload.array('ItemImage',10), async (req,res)=>{

    //gathering the search info to know which items should be updated
    var item_search_info={};
    if(req.body.search){
        if(req.body.search.name) item_search_info.name=new RegExp(req.body.search.name,"i");
        if(req.body.search.brand) item_search_info.brand=new RegExp(req.body.search.brand,"i");
        if(req.body.search.color) item_search_info.color=new RegExp(req.body.search.color,"i");
        if(req.body.search.size) item_search_info.size=new RegExp(req.body.search.size,"i");
        if(req.body.search.price) item_search_info.price=req.body.search.price;
        if(req.body.search.quantity) item_search_info.quantity=req.body.search.quantity;
    }

    //gathering the update info
    var item_update_info={};
    if(req.body.update){
        if(req.body.update.name) item_update_info.name=req.body.update.name;
        if(req.body.update.brand) item_update_info.brand=req.body.update.brand;
        if(req.body.update.color) item_update_info.color=req.body.update.color;
        if(req.body.update.size) item_update_info.size=req.body.update.size;
        if(req.body.update.price) item_update_info.price=req.body.update.price;
        if(req.body.update.quantity) item_update_info.quantity=req.body.update.quantity;
    }
    if(req.files){ 
        if(req.files.length>0){
            item_update_info.images=[];
            for(let i=0;i<req.files.length;i++){
                item_update_info.images[i]= req.files[i].path;
            }
        }
    }

    try{

        if(req.files){
            if(req.files.length>0){

                //checking the number of links of the old images to be replaced so if the number of links (linked 
                //items that share the same image) is reduced to one the image will be deleted else the number of 
                //links (count) is decreased.
                const unupdated_items= await Item.find(item_search_info);
                for(let i=0;i<unupdated_items.length;i++){
                    for(let j=0;j<unupdated_items[i].images.length;j++){
                        const image_links_count= await ImageLinksCount.findOne({image: unupdated_items[i].images[j]});
                        if(image_links_count.count>1) await ImageLinksCount.updateOne({image: unupdated_items[i].images[j]},{$inc: {count: -1}});
                        else{
                            await ImageLinksCount.deleteOne({image: unupdated_items[i].images[j]});
                            fs.unlinkSync(unupdated_items[i].images[j]);
                        }
                    }
                }

                //add new images links counts records in the database
                for(let i=0;i<item_update_info.images.length;i++){
                    const imageLinksCount=new ImageLinksCount({
                        image: item_update_info.images[i],
                        count: unupdated_items.length
                    });
                    await imageLinksCount.save();
                }

            }
        }

        //update the items with the information provided
        const updated_items=await Item.updateMany(item_search_info,{$set: item_update_info});
        res.send("items successfully updated.");

    }
    catch(err){
        res.json(err);
    }
});
//-----------------------------------------------------------------

//seller token authentication middleware function
function authenticateSellerToken(req,res,next){
    const token= req.headers['authorization'].split(' ')[1];
    if(!token) return res.status(404).send('No token found');
    jwt.verify(token,process.env.SELLER_LOGIN_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send("Not valid token");
        req.user=user;
        next();
    });
}
//----------------------------------------------------------------------------------------------

module.exports = router;