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
import { thunkLogin } from '../../redux/session'


function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currUser = useSelector(state => state.session.user)

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
      <div className="searchBar" > <IoSearchCircle /> <input className='search' placeholder="Search" type="search"/> </div>
    {currUser ? (
      <div className="logged-in-container">
      <NavLink to='/products/new'className="create-link"> Create </NavLink>
      <ProfileButton />
        </div>
    ) : (
        <div className="non-logged-in-container">
            <button
                id="demo-login-button"
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
</div>
  );
}

export default Navigation;
