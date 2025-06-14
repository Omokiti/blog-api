const mongoose = require('mongoose');
require('dotenv').config();

const MongoDB_Uri = process.env.MONGO_DB_CONNECTION_URI;

function connectToMongoDB(){
    mongoose.connect(MongoDB_Uri)

    mongoose.connection.on('connected',()=>{
        console.log('Connected to MongoDB successfully')
    })

    mongoose.connection.on('error',(err)=>{
        console.log('Error connecting to MongoDB',err)
    })
}

module.exports={ connectToMongoDB };