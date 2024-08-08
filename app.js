const express= require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")

const mongo_url="mongodb://127.0.0.1:27017/Wanderlust";


main().then(()=>{
    console.log("conected to Data base")
})
.catch((err)=>{
    console.log(err);

})

// for data base we write a new async function
async function main(){
    await mongoose.connect(mongo_url)
}

app.get("/",(req,res)=>{
    res.send("Hi, I am sourav");
})

app.get("/testlisting",async(req,res)=>{
    let samplelisting = new listing({
        title:"my new Villa",
        description:"By the Beach",
        price: 1200,
        location:"calangute Goa",
        country:"India",
    });
   await  samplelisting.save();
   console.log("sample was saved");
   res.send("succesfull testing")
})

app.listen(5050,()=>{
    console.log("server is running succesfully")
});