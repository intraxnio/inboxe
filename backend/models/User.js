const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User_Schema = new Schema({


    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
    },

    name : {
        type : String

    },

    is_google_user : {

        type: Boolean,
        default: false

    },

    picture : {
        type : String

    },

    reset_pin:{
        type: Number
    },


    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const User_Schema_Model = mongoose.model('users', User_Schema);
module.exports = User_Schema_Model;
