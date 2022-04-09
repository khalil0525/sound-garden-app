import styles from "./Login.module.css";

export default function Login() {
  return (
    <div className={styles.login}>
      <form>
        <div className={styles["login-form_controls"]}>
          <div className={styles["login-form_control"]}>
            <label>Email</label>
            <input type="text"></input>
          </div>
          <div className={styles["login-form_control"]}>
            <label>Password</label>
            <input type="password"></input>
          </div>
        </div>

        <div className={styles["login-form_actions"]}>
          <button>Login</button>
          <button>Register</button>
        </div>
      </form>
    </div>
  );
}
