import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../images/pencil_solid.svg";
import { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import { useCollection } from "../../hooks/useCollection";
import ActionBar from "../../components/ActionBar/ActionBar";
export default function Profile() {
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  const { documents: profileDocuments, error: profileDocumentsError } =
    useCollection("users", ["__name__", "==", user.uid ? user.uid : "none"]);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditProfile = () => {
    setIsEditing(false);
  };
  // useEffect(() => {
  //   console.log(profileDocuments && profileDocuments[0]);
  // });

  return (
    <div className={styles.profile}>
      <ActionBar className={styles["profile__actionBar"]} user={user} />

      <div className={styles["profile__content"]}>
        <h2>Profile</h2>
        {profileDocuments && user.uid === profileDocuments[0].userID && (
          <button
            // className={`${styles["actionContainer_editBtn"]} ${styles.btn}`}
            onClick={() => setIsEditing(true)}
          >
            <img
              // className={styles["actionContainer_editBtn-icon"]}
              src={editIcon}
              alt="Profile edit Icon"
            />
            Edit
          </button>
        )}
        {/* Logout button temp */}
        {!isPending && <button onClick={logout}>Logout</button>}
        {isPending && <button disabled>Loading..</button>}
        {error && <p>{error}</p>}
      </div>

      {isEditing && (
        <Modal
          action="editProfileInformation"
          userInformation={profileDocuments[0]}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
