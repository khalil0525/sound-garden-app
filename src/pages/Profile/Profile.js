import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../images/pencil_solid.svg";
import { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import { useCollection } from "../../hooks/useCollection";
import ActionBar from "../../components/ActionBar/ActionBar";
import Button from "../../components/UI/Button/Button";
import { useLocation, useParams } from "react-router-dom";

export default function Profile() {
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  const location = useLocation();
  const params = useParams();
  const URL = params.profileURL;
  const { documents: profileDocuments, error: profileDocumentsError } =
    useCollection("users", ["profileURL", "==", URL]);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditProfile = () => {
    setIsEditing(false);
  };
  // useEffect(() => {
  //   window.location.reload();
  // }, [URL]);
  useEffect(() => {
    console.log(location);
    console.log(params);
    console.log(profileDocuments);
  });

  return (
    <>
      {profileDocuments && profileDocuments.length ? (
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
            {/* Logout button should only show when the :ProfileURL belongs to */}
            {profileDocuments &&
              user.uid === profileDocuments[0].userID &&
              (!isPending ? (
                <Button onClick={logout} buttonSize="large">
                  Logout
                </Button>
              ) : (
                <Button disabled buttonSize="large">
                  Loading..
                </Button>
              ))}
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
      ) : (
        <h1>We can’t find that user.</h1>
      )}
    </>
  );
}
