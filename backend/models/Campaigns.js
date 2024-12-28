const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Campaigns_Schema = new Schema({



    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

    tags : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags",
      }],

      campaignTitle : String,

    fromName: String,

    subject: String,

    previewText: String,

    emailContent: String,

    status : String,

    contacts_delivered : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      contacts_opened : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      contacts_clicked : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      contacts_bounced : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      contacts_complained : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      bounce_rate : Number,

      complaint_rate : Number,

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


const Campaigns_Schema_Model = mongoose.model('campaigns', Campaigns_Schema);
module.exports = Campaigns_Schema_Model;
