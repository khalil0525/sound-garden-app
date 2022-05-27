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
import placeholderImage from "../../images/profile_placeholder.svg";
import CollectionResults from "../../components/CollectionResults/CollectionResults";

export default function Profile({ scrollRef }) {
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  const location = useLocation();
  const params = useParams();
  const URL = params.profileURL;
  const query = ["music", ["userID", "==", user.uid]];
  const { documents: profileDocuments, error: profileDocumentsError } =
    useCollection("users", ["profileURL", "==", URL]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const handleEditProfile = () => {
    setIsEditingProfile(false);
  };
  const handleEditHeader = () => {
    setIsEditingHeader(false);
  };

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
            <div className={styles["profile__headerContainer"]}>
              <div className={styles["profile__header"]}>
                <div className={styles["profile__header-imgContainer"]}>
                  <img
                    src={
                      profileDocuments[0].profilePhotoURL
                        ? profileDocuments[0].profilePhotoURL
                        : placeholderImage
                    }
                    alt="User profile"
                  />
                </div>
                <div className={styles["profile__header-content"]}>
                  <div className={styles["profile__header-textContainer"]}>
                    <h2 className={styles["profile__header-displayName"]}>
                      {profileDocuments[0].displayName}
                    </h2>
                    {profileDocuments[0].firstName ||
                    profileDocuments[0].lastName ? (
                      <h3 className={styles["profile__header-firstLastName"]}>
                        {profileDocuments[0].firstName +
                          " " +
                          profileDocuments[0].lastName}
                      </h3>
                    ) : null}
                  </div>
                  <div className={styles["profile__header-editContainer"]}>
                    <Button
                      onClick={() => setIsEditingHeader(true)}
                      // disabled={isEditingHeader}
                      buttonSize="large"
                      // iconImage={editIcon}
                      altText="Profile edit Icon"
                      className={styles["editContainer-updateBtn"]}
                    >
                      Update image
                    </Button>
                    {/* { ( */}
                    {isEditingHeader && (
                      <ul className={styles["editContainer-menu"]}>
                        <Button buttonSize="large">Replace image</Button>
                        <Button buttonSize="large">Delete image</Button>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["profile__profileActions"]}>
              {/* Logout button temp */}
              {/* Logout button should only show when the :ProfileURL belongs to */}
              {profileDocuments && user.uid === profileDocuments[0].userID && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  disabled={isEditingProfile}
                  buttonSize="large"
                  iconImage={editIcon}
                  altText="Profile edit Icon"
                >
                  Edit
                </Button>
              )}
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
            <CollectionResults scrollRef={scrollRef} query={query} />
          </div>
        </div>
      ) : (
        <h1>We can’t find that user.</h1>
      )}
      {isEditingProfile && (
        <Modal
          action="editProfileInformation"
          userInformation={profileDocuments[0]}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
    </>
  );
}
