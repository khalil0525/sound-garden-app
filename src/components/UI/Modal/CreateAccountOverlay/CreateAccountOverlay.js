import styles from "./CreateAccountOverlay.module.css";
import { useState } from "react";
import { useRegister } from "../../../../hooks/useRegister";

const CreateAccountOverlay = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { register, isPending, error } = useRegister();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    register(email, password, displayName);
  };

  return (
    <div className={styles.modal}>
      <form className={styles["register-form"]} onSubmit={handleFormSubmit}>
        <h2>Create a New Account</h2>

        <div className={styles["register-form_controls"]}>
          <div className={styles["register-form_control"]}>
            <input
              type="email"
              value={email}
              placeholder="Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className={styles["register-form_control"]}>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div className={styles["register-form_control"]}>
            <input
              type="text"
              value={displayName}
              placeholder="Username"
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
      return back if we encounter an error during registration. ddd*/}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAccountOverlay;
