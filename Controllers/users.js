const User=require('../models/user');

module.exports.RenderSignUp=(req,res)=>{
    res.render('user/signup.ejs');
}

module.exports.UserSignUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({
            email:email,
            username:username,
        });
        const userData=await User.register(newUser,password);
        req.login(userData,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to Wanderlust');
            res.redirect('/listings');
        });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
};

module.exports.RenderLogInPage=(req,res)=>{
    res.render('user/login.ejs');
};

module.exports.UserLogIn=async(req,res)=>{
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    req.flash('success','Welcome to Wanderlust!');
    res.redirect('/listings');
};

module.exports.UserLogOut=async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Loged You Out');
        res.redirect('/listings');
    });
};