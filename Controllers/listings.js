const listing=require('../models/listing');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.mapToken;
const geocodingClient=mbxGeoCoding({ accessToken: mapToken});

module.exports.RenderIndexPage=async(req,res)=>{
    let {Search,category}=req.query;
    if((Search===undefined || Search==='') && (category==='' || category===undefined)){
        let data = await listing.find();
        res.render('listings/index.ejs',{data});
    }
    else if(category=='' || category==undefined){
        let Searchdata=await listing.find({$or:[{location:{$regex:Search,$options:'i'}},{country:{$regex:Search,$options:'i'}}]});
        if(Searchdata.length==0){
            req.flash('error','Sorry Listing not Available');
            res.redirect('/listings');
        }
        else{
            res.render('listings/index.ejs',{data:Searchdata});
        }
    }
    else{
        let categoryData=await listing.find({category:category});
        if(categoryData.length==0){
            req.flash('error','Sorry Listing not Available');
            res.redirect('/listings');
        }
        else{
            res.render('listings/index.ejs',{data:categoryData});
        }
    }

    // else{
    //     console.log(Search,category);
    //     let SearchData=[];
        // if(category==='' || category===undefined){
        //     for(let ss of data){
        //         let des=ss.location;
        //         let country=ss.country;
                
        //         if(Search.toLowerCase()===des.toLowerCase() || Search.toLowerCase()===country.toLowerCase()){
        //            SearchData.push(ss);
        //         }
        //      }
        // }
        // else{
        //     for(let ss of data){
        //         let Orgcategory=ss.category;
        //         if(category===Orgcategory){
        //             SearchData.push(ss);
        //         }
        //      }
        // }

        // if(SearchData.length==0){
        //     req.flash('error','Sorry Not Available!');
        //     res.redirect('/listings');
        // }
        // else{
        //     res.render('listings/index.ejs',{data:SearchData});
        // }
};

module.exports.RenderNewPage=(req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.CreateNewList=async(req,res)=>{
    let responce=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location+','+req.body.listing.country,
        limit: 1
    }).send();

    let url=req.file.path;
    let filename=req.file.filename;
    let newList=req.body.listing;
    newList.owner=req.user._id;
    //Extracting the URL
    newList.image={filename,url};
    newList.geometry=responce.body.features[0].geometry;
    let list=new listing(newList);
    await list.save();
    req.flash('success','new Listing Created');
    res.redirect('/listings');
};
module.exports.RenderEditPage=async(req,res)=>{
    let {id}=req.params;
    let list=await listing.findById(id);
    let imgUrl=list.image.url;
    imgUrl=imgUrl.replace('/upload','/upload/e_blur:300');
    res.render('listings/edit.ejs',{list,imgUrl});
};

module.exports.EditPage=async(req,res)=>{
    //geting Coordinates
    let responce=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location+','+req.body.listing.country,
        limit: 1
    }).send();
    //Update List
    let {id}=req.params;
    let newListing=req.body;
    let data=newListing.listing;
    let Listing = await listing.findByIdAndUpdate(id,{...data});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={filename,url};
        await Listing.save();
    }
    //Update coordinates
    Listing.geometry=responce.body.features[0].geometry;
    await Listing.save();
    req.flash('success','Listing Updated');
    res.redirect(`/listings/${id}`);
};

module.exports.DeletePage=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success','List is Deleted');
    res.redirect(`/listings`);
};

module.exports.RenderShowPage=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id)
    .populate({path:'reviews',populate:{path:'owner'}})
    .populate('owner');
    res.render('listings/show.ejs',{ list });
};