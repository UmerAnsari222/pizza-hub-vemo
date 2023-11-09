import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin"
import moment from "moment"
import { initStripe } from './stripe';

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




// change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
let small = document.createElement('small')

order = JSON.parse(order)


function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove('step_completed')
    status.classList.remove('current')
  })
  let stepCompleted = true
  statuses.forEach((status) => {

    let dataProp = status.dataset.status
    if (stepCompleted) {
      status.classList.add('step_completed')
    }

    if (dataProp === order.status) {
      small.innerText = moment(order.updatedAt).format('hh:mm A')
      status.appendChild(small)
      stepCompleted = false
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current')
      }
    }

  })
}

updateStatus(order)


initStripe()



let socket = io()

initAdmin(socket)


if (order) {
  socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname

if (adminAreaPath.includes('admin')) {
  socket.emit('join', 'adminRoom')
}

socket.on('orderUpdate', (data) => {
  const updatedOrder = { ...data }
  updatedOrder.updatedAt = moment().format()
  updatedOrder.status = data.status
  updateStatus(updatedOrder)

  new Noty({
    text: "Order udated",
    type: "success",
    timeout: 1000,
    progressBar: false,
  }).show();
})