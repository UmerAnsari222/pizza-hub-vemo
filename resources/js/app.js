import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin"

let addToCart = document.querySelectorAll(".add_to_cart");
let cartCounter = document.querySelector("#cartCounter");

async function updateCart(pizza) {
  try {
    const { data } = await axios.post("/update-cart", pizza);
    cartCounter.innerText = data.totalQty;
    new Noty({
      text: "Item added to cart",
      type: "success",
      timeout: 1000,
      progressBar: false,
    }).show();
    console.log(data);
  } catch (error) {
    new Noty({
      text: "Something went wrong",
      type: "error",
      timeout: 1000,
      progressBar: false,
    }).show();
  }
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    // console.log(pizza);
  });
});


const messageAlert = document.querySelector('#success-alert')

if (messageAlert) {
  setTimeout(() => {
    messageAlert.remove()
  }, 2000);
}


initAdmin()