import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        firstname,
        lastname,
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const isSignupDisabled = email.length === 0 || password.length === 0 || username ===0 || firstname===0 || lastname===0;

  return (
    <section>
    <div className="signup-container">
      <div className="signup-form-box">
      <form className="signup-form" onSubmit={handleSubmit}>
      <div className="signup-title">Sign Up</div>{errors.server && <p>{errors.server}</p>}

      <div className="signup-field">
          <input
            type="text"
            className="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email {errors.email && <p>{errors.email}</p>} </label>
        </div>

        <div className="signup-field">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        <label>Username {errors.username && <p>{errors.username}</p>}</label>
        </div>

        <div className="signup-field">
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        <label>First Name {errors.firstname && <p>{errors.firstname}</p>}</label>
        </div>

        <div className="signup-field">
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        <label>Last Name {errors.lastname && <p>{errors.lastname}</p>}</label>
        </div>

        <div className="signup-field">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <label>Password {errors.password && <p>{errors.password}</p>}</label>
        </div>

        <div className="signup-field">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <label>Confirm Password {errors.confirmPassword && <p>{errors.confirmPassword}</p>}</label>
        </div>

        <button className="submit-button-signup" type="submit" disabled={isSignupDisabled}>Sign Up</button>
      </form>
      </div>
    </div>
    </section>
  );
}

export default SignupFormModal;
