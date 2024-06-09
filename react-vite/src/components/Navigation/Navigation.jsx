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


function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currUser = useSelector(state => state.session.user)

  const cartIcon = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
  };

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
    <div className="shoping-cart"><LuShoppingCart className="cart-icon" onClick={cartIcon} size={30} /></div>
    </div>
</div>
  );
}

export default Navigation;
