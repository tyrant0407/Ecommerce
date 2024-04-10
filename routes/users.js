const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/N17Ecommerce")


const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  accountType: {
    type: String,
    enums: [ 'seller', 'buyer' ],
    default: 'buyer'
  },
  wishlist: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  } ],
  
})
userSchema.plugin(plm)
module.exports = mongoose.model('user', userSchema)

