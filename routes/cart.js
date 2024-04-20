const mongoose = require('mongoose')


const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },

    products: [ {
        type: mongoose.Types.ObjectId,
        ref: "cartProduct"
    } ],

    price: {
        type: Number,
        default: 0
    }

})
module.exports = mongoose.model('cart', cartSchema)