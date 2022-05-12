import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Profile() {
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();
  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae qui
        deserunt expedita quod recusandae porro a quaerat impedit, unde
        doloremque aut culpa praesentium eum suscipit itaque earum rerum nulla?
        Corrupti.
      </p>
      {/* Logout button temp */}
      {!isPending && <button onClick={logout}>Logout</button>}
      {isPending && <button disabled>Loading..</button>}
      {error && <p>{error}</p>}
    </div>
  );
}
