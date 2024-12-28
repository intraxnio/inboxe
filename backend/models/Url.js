const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Url_Schema = new Schema({


    shortId : {
        type : String,
        required : true,
        unique : true

    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      tracking_code_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tracking_codes",
      },

    redirectUrl : {
        type : String,
    },

    linkTitle : {
        type : String,
        required : true,

    },

    pdfFile : {
        type : String,

    },

    password : {
        type : String,

    },

    passwordProtected : {
        type : Boolean,
        default : false

    },

    hasSocialSharing : {
        type : Boolean,
        default : false

    },

    hasUtm : {
        type : Boolean,
        default : false

    },

    linkType : {
        type : String,

    },

    socialTitle : {
        type : String,

    },

    socialDescription : {
        type : String,

    },

    socialImage : {
        type : String,

    },

    utm_source : {
        type : String,

    },

    
    utm_medium : {
        type : String,

    },

    
    utm_campaign : {
        type : String,

    },

    uniqueVisitors : [
        {
            timestamp : { type : Date },
            country : { type : String },
            region : { type : String },
            city : { type : String },
            postal : { type : String },
            ipAddress : { type : String },
            deviceType : { type : String},
            browser : { type : String},
            referrer : { type : String}
        }
    ],

    repeatVisitors : [
        {
            timestamp : { type : Date },
            country : { type : String },
            region : { type : String },
            city : { type : String },
            postal : { type : String },
            ipAddress : { type : String },
            deviceType : { type : String},
            browser : { type : String},
            referrer : { type : String}

        }
    ],

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const Url_Schema_Model = mongoose.model('url', Url_Schema);
module.exports = Url_Schema_Model;
