import axios from "axios";
import Noty from "noty";

export function placeOrder(formObject) {
    axios.post('/orders', formObject)
        .then((response) => {
            new Noty({
                text: response.data.message,
                type: "success",
                timeout: 1000,
                progressBar: false,
            }).show();

            setTimeout(() => {
                window.location.href = "/customer/orders"
            }, 1000);

        })
        .catch((err) => {
            new Noty({
                text: response.data.message,
                type: "error",
                timeout: 1000,
                progressBar: false,
            }).show();
        })
}