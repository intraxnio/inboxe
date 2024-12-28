const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueBatch_Schema = new Schema({

    original_batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "batches",
      },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaigns",
        index : true,
      },

    pendingContacts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

      sentContacts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

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


const QueueBatch_Schema_Model = mongoose.model('queue_batches', QueueBatch_Schema);
module.exports = QueueBatch_Schema_Model;
