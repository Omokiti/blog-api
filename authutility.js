const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('./models/users');
// require('dotenv').config();
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['token'];
    }
    return token;
  };



passport.use(
    new JWTstrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.TOKEN_SECRET,
            // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
            // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // Use this if you are using Bearer token
        },

        async (jwtPayload, done) => {
            try {
              const user = await UserModel.findById(jwtPayload.user._id);
              if (user) return done(null, user);
              return done(null, false);
            } catch (err) {
              return done(err, false);
            }
          }
        // async (token, done) => {
        //     try {
        //         return done(null, token.user);
        //     } catch (error) {
        //         done(error);
        //     } 
        // }
    )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                if (!password) {
                    return done(new Error('Password is missing'));
                  }
          
                //   const hashedPassword = await bcrypt.hash(password, 10);
                
                const user = await UserModel.create({ 
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email,
                    password
                });
                
                    
               return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);




