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
      No items in the cart. Start selecting items to purchase.
    </div>
  );

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
      <hr />
      <form onSubmit={onSubmit}>
        <button type="submit">Checkout</button>
      </form>
    </div>
  )
}

export default Cart;
