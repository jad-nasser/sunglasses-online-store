//importing express
const express= require('express');
const { validate } = require('../models/user');
//----------------------------------------

//import user schema
const User= require('../models/user');
//-------------------------------------------------

//creating router
const router=express.Router();
//----------------------------------------------------

//create a user
router.post('/create_user',email_validate,password_validate,phone_validate,async (req,res)=>{

    //verify the existence of every needed field in the request
    if(!req.body.first_name) return res.status(404).send("User first name not found");
    if(!req.body.last_name) return res.status(404).send("User last name not found");
    if(!req.body.email) return res.status(404).send("User email not found");
    if(!req.body.password) return res.status(404).send("User password not found");
    if(!req.body.phone) return res.status(404).send("User phone not found");
    if(!req.body.country) return res.status(404).send("User country not found");
    if(!req.body.city) return res.status(404).send("User city not found");
    if(!req.body.street) return res.status(404).send("User street not found");
    if(!req.body.state_province_county) return res.status(404).send("User state_province_county not found");
    if(!req.body.bldg_apt_address) return res.status(404).send("User bldg_apt_address not found");
    if(!req.body.zip_code) return res.status(404).send("User zip_code not found");

    //check if email, password, and phone are valid by checking the results created by the
    //validation middlewares
    if(!req.body.email_validate) return res.status(404).send("The email is not valid");
    if(!req.body.password_validate) return res.status(404).send("The password is not valid");
    if(!req.body.phone_validate) return res.status(404).send("The phone is not valid");

    //gathering the necessary fields from the request body to user_info object
    var user_info= {};
    user_info.first_name= req.body.first_name
    user_info.last_name= req.body.last_name
    user_info.email= req.body.email;
    user_info.password= req.body.password;
    user_info.phone= req.body.phone;
    user_info.country= req.body.country;
    user_info.city= req.body.city;
    user_info.street= req.body.street;
    user_info.state_province_county= req.body.state_province_county;
    user_info.bldg_apt_address= req.body.bldg_apt_address;
    user_info.zip_code= req.body.zip_code;

    //adding the new user to the database
    const user= new User(user_info);
    try{
        const saved_user=await user.save();
        res.send("User added successfully");
    }
    catch(err) {
        res.json(err);
    }
});
//-----------------------------------------------------------------------------------

//get a user by its email and password
//this method is used in sign in page
router.get('/get_user',async (req,res)=>{
    try{
        const found_user=await User.findOne({
            email: req.body.email,
            password: req.body.password
        });
        res.send("User found and its ID is:"+found_user._id);
    }
    catch(err){
        res.json(err);
    }
});
//----------------------------------------------------------

//delete a user
router.delete('/delete_user/:id',async (req,res)=>{
    try{
        const deleted_user=await User.deleteOne({_id: req.params.id});
        res.send("The user with the ID:"+req.params.id+" is successfully deleted.");
    }
    catch(err){
        res.json(err);
    }
});
//------------------------------------------------------------

//update user info
router.patch('/update_user/:id',email_validate,password_validate,phone_validate,async (req,res)=>{

    //check the fields that the user want to update and gathering them in one object called user_update_info.
    //during checking also the email, phone, and password will be checked for their validation results by the
    //validation middlewares if the user want to change any of them.
    var user_update_info={};
    if(req.body.first_name) user_update_info.first_name=req.body.first_name;
    if(req.body.last_name) user_update_info.last_name=req.body.last_name;
    if(req.body.email){ 
        if(!req.body.email_validate) return res.status(404).send("The email is not valid");
        user_update_info.email=req.body.email;
    }
    if(req.body.password){ 
        if(!req.body.password_validate) return res.status(404).send("The password is not valid");
        user_update_info.password=req.body.password;
    }
    if(req.body.phone){ 
        if(!req.body.phone_validate) return res.status(404).send("The phone is not valid");
        user_update_info.phone=req.body.phone;
    }
    if(req.body.country) user_update_info.country=req.body.country;
    if(req.body.city) user_update_info.city=req.body.city;
    if(req.body.street) user_update_info.street=req.body.street;
    if(req.body.state_province_county) user_update_info.state_province_county=req.body.state_province_county;
    if(req.body.bldg_apt_address) user_update_info.bldg_apt_address=req.body.bldg_apt_address;
    if(req.body.zip_code) user_update_info.zip_code=req.body.zip_code;

    //update the user info with the information the user provided
    try{
        const updated_user=await User.updateOne({_id: req.params.id},{$set: user_update_info});
        res.json("User successfully updated.");
    }
    catch(err){
        res.json(err);
    }
});
//-----------------------------------------------------------------

//email validation middleware
async function email_validate (req,res,next){
       
    //check the existence of the email field and also check if it has the legal length
    if(!req.body.email||req.body.email.length>40) {
        req.body.email_validate=false;
        next();
        return;
    }

    //checking if the email is valid by using a regex
    let email_re=  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!email_re.test(req.body.email)){
        req.body.email_validate=false;
        next();
        return;
    }

    //checking if other user have the same email
    try{
        const already_existing_email= await User.findOne({email: req.body.email})
        if(already_existing_email){
            req.body.email_validate=false;
            next();
            return;
        }
    }
    catch(err){
        return res.json(err)
    }

    //after everythings is validated correctly the email_validate field is added to the request so the other
    //middleware can read this info
    req.body.email_validate=true;
    next();
}
//------------------------------------------------------------------------------------

//password validation
async function password_validate(req,res,next){

    //check if password exists in the request and also check if it has the apropriate length
    if(!req.body.password||req.body.password.length>32){
        req.body.password_validate=false;
        next();
        return;
    }

    //validation using regex
    let pass_re= /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
    if(!pass_re.test(req.body.password)){
        req.body.password_validate=false;
        next();
        return;
    }

    //after everythings is validated correctly the password_validate field is added to the request so the other
    //middleware can read this info
    req.body.password_validate=true;
    next();
}
//--------------------------------------------------------------------------------------------

//phone validation
async function phone_validate(req,res,next){

    //check if phone exists in the request and also check if it has the appropriate length
    if(!req.body.phone||req.body.phone.length>40){
        req.body.phone_validate=false;
        next();
        return;
    }

    //validation using regex
    let phone_re= /^\+[0-9]+/;
    if(!phone_re.test(req.body.phone)){
        req.body.phone_validate=false;
        next();
        return;
    }

    //after everythings is validated correctly the phone_validate field is added to the request so the other
    //middleware can read this info
    req.body.phone_validate=true;
    next();
}
//--------------------------------------------------------------------------------------------

module.exports = router;