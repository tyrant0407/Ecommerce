const mongoose = require('mongoose')
const product = require('./product')

const orderItemSchema = mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    quantity:{type:Number}
})

const orderSchema = mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    orderItems:[orderItemSchema],
    price:{
        type:Number,
        default:0,

    },
    status:{
        type:String,
        enum:['pending','processing','completed'],
        default:'pending',
    }
})

module.exports = mongoose.model('order',orderSchema)