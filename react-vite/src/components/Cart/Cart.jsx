import { useSelector, useDispatch } from 'react-redux';
import CartItem from './cartItem';
// import './Cart.css';

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

//   const onSubmit = (e) => {
//     e.preventDefault();
//     window.alert(
//       "Purchased the following:\n" +
//       `${cartItems.map(item => `${item.count} of ${item.name}`).join('\n')}`
//     );
//     dispatch(reset());
//   }

  return (
    <div className="cart">
      <ul>
        {cartItems.map(item => <CartItem key={item.id} item={item}/>)}
      </ul>
      <hr />
      {/* <form onSubmit={onSubmit}> */}
        <button type="submit">Checkout</button>
      {/* </form> */}
    </div>
  )
}



export default Cart;
