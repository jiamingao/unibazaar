import { useEffect,useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";


function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  useEffect(() => {
    const errorObj = {}

    if (!email.length) errorObj.email = "Required";
    if (!password.length) errorObj.password = "Required";

    setErrors(errorObj)

}, [email,password])



  const isSubmitDisabled = email.length === 0 || password.length === 0;

  return (
    <section>
    <div className="login-container">
      <div className="login-form-box">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-title">Log In</div>

        <div className="login-field">
          <input
            type="text"
            className="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email {errors.email && <p className='error-msg'>{errors.email}</p>}</label>
        </div>

        <div className="login-field">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Password {errors.password && <p className='error-msg'>{errors.password}</p>}</label>
        </div>

        <button className="submit-button-login" type="submit" disabled={isSubmitDisabled}>Log In</button>

        <div className="register">
          <p>Don&apos;t have an account?
          <OpenModalButton
                buttonText="register"
                modalComponent={<SignupFormModal />}
                className="login-register-button"
            />
            </p>
        </div>

      </form>
      </div>
    </div>
    </section>
  );
}

export default LoginFormModal;
