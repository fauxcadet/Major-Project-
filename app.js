const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override")


const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("conected to Data base")
})
    .catch((err) => {
        console.log(err);
    })

// for data base we write a new async function
async function main() {
    await mongoose.connect(mongo_url)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));// for extracting id from the url
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Hi, I am sourav");
});



//Inddex Route
app.get("/listings", async (req, res) => {
    const allListings = await listing.find({})
    res.render("listings/index.ejs", { allListings });
})


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})


//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })

})



//Create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
});

//delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});





app.listen(5050, () => {
    console.log("server is running succesfully")
});