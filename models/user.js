//importing mongoose
const mongoose= require('mongoose');

//creating the model
const UserSchema = mongoose.Schema({

    user_type: {
        type: String,
        default: "customer"
    },

    first_name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:20
    },

    last_name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:20
    },

    email: {
        type: String,
        required: true,
        minLength: 12,
        maxLength:40
    },

    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength:32
    },

    phone: {
        type: String,
        required: true,
        minLength: 12,
        maxLength:40
    },

    country: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:40
    },

    city: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:40
    },

    street: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:40
    },

    state_province_county: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:40
    },

    bldg_apt_address: {
        type: String,
        required: true,
        minLength: 5,
        maxLength:80
    },

    zip_code: {
        type: Number,
        required: true,
        min: 0,
        max: 99999999999999999999
    },

    is_phone_verified: {
        type: Boolean,
        default: false
    },

    is_email_verified: {
        type: Boolean,
        default: false
    }
    
});

module.exports= mongoose.model('User', UserSchema);