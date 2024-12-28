const mongoose = require('mongoose');
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;



var dbUrl = 'mongodb+srv://'+username+':'+password+'@cluster-sc.euxgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-SC';



const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then()
    .catch((err) => { console.error(err); });
}

module.exports = connectToMongo;