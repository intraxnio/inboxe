const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tracking_Code_Schema = new Schema({


    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

    tracking_code_name: {
        type: String,
    },

    tracking_script:{
        type: String
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


const Tracking_Code_Schema_Model = mongoose.model('tracking_codes', Tracking_Code_Schema);
module.exports = Tracking_Code_Schema_Model;
