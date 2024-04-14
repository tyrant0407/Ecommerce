const mongoose = require('mongoose')

const cartProductSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },
    quantity: { type: Number }
})

module.exports = mongoose.model('cartProduct', cartProductSchema)
