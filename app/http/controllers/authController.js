const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {

  function _getRedirectUrl(req) {
    return req.user.role === "admin" ? '/admin/orders' : '/customer/orders'
  }

  return {

    login(req, res) {
      res.render("auth/login");
    },

    async postLogin(req, res, next) {

      const { email, password } = req.body;

      // validate request
      if (!email || !password) {
        req.flash("error", "All fields are required");
        req.flash("email", email);
        return res.redirect("/login");
      }

      await passport.authenticate('local', (err, user, info) => {

        if (err) {
          req.flash('error', info.message)
          return next(err)
        }

        if (!user) {
          req.flash('error', info.message)
          return res.redirect('/login')
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message)
            return next(err)
          }

          return res.redirect(_getRedirectUrl(req))

        })
      })(req, res, next)

    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {

      const { name, email, password } = req.body;

      // validate request
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // check user is existing
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      //  Hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // create user
      const user = await new User({
        name: name,
        email: email,
        password: hashPassword,
      });

      // save user
      user
        .save()
        .then((user) => {
          res.redirect("/");
        })
        .then((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },

    logout(req, res) {
      req.logout()
      res.redirect('/login')
    }

  };
}

module.exports = authController;
