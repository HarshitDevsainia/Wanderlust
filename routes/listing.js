const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {listingSchema}=require('../schema');
const listing = require('../models/listing');
const { LogedIn , Owner} = require('../middleware');
const listingController=require('../Controllers/listings');
const {storage}=require('../CloudConfig');
const multer=require('multer');
const upload=multer({storage});


//Validate ListingSchema
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error) throw new ExpressError(400,error);
    else next();
}

// Start Route with /
router.route('/')
      .get(wrapAsync(listingController.RenderIndexPage))
      // .post(LogedIn,validateListing,wrapAsync(listingController.CreateNewList));
      .post(LogedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.CreateNewList));

// Route Start with /new
router.get('/new',LogedIn,listingController.RenderNewPage);

//Start Route with /:id
router.route('/:id')
      .put(LogedIn,Owner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.EditPage))
      // .put(upload.single('listing[image]'),wrapAsync(listingController.EditPage))
      .delete(LogedIn,Owner,wrapAsync(listingController.DeletePage))
      .get(wrapAsync(listingController.RenderShowPage))

// Edit Route /:id/Edit
router.get('/:id/edit' ,LogedIn,Owner,wrapAsync(listingController.RenderEditPage));

module.exports=router;


