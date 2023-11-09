const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    store(req, res) {
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res.json({ message: "All fields are required" });
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placed) => {
            // Stripe Payment

            if (paymentType === "card") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "usd",
                  description: `Pizza order: ${placed._id}`,
                })
                .then(() => {
                  placed.paymentStatus = true;
                  placed.paymentType = paymentType;
                  placed
                    .save()
                    .then((ord) => {
                      console.log(ord);
                      // Emit
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;
                      res.json({
                        message:
                          "Payment successfully Order placed successfully...",
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                  res.json({
                    message:
                      "Order Placed but Payment Failed You can pay at delivered time",
                  });
                });
            }
          });
        })
        .catch((err) => {
          res.json({ message: "Something went wrong" });
          //   req.flash("error", "Something went wrong");
          //   res.redirect("/cart");
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      return res.render("customers/orders", { orders: orders, moment: moment });
    },

    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // console.log(order);
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order: order });
      } else {
        return res.redirect("/");
      }
    },
  };
}

module.exports = orderController;
