const listing = require('../models/listing');
const review = require('../models/review');

module.exports.CreateReview=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let currlisting=await listing.findById(id);
    let newreview =new review(req.body.review);
    newreview.owner=req.user._id;//Add USer
    currlisting.reviews.push(newreview);
    await newreview.save();
    await currlisting.save();
    req.flash('success','new Review Created');
    res.redirect(`/listings/${id}`);
};

module.exports.DeleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Review is Deleted');
    res.redirect(`/listings/${id}`);
};