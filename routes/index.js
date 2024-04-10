var express = require('express');
var router = express.Router();
const passport = require('passport')
const localStrategy = require('passport-local')
const userModel = require('./users.js')
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', isLoggedIn,function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
})
router.post('/register', function(req, res, next) {
  const user = new userModel({
    username:req.body.username,
    email:req.body.email,
    accountType:req.body.isSeller == 'on' ? 'seller':'buyer'
  })
  userModel.register(user,req.body.password)
  .then(function(registeredUser){
  passport.authenticate('local')(req,res, function(err){
    if(registeredUser.accountType=='seller'){
      res.redirect('/createProduct')
    }
    else{
      res.redirect('/')
    }
     })
  })
});
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
})
router.post('/login', passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect: "/login",
}) ,function(req, res) {
});

router.get('/createProduct',isLoggedIn,isSeller,function (req, res) {
  res.render('createProduct', { title: 'Create Product' });
})

router.get('/logout',function(req, res,next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
}

function isSeller(req,res,next){
  if(req.user.accountType == 'seller') return next();
  else res.redirect('/')
}
module.exports = router;
