const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RetryBatches_Schema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaigns",
        index: true,
      },

      pendingContacts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      sentContacts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

  retry_attempt: Number,
    
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


const RetryBatches_Schema_Model = mongoose.model('retry_batches', RetryBatches_Schema);
module.exports = RetryBatches_Schema_Model;
