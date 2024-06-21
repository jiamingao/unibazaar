import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCountThunk, removeItemThunk } from '../../redux/cart';
import './CartItem.css';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(item.quantity);
  // console.log("from cartItem",item.id)

  useEffect(() => {
    setCount(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (e) => {
    const newCount = e.target.value;
    setCount(newCount);
  };

  const handleBlur = () => {
    if (count !== item.quantity) {
      dispatch(updateCountThunk(item.id, Number(count)));
    }
  };

  const increment = () => {

    setCount((prevCount) => {
      const newCount = prevCount + 1;
      dispatch(updateCountThunk(item.id, newCount));
      return newCount;
  });

  };

  const decrement = () => {
    setCount((prevCount) => {
      const newCount = prevCount - 1;
      if(newCount<1){
        dispatch(removeItemThunk(item.id))
      }else{
        dispatch(updateCountThunk(item.id, newCount));
        return newCount;
      }
  });

  };

  return (
    <li className="cart-item">
      <div className="cart-item-header">
        <div className='cart-item-name'>{item.product.name}</div>
        <div className='cart-item-price'>${item.product.price}</div>
        </div>
      <div className="cart-item-menu">
        <div className='cart-qty'>
        <input
          type="number"
          value={count}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
        />
        <button className="cart-item-button" onClick={increment}>+</button>
        <button className="cart-item-button" onClick={decrement}>-</button>
        </div>
        <button
          className="cart-remove-button"
          onClick={() => dispatch(removeItemThunk(item.id))}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default CartItem;
