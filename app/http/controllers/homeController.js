const Menu = require("../../models/menu");
function homeController() {
  return {
    async index(req, res) {
      try {
        const pizzas = await Menu.find();
        res.render("home", { pizzas });
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = homeController;
