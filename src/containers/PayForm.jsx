import React from 'react'
import { connect } from 'react-redux'
import { Col, Card, Row, CardTitle } from 'react-materialize'
import image from '../assets/statics/lavarropas2.png'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51IQhgKJiWQ4P9HlQZKJPcxOgM0vuXSYAzea7y7zVKlfylerzuR7HGqzgX3riS5lhe6E82UgQfWchBcRIF9L3WqPD009N0Zm9dr')

const CheckoutForm = () => {

//  const stripe = useStripe()
//  const elements = useElements()

//  const handleSubmit = async (event) => {
//     event.preventDefault()

//     const { error, paymentMethod } = await  stripe.createPaymentMethod({
//       type:'card',
//       card: elements.getElement(CardElement)
//     }) 

//     if (!error) {
//         const { id } = paymentMethod
//     }
//  }
    return (
                
        <>  
         <Row>  
            <Col>
                <Card 
                    actions={[<CardElement />,
                        <button className="btn-floating halfway-fab waves-effect waves-light">
                        Buy
                    </button>
                    ]}
                    header={<CardTitle image={image} waves="light"/>}
                    horizontal
                    title="Lavarropas Inteligente"
                >
                    <h2>Price</h2>
                    <h3>100$</h3>
                </Card>
            </Col>
        </Row> 

        </>
    )
    
}



const PayForm = () => {
    return (
        <div className="container">
            <div className="row">
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    )
}

export default connect(null, null) (PayForm)