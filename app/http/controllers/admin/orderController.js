const Order = require("../../../models/order");

function AdminOrderController() {
    return {
        async index(req, res) {
            try {
                const orders = await Order.find({ status: { $ne: "completed" } }, null, { sort: { 'createdAt': -1 } })
                    .populate('customerId', '-password').exec()



                if (req.xhr) {
                    return res.json(orders)
                }
                else {

                    return res.render('admin/orders')
                }

            } catch (err) {
                console.log(err);
            }

        }
    }
}



module.exports = AdminOrderController;