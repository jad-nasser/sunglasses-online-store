//importing modules
const express= require('express');
//--------------------------------------------------------------------

//importing database models
const Order= require('../models/order');
const User= require('../models/user');
const Item= require('../models/item');
//---------------------------------------------------------------------------

//initialising router
const router= express.Router();
//---------------------------------------------------------------

//get all orders for a specific customer
router.get('/get_customer_orders/:id', async (req,res)=>{
    if(!req.params.id) return res.status(404).send('No ID in the request');
    try{ 
        const user_orders= await Order.find({user_id: req.params.id});
        res.json(user_orders);
    }
    catch(err){
        res.json(err);
    }
});
//------------------------------------------------------------------------------------

//get orders from search query
//this is only for the seller
router.get('/get_orders', async (req,res)=>{

    //gathering the search information
    let search_info={};
    if(req.body.shipment_id) search_info.shipment_id= req.body.shipment_id;
    if(req.body.quantity) search_info.quantity= req.body.quantity;
    if(req.body.status) search_info.status= req.body.status;
    if(req.body.date_time) search_info.date_time= req.body.date_time;
    if(req.body.item_name) search_info.item_name= req.body.item_name;
    if(req.body.item_brand) search_info.item_brand= req.body.item_brand;
    if(req.body.item_color) search_info.item_color= req.body.item_color;
    if(req.body.item_size) search_info.item_size= req.body.item_size;

    //getting the orders from the database
    try{
        const found_orders= await Order.find(search_info);
        res.json(found_orders);
    }
    catch(err){
        res.json(err);
    }

});
//---------------------------------------------------------------------------------------------

//create order
//this is used when a customer makes an order
router.post('/create_order',async (req,res)=>{

    //checking and gathering order information
    let order_info={}
    if(req.body.user_id) order_info.user_id=req.body.user_id;
    else return res.status(404).send('Customer ID not found');
    if(req.body.item_id) order_info.item_id=req.body.item_id;
    else return res.status(404).send('Item ID not found');
    if(req.body.item_name) order_info.item_name=req.body.item_name;
    else return res.status(404).send('Item name not found');
    if(req.body.item_brand) order_info.item_brand=req.body.item_brand;
    else return res.status(404).send('Item brand not found');
    if(req.body.item_color) order_info.item_color=req.body.item_color;
    else return res.status(404).send('Item color not found');
    if(req.body.item_size) order_info.item_size=req.body.item_size;
    else return res.status(404).send('Item size not found');
    if(req.body.item_price) order_info.item_price=req.body.item_price;
    else return res.status(404).send('Item price not found');
    if(req.body.quantity) order_info.quantity=req.body.quantity;
    else return res.status(404).send('Order quantity not found');

    try{

        //checking if the customer email and phone are verified
        const user= await User.findOne({_id: req.body.user_id});
        if(!user.is_phone_verified) return res.status(403).send('You need to verify your phone to proceed this order');
        if(!user.is_email_verified) return res.status(403).send('You need to verify your email to proceed this order');

        //updating the item that will be purchased
        const updated_item=await Item.updateOne({_id: req.body.item_id},{$inc: {times_ordered: 1, quantity: -1}});

        //proceeding the order by adding it to the database
        const order=new Order(order_info);
        await order.save();
        res.send('The item is successfully ordered');

    }
    catch(err){
        res.json(err);
    }

});
//---------------------------------------------------------------------------------------

//update orders
//only the seller can update the orders
router.patch('/update_orders',async (req,res)=>{

    //gathering search_info
    let search_info={};
    if(req.body.search.shipment_id) search_info.shipment_id= req.body.search.shipment_id;
    if(req.body.search.quantity) search_info.quantity= req.body.search.quantity;
    if(req.body.search.status) search_info.status= req.body.search.status;
    if(req.body.search.date_time) search_info.date_time= req.body.search.date_time;
    if(req.body.search.item_name) search_info.item_name= req.body.search.item_name;
    if(req.body.search.item_brand) search_info.item_brand= req.body.search.item_brand;
    if(req.body.search.item_color) search_info.item_color= req.body.search.item_color;
    if(req.body.search.item_size) search_info.item_size= req.body.search.item_size;

    //gathering update info
    let update_info={};
    if(req.body.update.shipment_id) update_info.shipment_id= req.body.update.shipment_id;
    if(req.body.update.status) update_info.status= req.body.update.status;

    //updating the orders in the database
    try{
        await Order.updateMany(search_info,{$set: update_info});
        res.send('Orders successfully updated');
    }
    catch(err){
        res.json(err);
    }
    
});

module.exports= router;