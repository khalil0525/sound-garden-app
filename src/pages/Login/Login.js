import styles from "./Login.module.css";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  return (
    <form className={styles["login-form"]} onSubmit={handleFormSubmit}>
      <h2>Login</h2>

      <div className={styles["login-form_controls"]}>
        <div className={styles["login-form_control"]}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className={styles["login-form_control"]}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
      </div>

      <div className={styles["login-form_actions"]}>
        <button type="submit">Login</button>
        <button>Register</button>
      </div>
    </form>
  );
}
