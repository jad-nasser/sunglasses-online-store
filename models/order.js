//importing mongoose
const mongoose= require('mongoose');

//creating the schema
const OrderSchema= mongoose.Schema({

    item_id: {
        type: String,
        minLength: 1,
        maxLength: 80,
        required: true
    },

    user_id: {
        type: String,
        minLength: 1,
        maxLength: 80,
        required: true
    },

    shipment_id: {
        type: String,
        minLength: 0,
        maxLength: 80,
        default: ""
    },

    status: {
        type: String,
        minLength: 1,
        maxLength: 20,
        default: "Awaiting Payment"
    },

    quantity: {
        type: Number,
        min: 1,
        max: 9999,
        required: true
    },

    date_time: {
        type: Date,
        default: Date.now()
    },

    item_name: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },

    item_brand: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true
    },

    item_size: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true
    },

    item_color: {
        type: String,
        minLength: 1,
        maxLength: 40,
        required: true
    },

    item_price: {
        type: Number,
        min: 0,
        max: 9999,
        required: true
    },

    payment_intent_id: {
        type: String,
        required: true
    }

});

module.exports= mongoose.model('Order',OrderSchema);