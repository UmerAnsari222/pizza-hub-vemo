const Order = require("../../../models/order")

function statusController() {
    return {
        async update(req, res) {
            try {
                const order = await Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
                // Event emitter
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdate',
                    { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')

            } catch (err) {
                console.log(err);
                return res.redirect('/admin/orders')
            }
        }
    }
}


module.exports = statusController