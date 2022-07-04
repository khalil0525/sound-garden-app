import styles from "./Profile.module.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../images/pencil_solid.svg";
import { useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import { useCollection } from "../../hooks/useCollection";
import ActionBar from "../../components/ActionBar/ActionBar";
import Button from "../../components/UI/Button/Button";
import { useParams } from "react-router-dom";
import placeholderImage from "../../images/profile_placeholder.svg";
import CollectionResults from "../../components/CollectionResults/CollectionResults";

export default function Profile({ scrollRef }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [updateButtonToggled, setUpdateButtonToggled] = useState(false);

  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  // const location = useLocation();
  const params = useParams();
  const URL = params.profileURL;

  const { documents: profileDocuments, error: profileDocumentsError } =
    useCollection("users", ["profileURL", "==", URL]);
  const query = profileDocuments
    ? ["music", ["userID", "==", profileDocuments[0].userID]]
    : null;
  const handleEditProfile = () => {
    setIsEditingProfile(false);
  };
  const handleEditHeader = () => {
    setIsEditingHeader(false);
  };

  // useEffect(() => {
  //   console.log(location);
  //   console.log(params);
  //   console.log(profileDocuments);
  // });

  return (
    <div className={styles.profile}>
      <ActionBar className={styles["profile__actionBar"]} user={user} />

      {profileDocuments && profileDocuments.length ? (
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
                    onFocus={() => setUpdateButtonToggled(true)}
                    onBlur={() => setUpdateButtonToggled(false)}
                    // disabled={isEditingHeader}
                    buttonSize="large"
                    // iconImage={editIcon}

                    altText="Profile edit Icon"
                    className={`${styles["editContainer-updateBtn"]} ${
                      updateButtonToggled &&
                      styles["editContainer-updateBtn--focused"]
                    }`}
                  >
                    Update image
                  </Button>
                  {/* { ( */}
                  {updateButtonToggled && (
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
            {profileDocuments &&
              user &&
              user.uid === profileDocuments[0].userID && (
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
              user &&
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
          {profileDocuments && query && (
            <CollectionResults scrollRef={scrollRef} query={query} />
          )}
        </div>
      ) : (
        <div className={styles["profile__notFound"]}>
          <h1>We can’t find that user.</h1>
          <p>Please check the extension and try again!</p>
        </div>
      )}

      {isEditingProfile && (
        <Modal
          action="editProfileInformation"
          userInformation={profileDocuments[0]}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
    </div>
  );
}
