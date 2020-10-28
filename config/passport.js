
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose =require('mongoose');
const User = require('../models/User');

module.exports = function(passport){
// Creating the google strategy
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback',
},
//Call back function to accept the profile of the user 
async (acessToken,refreshToken,profile,done) => {
    console.log(profile);

    const  newUser = {
        googleId : profile.id,
        displayName : profile.displayName,
        firstName :profile.name.givenName,
        lastName : profile.name.familyName,
        image :profile.photos[0].value,
     }

     try{
         const user = await User.findOne({googleId : profile.id});
         if(user){
             done(null,user);
         }else{
             const user = await User.create(newUser);
             done(null,user);
         }
     }catch(err){
         console.error(err)
     }
})
)
//Passport functions to create user sessions 

passport.serializeUser( (user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


}