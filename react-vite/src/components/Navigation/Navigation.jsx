import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { FaGift } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogin } from '../../redux/session';
import { LuShoppingCart } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import Cart from "../Cart/Cart";
import { useState, useEffect } from 'react';
import { FaArrowRight } from "react-icons/fa";


function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currUser = useSelector(state => state.session.user)

  const [showCart, setShowCart] = useState(false);
  const cartOrder = useSelector((state) => state.cart.order);

  useEffect(() => {
    if (cartOrder.length) setShowCart(true);
  }, [cartOrder]);


  const heartIcon = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
  };

  return (
    <div className="navigation-container">
    <div className="logo-title-container">
      <NavLink className="nav-home" to='/'>
      <FaGift className="logo" size={45} />
      </NavLink>
      <NavLink className="nav-home" to='/'>
      <h2 className="nav-title">UniBazaar</h2>
      </NavLink>
      </div>
      <div className="searchBar" > <IoSearchCircle className="search-button" size={35} /> <input className='search-input' placeholder="Search for anthing" type="search"/> </div>
      <div className="nav-right-part">
    {currUser ? (
      <div className="logged-in-container">
      <FaRegHeart className="heart-icon" onClick={heartIcon} size={30} />

      <NavLink to='/products/current'className="manage-product-btn">
      <div className="create-link">Manage your Products</div>
      </NavLink>

      <ProfileButton />
        </div>
    ) : (
        <div className="non-logged-in-container">
            <button
                className="demo-login-button"
                onClick={async () => {
                    await dispatch(
                        thunkLogin({
                            email: "demo@aa.io",
                            password: "password",
                        })
                    );
                    navigate("/");
                }}
            >
                Log in as a demo user
            </button>
            <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                className="login-button"
            />
            <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                className="signup-button"
            />
        </div>
    )}
    <div className="shoping-cart">
      <button className="checkout-button" onClick={() => setShowCart(true)} aria-label="Open cart">
      <LuShoppingCart className="cart-icon"  />
          Cart
        </button>
      </div>

      <div
        className="sidebar"
        style={showCart ? { transform: 'translateX(0)' } : { transform: 'translateX(100%)' }}
      >
        <div className="sidebar-header">
          <FaArrowRight onClick={() => setShowCart(false)} aria-label="Close cart" />
        </div>

        <Cart />
      </div>

    </div>
</div>
  );
}

export default Navigation;
