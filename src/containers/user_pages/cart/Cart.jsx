// components react bootstrap
import {Form, Card, Button, Image } from 'react-bootstrap'

// components
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'

import { API } from '../../../config/api'

// image
import transaction from '../../../assets/img/transaction.png'
import trash from '../../../assets/img/delete.png'
import flower1 from '../../../assets/img/flower1.png'
import flower2 from '../../../assets/img/flower2.png'

// scss
import './Cart.scss'
import Swal from "sweetalert2";

const Cart = () => {

  // get order cart user
  let { data: orderCart, refetch: refetchOrder} = useQuery('orderCart', async () => {
    const response = await API.get(`/order-cart`);
    return response.data.data;
  });

  // total price cart
  let TotalPrice = 0

  orderCart?.map((item) => {
    TotalPrice += item.total
  })

  // function delete cart
  const handledeleteCart = async (id) => {
    await API.delete(`/cart/${id}`);  
    Swal.fire({
          text: 'Cart successfully deleted',
          icon: 'success',
          confirmButtonText: 'Ok'
    })
    refetchOrder()       
  }

 
  const navigate = useNavigate()
    
  let {id}= useParams()
  id = parseInt(id)

  // const [number, setNumber] = useState(0)

  // HandlerPlus Function
  // const HandlerPlus = () => {
  //     setNumber(number+1)
  //     if (number === orderCart?.quota){
  //       setNumber(orderCart?.quota)
  //       Swal.fire({
  //         text: 'Quota is empty',
  //         icon: 'error',
  //         confirmButtonText: 'Ok'
  //       })
  //     } else if(orderCart?.quota === 0){
  //       setNumber(orderCart?.quota)
  //     }
  // }

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js"; // panngil snap middtrans
    const myMidtransClientKey = "SB-Mid-client-xBHWdiuU4aVE9vOq"; // clint key untuk custom snap
  
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
   
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
// ----------------------------------------

// snap midtrans
 const handlePay = useMutation(async () => {
  try {

    // Configuration
    const config = {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-type": "apllication/json",
      },
    };

    const data = {
      total: TotalPrice,
    }

    // Insert transaction data
    const response = await API.patch("/transaction", data, config);

    console.log("response beli", response)
    const token = response.data.data.token
    console.log(token)

    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log(result);
        Swal.fire({
          text: 'Transaction success',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        navigate(`/profile/${id}`);
        window.location.reload()
      },
      onPending: function (result) {
        console.log(result);
        navigate(`/cart/${id}`);
        window.location.reload()
      },
      onError: function (result) {
        console.log(result);
        Swal.fire({
          title: 'Are you sure to cancel transaction?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              text: 'cancel transaction successfully'
        })
        }
        })
        navigate(`/cart/${id}`)
        
      },
      onClose: function () {
        Swal.fire({
          text: 'please make payment first',
          confirmButtonText: 'Ok'
        })

      },
    })

  } catch (error) {
    console.log(error);
  }
});
// --------------------------------------  

    return (
        <>
            <Image src={flower1} alt='' className='flower1'/>
            <Image src={flower2} alt='' className='flower2'/>
            <h4 className='cart-title'>My Cart</h4>
           
                <div className="payment-container" >
                  <div className='content-satu'>
                    <h3 className="review">Review your order</h3>
                    
                    {orderCart?.map((order, i) => {
                      return (
                        <Card className='container-cart' key={i}>
                          <Card.Img  src={order.book.thumbnail} className='img-card' />
                            <Card.Body className='review-book-desc'>
                              <Card.Title className='review-book-title'>{order.book.title}</Card.Title>
                              <Form.Text className='review-artist'>By. {order.book.author}</Form.Text>
                              <Form.Text className='review-price'>Rp. {order.book.price.toLocaleString()}</Form.Text>
                            </Card.Body>
                            <Button className='btn-trash' onClick={() => { handledeleteCart(order.id)}}>
                              <Image src={trash} className='img-trash' />
                            </Button>
                        </Card>
                      )
                    })}
                  </div>
                    
                  <div className="content-dua">
                    <div className='content-subtotal'>
                            <h5 className="subtotal1">Subtotal</h5>
                            <h5 className='subtotal2'>{TotalPrice.toLocaleString()}</h5>
                    </div>
                    <div className='content-qty'>
                            <h5 className="qty1">Qty</h5>
                            <h5 className='qty2'>{orderCart?.length}</h5>
                    </div>
                    <div className='content-total'>
                            <h5 className="total1">Total</h5>
                            <h5 className='total2'>{TotalPrice.toLocaleString()}</h5>
                    </div>
                    <div className='transaction'>
                            <Image src={transaction} className='img-transaction' alt=''/>
                            <Button className='btn-transaction' onClick={() => handlePay.mutate()}>Pay</Button>
                    </div>
                  </div>
                </div>
              
        </>
    )
}
export default Cart