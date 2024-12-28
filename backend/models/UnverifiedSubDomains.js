const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Unverified_SubDomains_Schema = new Schema({


user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
 subDomain : String,
 txtName : String,
 txtValue : String,
 spfTxtName: String,
 spfTxtValue: String,
 cname1Name : String,
 cname2Name : String,
 cname3Name : String,
 cname1Value : String,
 cname2Value : String,
 cname3Value : String,
 dmarcRecordName : String,
 dmarcRecordValue : String,
 mailFromTxtName : String,
 mailFromTxtValue : String,
 mxName : String,
 mxValue : String,
 txtRecordStatus : {
    type: Boolean,
    default : false
 },

 cnameRecordStatus : {
    type: Boolean,
    default : false
 },

 dmarcRecordStatus : {
    type: Boolean,
    default : false
 },

 spfRecordStatus : {
    type: Boolean,
    default : false
 },

 mailFromRecordStatus : {
   type: Boolean,
   default : false
},

mxRecordStatus : {
   type: Boolean,
   default : false
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


const Unverified_SubDomains_Schema_Model = mongoose.model('unverified_subdomains', Unverified_SubDomains_Schema);
module.exports = Unverified_SubDomains_Schema_Model;
