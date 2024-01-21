const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


app.use(bodyParser.json())
app.use(express.static('client'))

const PORT = process.env.PORT || 3000

const storeItems = new Map([
    [
        1, {priceInCents: 10000, name: "Learn React Today"} 
    ], [
        2, {priceInCents: 20000, name: 'Learn GraphQL Today'}
    ]

])

app.get('/', (req, res) => {
    
    res.status(200).json({
        message: "Main page"
    })
})

app.post('/create-checkout-session', async (req, res)=> {
    // res.json({url: "HI"})
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items : req.body.items.map(item=> {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents

                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
          });
        return res.json({url: session.url})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
    
})

app.listen(PORT, ()=> {
    console.log(`App is successfully hosted at: ${PORT}`)
})