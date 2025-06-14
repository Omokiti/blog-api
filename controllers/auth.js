
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const createAccount = async (req, res, next) => {
    try {
      return res.redirect('/login'); 
     
    } catch (err) {
      next(err);
    }
  };






const loginAccount = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) return next(err);

      
      if (!user) {
        return res.redirect('/login'); 
      }

      req.login(user, { session: false }, 
        async (error) => {
        if (error) return next(error);
       
        const body = { _id: user._id, username: user.email };
        
        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET,{expiresIn:process.env.EXPIRE_TIME});
          
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, 
        });
       
        return res.redirect('/userposts');
        
    });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const logoutAccount = (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/login'); 
};

module.exports={
    createAccount,
    loginAccount,
    logoutAccount
    }

