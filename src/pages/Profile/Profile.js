import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../images/pencil_solid.svg";
import { useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import { useCollection } from "../../hooks/useCollection";
export default function Profile() {
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  const { documents: profileDocuments, error: profileDocumentsError } =
    useCollection("users", ["__name__", "==", user.uid ? user.uid : "none"]);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditProfile = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      {profileDocuments && user.uid === profileDocuments[0].userID && (
        <button
          className={`${styles["actionContainer_editBtn"]} ${styles.btn}`}
          onClick={() => setIsEditing(true)}
        ></button>
      )}
      <button
        className={`${styles["actionContainer_editBtn"]} ${styles.btn}`}
        onClick={() => setIsEditing(true)}
      >
        {isEditing && (
          <Modal
            action="editProfileInformation"
            userInformation={profileDocuments[0]}
            onConfirm={handleEditProfile}
            onCancel={() => setIsEditing(false)}
          />
        )}
        <img
          className={styles["actionContainer_editBtn-icon"]}
          src={editIcon}
          alt="Song Download Icon"
        />
        Edit
      </button>
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
