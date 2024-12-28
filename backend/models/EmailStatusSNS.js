const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailStatus_Schema = new Schema({

   message_id : String,
   recipient_email : String,
   email_sent_at : Date,
   email_delivered_at : Date,
   email_opened_at : Date,
   email_clicked_at : Date,
   email_bounced_at : Date,
   any_complaints : String,
    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

          campaign_id: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "campaigns",
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


const EmailStatus_Schema_Model = mongoose.model('email_status_SNS', EmailStatus_Schema);
module.exports = EmailStatus_Schema_Model;
