import styles from './Profile.module.css';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import editIcon from '../../images/pencil_solid.svg';
import { useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal/Modal';
// import { useCollection } from '../../hooks/useCollection';

import Button from '../../components/UI/Button/Button';
import { useParams } from 'react-router-dom';
import placeholderImage from '../../images/profile_placeholder.svg';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
import OneColumnLayout from '../../components/Layout/OneColumnLayout';
import { followUser, getUserProfile, unfollowUser } from '../../api/functions';
export default function Profile({ scrollRef }) {
  const [profile, setProfile] = useState(null);
  // const [profileSongs, setProfileSongs] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
  // const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [updateButtonToggled, setUpdateButtonToggled] = useState(false);
  const [isProcessingFollow, setIsProcessingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  // const [isFetchedSongs, setIsFetchedSongs] = useState(false);
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();

  // const location = useLocation();
  const params = useParams();
  const URL = params.profileURL;
  console.log(URL);
  // const { documents: profileDocuments, error: perror } = useCollection('usrs', [
  //   'profileURL',
  //   '==',
  //   URL,
  // ]);
  // // console.log(profileDocuments && profileDocuments.length);
  const query =
    profile && profile.userID
      ? ['music', ['userID', '==', profile.userID]]
      : null;

  const handleEditProfile = () => {
    setIsEditingProfile(false);
  };
  // const handleEditPlaylist = () => {
  //   setIsEditingPlaylist(false);
  // };
  // const handleEditHeader = () => {
  // 	setIsEditingHeader(false);
  // };

  // const getProfileSongs = useCallback(async () => {
  //   try {
  //     const { data } = await getSongs({
  //       where: { field: 'userID', operator: '==', value: profile.userID },
  //     });

  //     console.log(data);
  //     setProfileSongs({ ...data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [profile]);
  async function handleFollowClick() {
    setIsProcessingFollow(true);
    try {
      const { data } = profile.followers.includes(user.id)
        ? await unfollowUser({ userIdToUnfollow: profile.userID })
        : await followUser({ userIdToFollow: profile.userID });

      if (data.success) {
        setIsFollowing((prevState) => !prevState);
      }
      setIsProcessingFollow(false);
    } catch (error) {
      console.error('Error:', error);
      setIsProcessingFollow(false);
    }
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await getUserProfile({ profileURL: URL });
        if (user) {
          setIsFollowing(data.followers.includes(user.id));
        }
        console.log(data);
        setProfile({ ...data });
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, [URL, user]);

  // useEffect(() => {
  //   if (profile && profile?.userID && !isFetchedSongs) {
  //     getProfileSongs();
  //     setIsFetchedSongs(true);
  //   }
  // }, [profile, getProfileSongs, isFetchedSongs]);

  return (
    <OneColumnLayout user={user}>
      {profile !== null ? (
        <div className={styles['profile__content']}>
          <div className={styles['profile__headerContainer']}>
            <div className={styles['profile__header']}>
              <div className={styles['profile__header-imgContainer']}>
                <img
                  src={
                    profile.profilePhotoURL
                      ? profile.profilePhotoURL
                      : placeholderImage
                  }
                  alt="User profile"
                />
              </div>
              <div className={styles['profile__header-content']}>
                <div className={styles['profile__header-textContainer']}>
                  <h2 className={styles['profile__header-displayName']}>
                    {profile.displayName}
                  </h2>
                  {profile.firstName || profile.lastName ? (
                    <h3 className={styles['profile__header-firstLastName']}>
                      {profile.firstName + ' ' + profile.lastName}
                    </h3>
                  ) : null}
                </div>
                <div className={styles['profile__header-editContainer']}>
                  <Button
                    onFocus={() => setUpdateButtonToggled(true)}
                    onBlur={() => setUpdateButtonToggled(false)}
                    // disabled={isEditingHeader}
                    buttonSize="large"
                    // iconImage={editIcon}

                    altText="Profile edit Icon"
                    className={`${styles['editContainer-updateBtn']} ${
                      updateButtonToggled &&
                      styles['editContainer-updateBtn--focused']
                    }`}>
                    Update image
                  </Button>
                  {/* { ( */}
                  {updateButtonToggled && (
                    <ul className={styles['editContainer-menu']}>
                      <Button buttonSize="large">Replace image</Button>
                      <Button buttonSize="large">Delete image</Button>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles['profile__profileActions']}>
            {/* Logout button temp */}
            {/* Logout button should only show when the :ProfileURL belongs to */}
            {profile && user && user.id !== profile.userID && (
              <Button
                className={styles['profile__header_button_follow']}
                onClick={handleFollowClick}
                disabled={isProcessingFollow}
                buttonSize="large">
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            {profile && user && user.uid === profile.userID && (
              <Button
                className={styles['profile__header_button']}
                onClick={() => setIsEditingProfile(true)}
                disabled={isEditingProfile}
                buttonSize="large"
                iconImage={editIcon}
                altText="Profile edit Icon">
                Edit Profile
              </Button>
            )}
            {profile &&
              user &&
              user.uid === profile.userID &&
              (!isPending ? (
                <Button
                  className={styles['profile__header_button']}
                  onClick={logout}
                  buttonSize="large">
                  Logout
                </Button>
              ) : (
                <Button
                  className={styles['profile__header_button']}
                  disabled
                  buttonSize="large">
                  Loading..
                </Button>
              ))}
            {error && <p>{error}</p>}
          </div>
          {profile && query && (
            <CollectionResults
              scrollRef={scrollRef}
              query={query}
            />
          )}
        </div>
      ) : (
        <div className={styles['profile__notFound']}>
          <h1>We can’t find that user.</h1>
          <p>Please check the extension and try again!</p>
        </div>
      )}

      {isEditingProfile && (
        <Modal
          action="editProfileInformation"
          userInformation={profile}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
      {/* {isEditingPlaylist && (
        <Modal
          action="editPlaylistInformation"
          userInformation={profile}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditingPlaylist(false)}
        />
      )} */}
    </OneColumnLayout>
  );
}
