const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagsContacts_Schema = new Schema({



    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

    tag : String,

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


const TagsContacts_Schema_Model = mongoose.model('tags', TagsContacts_Schema);
module.exports = TagsContacts_Schema_Model;
