const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Batches_Schema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaigns",
        index: true,
      },

    contacts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      }],

    is_batch_completed: {
        type: Boolean,
        default: false,
    },

    batch_will_starts_at: {
      type: Date,
     
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


const Batches_Schema_Model = mongoose.model('batches', Batches_Schema);
module.exports = Batches_Schema_Model;
