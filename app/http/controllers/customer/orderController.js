const Order = require("../../../models/order")
const moment = require("moment")

function orderController() {
    return {

        store(req, res) {

            const { phone, address } = req.body
            console.log(phone, address);
            if (!phone || !address) {
                req.flash('error', "All fields are required")
                res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then((result) => {
                req.flash('success', "Order placed successfully.")
                delete req.session.cart
                res.redirect("/customer/orders")

            }).catch((err) => {
                req.flash('error', "Something went wrong")
                res.redirect('/cart')
            })

        },

        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        }

    }
}




module.exports = orderController