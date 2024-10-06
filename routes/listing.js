const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
    let { err } = listingSchema.validate(req.body);
    if (err) {
        let erMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, erMsg);
    } else {
        next();
    }
};

//Inddex Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
})


//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})


//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("success", " Listing You Requested for Does Not Exist");
        res.redirect("/listings")

    }
    res.render("listings/show.ejs", { listing })
}));
// create route

router.post("/", validateListing, wrapAsync(async(req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));



//Edit route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("success", " Listing You Requested for Does Not Exist");
        res.redirect("/listings")

    }
    res.render("listings/edit.ejs", { listing });
});

//Update route

router.put("/:id", validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " Listing Updated");

    res.redirect(`/listings/${id}`)
});

//delete route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
});

module.exports = router;
