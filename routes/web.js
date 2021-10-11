const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");
const orderController = require("../app/http/controllers/customer/orderController");
const homeController = require("../app/http/controllers/homeController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");

// Middleware
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth');
const admin = require("../app/http/middlewares/admin");



function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  app.post('/logout', authController().logout)

  // customer routes
  app.post('/orders', auth, orderController().store)
  app.get('/customer/orders', auth, orderController().index)

  // Admin routes
  app.get('/admin/orders', admin, AdminOrderController().index)




}

module.exports = initRoutes;
