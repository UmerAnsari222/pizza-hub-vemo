
import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from './apiServices';

export async function initStripe() {

    const stripe = await loadStripe('pk_test_51Jp4NYEkFe1dErWsVGANNIfSDMxgp6pnZPkgirvMeFJUeGOnMbcqEVasYxpFbJ59VTRGXj4dRpW1kN9Q75dwzbb100dkXDBbye');
    let card = null

    function mountWidget() {
        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        const elements = stripe.elements();
        card = elements.create('card', { style, hidePostalCode: true });
        card.mount('#cardElement')
    }


    const paymentType = document.querySelector('#paymentType')
    if (!paymentType) {
        return;
    }

    paymentType.addEventListener('change', (e) => {
        console.log(e.target.value);
        if (e.target.value === 'card') {
            // Display stripe status
            mountWidget()
        } else {
            card.destroy()
        }

    })

    // / Ajax call
    const paymentForm = document.querySelector('#paymentForm')
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm);
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if (!card) {
                placeOrder(formObject)
                return;
            }

            // Create Token
            stripe.createToken(card).then((result) => {
                formObject.stripeToken = result.token.id;
                placeOrder(formObject)
            }).catch((error) => {
                console.log(error);
            })



            console.log(formObject);

        })

    }
}