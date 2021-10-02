//importing mongoose
const mongoose= require('mongoose');

//creating the schema
const ImageLinksCountSchema= mongoose.Schema({

    image: {
        type: String,
        minLength: 5,
        maxLength: 80,
        required: true
    },

    count: {
        type: Number,
        min: 1,
        max: 99999999999999999999,
        default: 1
    }

});

module.exports= mongoose.model('ImageLinksCount', ImageLinksCountSchema);