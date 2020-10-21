"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth2"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fetch = require("node-fetch");

require("babel-core/register");

require("babel-polyfill");

var LOCAL_PORT = 8081;
var DEPLOY_URL = "http://localhost:8081";
var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var GithubStrategy = _passportGithub["default"].Strategy;
var GoogleStrategy = _passportGoogleOauth["default"].Strategy;
var FacebookStrategy = _passportFacebook["default"].Strategy;
var app = (0, _express["default"])(); //////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////

_passport["default"].use(new GithubStrategy({
  clientID: "1d90e0594c090c4a6a8b",
  clientSecret: "97b239b3bc79632dfd4f9d197628cfac487d2086",
  callbackURL: DEPLOY_URL + "/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
  // TO DO: If user in profile object isn’t yet in our database, add the user here
  return done(null, profile);
}));

_passport["default"].use(new GoogleStrategy({
  clientID: "598098886706-kg4sluu9s43lfevv9hbllmafeue7vrai.apps.googleusercontent.com",
  clientSecret: "-AaR07Yg6G-W3pfT24jgkmIf",
  callbackURL: DEPLOY_URL + "/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
  // TO DO: If user in profile object isn’t yet in our database, add the user here
  return done(null, profile);
}));

_passport["default"].use(new FacebookStrategy({
  clientID: "989435561793077",
  clientSecret: "ed9eaba2ea52aac20a3656f4affd5788",
  callbackURL: DEPLOY_URL + "/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done) {
  // TO DO: If user in profile object isn’t yet in our database, add the user here
  return done(null, profile);
}));

_passport["default"].serializeUser( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, done) {
    var userObject, fbAPIreq;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("In serializeUser.");
            console.log(JSON.stringify(user)); //Note: The code does not use a back-end database. When we have back-end 
            //database, we would put user info into the database in the callback 
            //above and only serialize the unique user id into the session

            userObject = undefined;

            if (!(user.provider == "facebook")) {
              _context.next = 12;
              break;
            }

            _context.next = 6;
            return fetch("https://graph.facebook.com/" + user.id + "/picture");

          case 6:
            fbAPIreq = _context.sent;
            console.log("IN FACEBOOK USEROBJECT DEF");
            console.log(fbAPIreq.url);
            userObject = {
              id: user.displayName + "@" + user.provider,
              displayName: user.displayName,
              provider: user.provider,
              profileImageUrl: fbAPIreq.url
            };
            _context.next = 13;
            break;

          case 12:
            userObject = {
              id: user.displayName + "@" + user.provider,
              displayName: user.displayName,
              provider: user.provider,
              profileImageUrl: user.photos[0].value
            };

          case 13:
            console.log(JSON.stringify(userObject));
            done(null, userObject);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser(function (user, done) {
  console.log("In deserializeUser."); //TO DO: Look up the user in the database and attach their data record to
  //req.user. For the purposes of this demo, the user record received as a param 
  //is just being passed through, without any database lookup.

  done(null, user);
}); //////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////


app.use((0, _expressSession["default"])({
  secret: "speedgolf",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60
  }
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session()).listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
}); //////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////
//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on 
//Log In page.

app.get('/auth/github', _passport["default"].authenticate('github')); //CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get('/auth/github/callback', _passport["default"].authenticate('github', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/github/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
}); //AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on 
//Log In page.

app.get('/auth/google', _passport["default"].authenticate('google', {
  scope: ['profile']
})); //CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get('/auth/google/callback', _passport["default"].authenticate('google', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/google/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
});
app.get('/auth/facebook', _passport["default"].authenticate('facebook'));
app.get('/auth/facebook/callback', _passport["default"].authenticate('facebook', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/facebook/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
}); //LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.

app.get('/auth/logout', function (req, res) {
  console.log('/auth/logout reached. Logging out');
  req.logout();
  res.redirect('/');
}); //TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.

app.get('/auth/test', function (req, res) {
  console.log("auth/test reached.");
  var isAuth = req.isAuthenticated();

  if (isAuth) {
    console.log("User is authenticated");
    console.log("User record tied to session: " + JSON.stringify(req.user));
  } else {
    //User is not authenticated
    console.log("User is not authenticated");
  } //Return JSON object to client with results.


  res.json({
    isAuthenticated: isAuth,
    user: req.user
  });
});
