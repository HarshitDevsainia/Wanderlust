const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema}=require('../schema');
const { LogedIn,isAuthor,} = require('../middleware');
const ReviewController=require('../Controllers/reviews');

//Review Schema Validater
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error) throw new ExpressError(400,error);
    else next();
}

//Review Routes
router.post('/',LogedIn,validateReview,wrapAsync(ReviewController.CreateReview));

//Delete Review
router.delete('/:reviewId',LogedIn,isAuthor,ReviewController.DeleteReview);

module.exports=router;