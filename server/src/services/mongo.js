const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open",()=>{
    console.log("Mongoose Connection ready");
});
mongoose.connection.on("error",(err)=>{
    console.error("Error Occured in MongoDB connection ", err);
});
async function mongoConnect(){

    await mongoose.connect(MONGO_URL);
}
async function mongoDisconnect(){

    await mongoose.disconnect(MONGO_URL);
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}