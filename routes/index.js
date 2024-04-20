var express = require('express');
var router = express.Router();
const userModel = require('./users')
const productModel = require('./product')
const cartModel = require('./cart')
const cartProductModel = require('./cartProduct')
const orderModel = require('./order.js')

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
// router.get('/checkout', function (req, res) {
//   res.render('checkout');
// })


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

<<<<<<< HEAD
router.get('/cart',isloggedIn, async (req, res, next) => {
  const userCart = await cartModel.findOne({
    user:req.user._id
  }).populate('products').populate({
    path:'products',
    populate:'product'
  })

  res.render('cart',{userCart})
})
router.get('/addToCart/:productId',async (req, res, next) => {
 const productId = req.params.productId;
 let product = await productModel.findById(productId)
 if(!product) return res.status(404).send('product not found')

 let  userCart = await cartModel.findOne({
  user:req.user._id
 })

 if(!userCart){
  userCart = await cartModel.create({
    user:req.user._id
  })
 }

 let newCartProduct = await cartProductModel.findOne({
  product:productId,  
  _id:{$in:userCart.products}
 })


if(newCartProduct){
 newCartProduct.quantity = newCartProduct.quantity + 1
 userCart.price=userCart.price + product.price,
 
 await newCartProduct.save()
}
else{
  newCartProduct = await cartProductModel.create({
  product:productId,
  quantity:1,
})

 userCart.products.push(newCartProduct._id)
 userCart.price=userCart.price + product.price

}

await userCart.save()

res.redirect('back')
=======
router.get('/cart', isloggedIn, async (req, res, next) => {
  const userCart = await cartModel.findOne({
    user: req.user._id
  }).populate('products').populate({
    path: "products",
    populate: 'product'
  })

  let totalPrice = 0

  userCart.products.forEach(cartProduct => {
    totalPrice += cartProduct.product.price * (cartProduct.quantity == 0 ? 1 : cartProduct.quantity)
  })


>>>>>>> 082648b03969898fa3a2baa1828de1674c4fe79a

  res.render('cart', { userCart, totalPrice })
})

router.get('/profile', (req, res, next) => {
  res.render('profile')
})
router.post('/updatedQuantity',isloggedIn,async (req, res, next) => {
  let userCart=await cartModel.findOne({
    user:req.user._id
  })
  if(!userCart) return res.status(404).send('cart not found')
  let product = await cartProductModel.findById(req.body.cartProductId).populate('product');
  if(!product) return res.status(404).send('product not found')
  userCart.price = userCart.price - (product.product.price*product.quantity) + (product.product.price * req.body.quantity )

<<<<<<< HEAD
  await cartProductModel.findOneAndUpdate({_id:req.body.cartProductId},
  {quantity:req.body.quantity}),
  res.json({message:"quantity updated",price:userCart.price})
})
  router.get('/remove/:cartProductId',isloggedIn,async (req, res, next) => {
    const userCart = await cartModel.findOne({
      user:req.user._id
    })
    if(!userCart) return res.status(404).send('cart not found')
    let product = await cartProductModel.findById(req.params.cartProductId).populate('product')
    if(!product) return res.status(404).send('product not found')
    userCart.products = user.products.filter(p=> p.toString() !== req.params.cartProductId);
    await userCart.save();
=======
router.get('/addToCart/:productId', isloggedIn, async (req, res, next) => {
  const productId = req.params.productId

  let userCart = await cartModel.findOne({
    user: req.user._id
  })

  if (!userCart) {
    userCart = await cartModel.create({
      user: req.user._id,
    })
  }


  let newCartProduct = await cartProductModel.findOne({
    product: productId,
    _id: { $in: userCart.products }
  })

  if (newCartProduct) {
    newCartProduct.quantity = newCartProduct.quantity + 1
    await newCartProduct.save()
  }
  else {
    newCartProduct = await cartProductModel.create({
      product: productId,
      quantity: 1
    })
    userCart.products.push(newCartProduct._id)
    await userCart.save()
  }


  res.redirect('back')

})

router.post('/updateQuantity', isloggedIn, async (req, res, next) => {
  await cartProductModel.findOneAndUpdate({ _id: req.body.cartProductId }, {
    quantity: req.body.quantity
  })
  res.json({ message: "quantity updated" })
})

router.get('/remove/:cartProductId', isloggedIn, async (req, res, next) => {
  await cartProductModel.findOneAndDelete({ _id: req.params.cartProductId })
  res.redirect('back')
})

>>>>>>> 082648b03969898fa3a2baa1828de1674c4fe79a

    await cartProductModel.findOneAndDelete({_id:req.params.cartProductId}),
    res.redirect('back')
  })
router.get('/checkout',isloggedIn,async (req,res,next)=>{
  const userCart = await cartModel.findOne({
    user:req.user._id
  }).populate('products').populate({
    path:'products',
    populate:'product'
  })
  if(!userCart) return res.status(404).send('cart not found');
  let order = await orderModel.findOne({customer:req.user._id,status:'pending'}).populate('orderItems.product');
  if(order) return res.render('checkout',{order});
  let newOrder = await orderModel.create({
    customer:req.user._id,
    orderItems:userCart.products.map(product=>{
      return{
        product:product.product._id,
        quantity:product.quantity
      }
    }),
    price:userCart.price
  })
  await newOrder.populate('orderItems.product').execPopulate();
  return res.render('checkout',{order:newOrder});
}) 

module.exports = router;