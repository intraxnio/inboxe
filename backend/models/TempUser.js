const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Temp_User_Schema = new Schema({


    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
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


const TempUser_Schema_Model = mongoose.model('users_temp', Temp_User_Schema);
module.exports = TempUser_Schema_Model;
