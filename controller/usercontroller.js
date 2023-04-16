const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // import the user model


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // Check if the user already exists in the database
    User.findOne({ email: profile.email }, function (err, user) {
      if (err) { return done(err); }
      if (user) {
        // User exists, return the user object
        return done(null, user);
      } else {
        // User doesn't exist, create a new user object and save it to the database
        const newUser = new User({
          email: profile.email,
          password: null, // No password required for OAuth users
        });
        newUser.save(function (err) {
          if (err) { return done(err); }
          return done(null, newUser);
        });
      }
    });
  }));

const userLogin =  async function(req, res) {
    try{
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ status: false, message: "Email is required" })
  if (!password) return res.status(400).send({ status: false, message: "Password is required" })
  
  let checkEmail = await userModel.findOne({ email: email });
  if (!checkEmail) return res.status(404).send({ status: false, message: "This user is not found Please provide a correct Email" });

  let checkPassword = await (password, checkEmail.password);   // mostly password used:- 

  if (!checkPassword) return res.status(400).send({ status: false, message: "Your password is wrong, Please enter correct password" })
  ;


  let userId = checkEmail._id
  let userToken = jwt.sign({ userId: userId.toString(), iat: Date.now() },
      'NAFS', { expiresIn: "24h" }
  )
  res.setHeader("x-api-key", userToken)

  res.status(200).send({ status: true, message: "Success", userId: userId, userToken })
}
catch (err) {
  res.status(500).send({ status: false, message: err.message });
}
};

 module.exports ={userLogin}