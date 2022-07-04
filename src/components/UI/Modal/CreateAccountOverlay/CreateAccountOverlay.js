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
      <form className={styles["registerForm"]} onSubmit={handleFormSubmit}>
        <h2>Create a New Account</h2>

        <div className={styles["registerForm_controls"]}>
          <input
            type="email"
            value={email}
            placeholder="Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            value={displayName}
            placeholder="Username"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        {/* We are conditionally rendering buttons based on isPending, which
      is a piece of state in our useRegister hook which will be set to true
      when the create user attempts to process */}
        {!isPending && (
          <div className={styles["registerForm_actions"]}>
            <button type="submit">Register</button>
          </div>
        )}
        {isPending && (
          <div className={styles["registerForm_actions"]}>
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
