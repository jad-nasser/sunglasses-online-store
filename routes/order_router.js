//importing modules
const express= require('express');
const jwt= require('jsonwebtoken');
const bodyparser= require('body-parser');
require('dotenv').config;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//--------------------------------------------------------------------

//importing database models
const Order= require('../models/order');
const User= require('../models/user');
const Item= require('../models/item');
const { Mongoose } = require('mongoose');
//---------------------------------------------------------------------------

//initialising router
const router= express.Router();
//---------------------------------------------------------------

//get all orders for a specific customer
router.get('/get_customer_orders', authenticateCustomerToken, async (req,res)=>{
    try{ 
        const user_orders= await Order.aggregate([
            {
                $match: {
                    "user_id": req.user.user_id
                }
            },
            {
                "$addFields": {
                  "item_id": { "$toObjectId": "$item_id" }
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'item_id',
                    foreignField: '_id',
                    as: 'item_info'

                }
            },
            {
                $project: {
                    "item_info.images": 1,
                    "item_name": 1,
                    "item_id": 1,
                    "status": 1,
                    "quantity": 1,
                    "date_time": 1,
                    "item_brand": 1,
                    "item_size": 1,
                    "item_color": 1,
                    "item_price": 1
                }
            }
        ]);
        res.json(user_orders);
    }
    catch(err){
        res.json(err);
    }
});
//------------------------------------------------------------------------------------

//get orders from search query
//this is only for the seller
router.get('/get_orders',authenticateSellerToken,async (req,res)=>{

    //gathering the search information
    let search_info={};
    if(req.body.shipment_id) search_info.shipment_id= req.body.shipment_id;
    if(req.body.quantity) search_info.quantity= req.body.quantity;
    if(req.body.status) search_info.status= new RegExp(req.body.status,"i");
    if(req.body.date_time) search_info.date_time= new RegExp(req.body.date_time,"i");
    if(req.body.item_name) search_info.item_name= new RegExp(req.body.item_name,"i");
    if(req.body.item_brand) search_info.item_brand= new RegExp(req.body.item_brand,"i");
    if(req.body.item_color) search_info.item_color= new RegExp(req.body.item_color,"i");
    if(req.body.item_size) search_info.item_size= new RegExp(req.body.item_size,"i");

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

//update orders
//only the seller can update the orders
router.patch('/update_orders',authenticateSellerToken,async (req,res)=>{

    //gathering search_info
    let search_info={};
    if(req.body.search){
        if(req.body.search.shipment_id) search_info.shipment_id= req.body.search.shipment_id;
        if(req.body.search.quantity) search_info.quantity= req.body.search.quantity;
        if(req.body.search.status) search_info.status= new RegExp(req.body.search.status,"i");
        if(req.body.search.date_time) search_info.date_time= new RegExp(req.body.search.date_time,"i");
        if(req.body.search.item_name) search_info.item_name= new RegExp(req.body.search.item_name,"i");
        if(req.body.search.item_brand) search_info.item_brand= new RegExp(req.body.search.item_brand,"i");
        if(req.body.search.item_color) search_info.item_color= new RegExp(req.body.search.item_color,"i");
        if(req.body.search.item_size) search_info.item_size= new RegExp(req.body.search.item_size,"i");
    }

    //gathering update info
    let update_info={};
    if(req.body.update){
        if(req.body.update.shipment_id) update_info.shipment_id= req.body.update.shipment_id;
        if(req.body.update.status) update_info.status= req.body.update.status;
    }

    //updating the orders in the database
    try{
        await Order.updateMany(search_info,{$set: update_info});
        res.send('Orders successfully updated');
    }
    catch(err){
        res.json(err);
    }
    
});
//-------------------------------------------------------------------------------------

//this will create the orders but it will not confirmed until the payment is occured
router.post('/create_orders', authenticateCustomerToken, async (req, res) => {
    let orders=[];
    let total_price=0;

    //checking if there is ordered items existing in the request
    if(!req.body.items|| req.body.items.length==0) return res.status(404).send('No ordered items found');

    //checking if the number of ordered items is greater than 20 to send a 404 bad request
    if(req.body.items.length>20) return res.status(404).send('Number of orders in a session should not be greater than 20');
    
    //checking if there is a duplicated items
    for(let i=0;i<req.body.items.length;i++){
        for(let j=i+1;j<req.body.items.length;j++){
            if(req.body.items[i].id===req.body.items[j].id) return res.status(404).send('Duplicated items are not allowded');
        }
    }
    
    try{

        //checking if the customer email and phone are verified
        const user= await User.findOne({_id: req.user.user_id});
        if(!user.is_phone_verified) return res.status(403).send('You need to verify your phone to proceed this order');
        if(!user.is_email_verified) return res.status(403).send('You need to verify your email to proceed this order');

       for(let i=0;i<req.body.items.length;i++){

           //checking if an item in the request is in good format
           if(!req.body.items[i].id||!req.body.items[i].quantity||typeof(req.body.items[i].quantity)!=='number'||req.body.items[i].quantity<=0){
               return res.status(404).send('Bad request');
           }

           //getting an item from the database
           const item= await Item.findOne({_id: req.body.items[i].id});

           //checking if an item is found
           if(!item) return res.status(404).send('Some items in your request is not found');

           //checking if there is enougth quantity according to the request
           if(item.quantity<req.body.items[i].quantity) return res.status(404).send('Some ordered item quantity are not available in our store');

           //adding the price of the order in total price variable
           total_price=total_price+(item.price*req.body.items[i].quantity);

           //putting the found item in some variables
           let order={};
           order.item_id=item._id;
           order.user_id=req.user.user_id;
           order.quantity=req.body.items[i].quantity;
           order.item_name=item.name;
           order.item_price=item.price;
           order.item_size=item.size;
           order.item_brand=item.brand;
           order.item_color=item.color;
           orders[i]=order;
           
       }
   }
   catch(err){
       res.json(err);
   }

    //creating the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total_price*100,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
      });
    
    //creating the user orders
    for(let i=0;i<orders.length;i++){
        orders[i].payment_intent_id=paymentIntent.id;
    }
    try{
        //inserting the orders in the database
        await Order.insertMany(orders);
    }
    catch(err){
        return res.json(err);
    }

    //sending the client_secret to the user
    return res.json({client_secret: paymentIntent.client_secret});
  });
//-------------------------------------------------------------------------------------

//this method will check if the orders quantities are still available at the store
//this method will be triggered before the purchase is done
//if the orders are not valid its payment_intent will be cancelled
router.get('/check_orders_validity', async (req,res)=>{

    //checking the existence of the client_secret
    if(!req.body.payment_intent_id) return res.status(404).send('Payment intent ID not found in the request');

    //retrieving the payment intent
    let paymentIntent;
    try{
        paymentIntent = await stripe.paymentIntents.retrieve(req.body.payment_intent_id);
    }
    catch(err){
        return res.json(err);
    }

    //check if the payment intent is exist
    if(!paymentIntent) return res.status(403).send('Payment intent not found');

    //checking if the payment intent is still valid or alredy completed
    if(paymentIntent.status==='canceled'||paymentIntent.status==='succeeded') return res.status(403).send('This payment intent is not valid because its either succeeded or canceled');

    //checking if the quantities of the orders of this payment intent are still available
    try{
        //getting the orders of this payment intent
        const orders= await Order.find({payment_intent_id: req.body.payment_intent_id});

        //checking each order if its quantity is still available
        for(let i=0; i<orders.length; i++){
            const item= await Item.findOne({_id: orders[i].item_id});
            if(item.quantity<orders[i].quantity){
                //cancelling the payment intent
                await stripe.paymentIntents.cancel(req.body.payment_intent_id);
                return res.status(403).send('Some order quantity is not available at our store');
            }
        }
    }
    catch(err){
        return res.json(err);
    }

    //if every thing is alright return true
    return res.send({are_orders_valid: true});
});
//--------------------------------------------------------------------------------------

//this method to handle purchase events
//this method will procced the order if a payment is successfully recieved
//this method also will delete the orders of the canceled payment intents
router.post('/webhook', bodyparser.raw({type: 'application/json'}), async (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {

        //payment successfully recieved
        case 'payment_intent.succeeded':

            try{
                //getting the orders of this payment intent from the database
                const orders= await Order.find({payment_intent_id: request.body.data.object.id});

                //decrementing the items quantities according to orders quantities
                for(let i=0; i<orders.length; i++){
                    await Item.updateOne({_id: orders[i].item_id},{$inc: {quantity: -orders[i].quantity} });
                }

                //procceeding the orders by updating its status
                await Order.updateMany({payment_intent_id: request.body.data.object.id},{$set: {status: 'Awaiting Shipment'} });
            }
            catch(err){
                console.log(err);
            }

            console.log('successful purchase');
            break;

        //when the payment intent is canceled 
        case 'payment_intent.canceled':
            
            try{
                //deleting the orders from the database
                await Order.deleteMany({payment_session_id: request.body.data.object.id});
            }
            catch(err){
                console.log(err);
            }

            console.log('Payment intent canceled');
            break;

        //for the events that you not need to do anything when they occure
        default:
            console.log('unhandled event type');
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.json({received: true});
  });
//--------------------------------------------------------------------------------

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

//customer token authentication middleware function
function authenticateCustomerToken(req,res,next){
    const token= req.headers['authorization'].split(' ')[1];
    if(!token) return res.status(404).send('No token found');
    jwt.verify(token,process.env.CUSTOMER_LOGIN_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send("Not valid token");
        req.user=user;
        next();
    });
}
//-----------------------------------------------------------------------------------------------

module.exports= router;