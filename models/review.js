const Joi = require('joi');
const mongoose=require('mongoose');
const {Schema}=mongoose;

const reviewSchema=new Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
    }
});

const review=mongoose.model('review',reviewSchema);
module.exports=review;
