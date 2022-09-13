const isAuthenticated = (req,res,next) =>{
    if(!req.session.user){
res.redirect('/login')
return;
    }
    else{
        // all next does is say go to next route.
        next()
    }
}
const isNotAuthenticated = (req,res,next)=>{
    if(req.session.user){
        res.redirect('/profile')
        return;
    }
    else{
        next();
    }
}

module.exports = {isAuthenticated, isNotAuthenticated};