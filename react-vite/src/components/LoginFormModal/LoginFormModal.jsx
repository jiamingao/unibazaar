import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

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

  const isSubmitDisabled = email.length === 0 || password.length === 0;

  return (
    <div className="login-container">
      <h1 className="signin-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
        <p>Email {errors.email && <p>{errors.email}</p>}</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
        <p>Password {errors.password && <p>{errors.password}</p>}</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
        <button className="submit-button-login" type="submit" disabled={isSubmitDisabled}>Log In</button>
        </div>

      </form>
    </div>
  );
}

export default LoginFormModal;
