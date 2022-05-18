import styles from "./SignInOverlay.module.css";
import { useState } from "react";
import { useLogin } from "../../../../hooks/useLogin";

const SignInOverlay = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // try to log user in
    login(email, password);
    console.log(email, password);
  };

  return (
    <div className={styles.modal}>
      <form className={styles["login-form"]} onSubmit={handleFormSubmit}>
        <h2>Login</h2>

        <div className={styles["login-form_controls"]}>
          <div className={styles["login-form_control"]}>
            <input
              type="email"
              value={email}
              placeholder="Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className={styles["login-form_control"]}>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
        </div>

        <div className={styles["login-form_actions"]}>
          {!isPending && <button type="submit">Login</button>}
          {isPending && (
            <button className="btn" disabled>
              Loading
            </button>
          )}
          {/* <button>Register</button> */}
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  );
};
export default SignInOverlay;
