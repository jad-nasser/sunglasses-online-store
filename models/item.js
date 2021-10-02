//import mongoose
const mongoose= require('mongoose');

//creating the model
const ItemSchema= mongoose.Schema({

    name: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },

    brand: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true
    },

    color: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },

    size: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true
    },

    price: {
        type: Number,
        min: 0,
        max: 9999,
        required: true
    },

    quantity: {
        type: Number,
        min: 0,
        max: 99999999999999999999,
        required: true
    },

    times_ordered: {
        type: Number,
        min: 0,
        max: 99999999999999999999,
        default: 0
    },

    images: [{
        type: String,
        minLength: 5,
        maxLength: 80,
        required: true
    }]

});

module.exports= mongoose.model('Item',ItemSchema);