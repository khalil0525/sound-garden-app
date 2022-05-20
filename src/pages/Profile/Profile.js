import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../images/pencil_solid.svg";
import { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import { useCollection } from "../../hooks/useCollection";
import ActionBar from "../../components/ActionBar/ActionBar";
import Button from "../../components/UI/Button/Button";
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
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            buttonSize="large"
            iconImage={editIcon}
            altText="Profile edit Icon"
          >
            Edit
          </Button>
        )}
        {/* Logout button temp */}
        {!isPending ? (
          <Button onClick={logout} buttonSize="large">
            Logout
          </Button>
        ) : (
          <Button disabled buttonSize="large">
            Loading..
          </Button>
        )}
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
