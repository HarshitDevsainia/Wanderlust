if(process.env.NODE_ENV!='Production'){
    require('dotenv').config();
}
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const listroute=require('./routes/listing');
const reviewroute=require('./routes/review');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const User=require('./models/user.js');
const LocalStrategy=require('passport-local');
const userRoute=require('./routes/user.js');


app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

const sessionOptions={
    secret:'mysecretcode',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000+60*60*24*3,
        maxAge:1000+60*60*24*3,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
app.use(flash());

main().then(()=>{
    console.log('Connect the DataBase');
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.listen(8080,(req,res)=>{
    console.log('App is Listening at port 8080');
});


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.curruser=req.user;
    next();
});

//User Route
app.use('/',userRoute);

//Listing Route
app.use('/listings/',listroute);

//Review Route
app.use('/listings/:id/review/',reviewroute);

//Error Validation
app.all('*',(req,res,next)=>{
    res.render('listings/error.ejs');
});

app.use((err,req,res,next)=>{
    let{status=404,message='Validation Error'}=err;
    if(err.kind==='ObjectId'){
        res.status(status).send('Invalid URL');
    }
    else res.render('listings/error.ejs',{err});
});