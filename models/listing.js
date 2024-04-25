const mongoose=require('mongoose');
const {Schema}=mongoose;
const review=require('./review');

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:String,
        url:String,
    },
    category:{
        type:String,
        enum:['Trending','Rooms','Iconic Center','mountains','castles','Amazing pools','Camping','farms','Arctic','Domes','Boats','Creative Spaces','Golfing','Beach'],
        required:true,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'review',
    },],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
   
});

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const listing = mongoose.model('listing',listingSchema);
module.exports=listing;

