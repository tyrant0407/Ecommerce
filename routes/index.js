var express = require('express');
var router = express.Router();
const userModel = require('./users')
const productModel = require('./product')

var users = require('./users')
var passport = require('passport')
var localStrategy = require('passport-local')
passport.use(new localStrategy(users.authenticate()))
const upload = require('./multer')

/* GET home page. */
router.get('/', isloggedIn, async function (req, res, next) {

  const allProducts = await productModel.find()

  res.render('index', { title: 'Express', allProducts });
});


router.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
})


router.post('/register', function (req, res) {

  var userData = new userModel({
    username: req.body.username,
    accountType: req.body.isSeller === 'on' ? "seller" : 'buyer'
  })
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        console.log('registered user', registeredUser)
        if (registeredUser.accountType === 'seller') {
          res.redirect("/createProduct")
          return
        }
        res.redirect('/');
      })
    })
});

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
}

function isSeller(req, res, next) {
  if (req.user.accountType === 'seller') return next()
  else res.redirect('/')
}


router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
})


router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res, next) => {
    if (req.user.accountType == 'seller') {
      res.redirect('/createProduct')
    }
    else {
      res.redirect('/')
    }
  }
);


router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});

router.get('/createProduct', isloggedIn, isSeller, function (req, res) {
  res.render('createProduct', { title: 'Create Product' });
})


router.post('/createProduct', isloggedIn, isSeller, upload.array('image'), async (req, res, next) => {

  const newProduct = await productModel.create({
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description,
    user: req.user._id,
    image: req.files.map(file => {
      return "/upload/" + file.filename
    })
  })

  res.redirect('/')

})

router.get('/cart', (req, res, next) => {
  res.render('cart')
})

router.get('/profile', (req, res, next) => {
  res.render('profile')
})



module.exports = router;