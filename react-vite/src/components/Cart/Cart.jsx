import { useSelector, useDispatch } from 'react-redux';
import CartItem from './cartItem';
// import { reset } from '../../redux/cart';
import { removeItemThunk } from '../../redux/cart';
import './Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const cartItemsObj = useSelector((state)=>state.cart.items);
  // console.log(cartItemsObj)

  const cartItems = cartItemsObj ? Object.values(cartItemsObj) : [];

  if (!cartItems || !cartItems.length) return (
    <div className="cart">
      Your cart is empty. Discover something unique to fill it up.
    </div>
  );

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.quantity * item.product.price);
  }, 0);

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   window.alert(
  //     "Purchased the following:\n" +
  //     `${cartItems.map(item => `${item.quantity} of ${item.product.name}`).join('\n')}`
  //   );
  //   dispatch(reset());
  // }


  const onSubmit = (e) => {
    e.preventDefault();
    window.alert(
      "Purchased the following:\n" +
      `${cartItems.map(item => `${item.quantity} of ${item.product.name}`).join('\n')}`
    );
    cartItems.map(item=>(dispatch(removeItemThunk(item.id))))

  }


  return (
    <div className="cart">
      <ul>
        {cartItems.map(item => <CartItem key={item.id} item={item}/>)}
      </ul>
      <hr className='cart-line' />
      <div>
      Total: ${totalPrice.toFixed(2)}
      </div>
      <form onSubmit={onSubmit}>
        <button className='cart-checkout-btn' type="submit">Checkout</button>
      </form>
    </div>
  )
}

export default Cart;
