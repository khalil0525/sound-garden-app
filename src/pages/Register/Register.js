import styles from "./Register.module.css";
import { useState } from "react";
import { useRegister } from "../../hooks/useRegister";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { register, isPending, error } = useRegister();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    register(email, password, displayName);
  };

  return (
    <form className={styles["register-form"]} onSubmit={handleFormSubmit}>
      <h2>Register</h2>

      <div className={styles["register-form_controls"]}>
        <div className={styles["register-form_control"]}>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className={styles["register-form_control"]}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div className={styles["register-form_control"]}>
          <label>Username</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          ></input>
        </div>
      </div>
      {/* We are conditionally rendering buttons based on isPending, which
      is a piece of state in our useRegister hook which will be set to true
      when the create user attempts to process */}
      {!isPending && (
        <div className={styles["register-form_actions"]}>
          <button type="submit">Register</button>
        </div>
      )}
      {isPending && (
        <div className={styles["register-form_actions"]}>
          <button disabled>loading</button>
        </div>
      )}
      {/* We are conditionally rendering an error message which firebase will
      return back if we encounter an error during registration. */}
      {error && <p>{error}</p>}
    </form>
  );
}
