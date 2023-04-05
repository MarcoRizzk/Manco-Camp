const User = require('../models/user');

module.exports.renderRegister = (req, res)=> {
    res.render('users/register');
}

module.exports.register = async(req, res)=> {
    try{
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {            //to make user logged in after registering
            if(err) return next(err);
            req.flash('success','Welcome to Manco Camp');
            res.redirect('/campgrounds');
        })
        
    } catch(e){ 
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res)=> {
    res.render('users/login')
}

module.exports.login = (req, res)=> {  //we authenticate local and also we can use google or twitter
    const redirectUrl = req.session.returnTo || '/campgrounds'; //redirection to the prev. requested url
    req.flash('success','Welcome Back');
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Successfully Logged out');
      res.redirect('/campgrounds');
    });
  }