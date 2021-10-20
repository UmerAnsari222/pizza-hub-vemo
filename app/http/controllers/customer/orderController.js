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
                Order.populate(result, { path: 'customerId' }, (err, placed) => {

                    req.flash('success', "Order placed successfully.")
                    delete req.session.cart

                    // Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placed)

                    res.redirect("/customer/orders")

                })

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
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // console.log(order);
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('customers/singleOrder', { order: order })
            } else {
                return res.redirect('/')
            }


        }

    }
}




module.exports = orderController