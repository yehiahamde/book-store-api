const mongoose = require("mongoose");
async function connectToDB(){

    try {
       await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db....")
    } catch (error) {
        console.log("faild",error);
    }
  }
  module.exports=connectToDB;