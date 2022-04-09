import styles from "./Register.module.css";

export default function Register() {
  return (
    <div className={styles.register}>
      <form>
        <label>First name</label>
        <input></input>
        <label>Last name</label>
        <input></input>
        <label>Email</label>
        <input></input>
        <label>Choose a password</label>
        <button>Back to login</button>
        <button>Register</button>
      </form>
    </div>
  );
}
