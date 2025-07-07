const mongoose = require("mongoose")
require("dotenv").config();

const mongoUrl = process.env.MONGODB;




const initalizeDatabase = async () => {
   await mongoose.connect(mongoUrl)
.then((()=>{
    console.log("Connected to Database")
}))
.catch((error)=>console.log("Error connecting to Database", error))
}

module.exports = {initalizeDatabase}
