import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Modal from '../../components/UI/Modal/Modal';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import { followUser, getUserProfile, unfollowUser } from '../../api/functions';
import Layout from '../../components/Layout/Layout';
import placeholderImage from '../../images/profile_placeholder.svg';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';

const tabs = ['All', 'Tracks', 'Playlists', 'Liked', 'Reposted'];

const useStyles = makeStyles((theme) => ({
  profile__content: {
    padding: theme.spacing(2),
  },
  profile__headerContainer: {
    maxWidth: '124rem',
    margin: '0 auto',
  },
  profile__header: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1.6rem',
    padding: '3rem',
    background: '#ccc',
    borderRadius: '1.6rem !important',
  },
  profileHeaderImageContainer: {
    width: '20rem',
    height: '20rem',
    marginRight: '3rem',
    backgroundColor: '#fff',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  profileHeaderImageContainer_img: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  profileHeaderContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  profileHeaderTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
  },
  profileHeaderDisplayName: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'inline-block',
    fontSize: '2rem',
    lineHeight: '3.7rem',
    padding: '0.4rem 0.7rem',
  },
  profileHeaderName: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'inline-block',
    fontSize: '1.5rem',
    lineHeight: '1.2',
    padding: '0.4rem 0.7rem',
  },
  profileHeaderEditContainer: {
    maxWidth: '12rem',
    width: '12rem',
    height: '150px',
    position: 'relative',
    '&:hover $editContainer-updateBtn': {
      display: 'inline-block',
      opacity: 0.8,
    },
  },
  editContainer_updateBtn: {
    display: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    padding: '0.2rem 0.6rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    maxWidth: '12rem',
  },
  editContainer_updateBtn_focused: {
    display: 'inline-block',
  },
  editContainer_updateBtn_hover: {
    opacity: 1,
  },
  editContainer_menu: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  profile__profileActions: {
    display: 'flex',

    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0.4rem 0',
    padding: '0.4rem 2rem 0.8rem',
    borderBottom: '1px solid #ccc',
    width: '100%',
  },
}));

export default function Profile({ scrollRef }) {
  const classes = useStyles();
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateButtonToggled, setUpdateButtonToggled] = useState(false);
  const [isProcessingFollow, setIsProcessingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const URL = params.profileURL;
  const query =
    profile && profile.userID
      ? ['music', ['userID', '==', profile.userID]]
      : null;
  const handleEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleFollowClick = async () => {
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
  };
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await getUserProfile({ profileURL: URL });
        setProfile({ ...data });
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, [URL, user]);
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <CollectionResults
            scrollRef={scrollRef}
            query={query}
          />
        );
      case 1:
        return (
          <CollectionResults
            scrollRef={scrollRef}
            query={query}
          />
        );
      // Add cases for other tabs
      default:
        return null;
    }
  };
  return (
    <Layout user={user}>
      <Grid
        container
        className={classes.profile__content}>
        <Grid
          item
          xs={12}>
          <Grid
            container
            className={classes.profile__headerContainer}>
            <Grid
              item
              xs={12}
              md={12}>
              <Grid
                container
                className={classes.profile__header}>
                <Grid
                  item
                  xs={12}
                  md={3}>
                  <div className={classes.profileHeaderImageContainer}>
                    {profile && profile.profilePhotoURL ? (
                      <img
                        src={profile.profilePhotoURL}
                        alt="User profile"
                        className={classes.profileHeaderImageContainer_img}
                      />
                    ) : (
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={8}>
                  <div className={classes.profileHeaderContent}>
                    <div className={classes.profileHeaderTextContainer}>
                      <h2 className={classes.profileHeaderDisplayName}>
                        {profile?.displayName || (
                          <Skeleton
                            width={60}
                            height={20}
                          />
                        )}
                      </h2>
                      {profile?.firstName || profile?.lastName ? (
                        <h3 className={classes.profileHeaderName}>
                          {profile?.firstName + ' ' + profile?.lastName}
                        </h3>
                      ) : (
                        <Skeleton
                          variant="rounded"
                          width={60}
                          height={20}
                        />
                      )}
                    </div>
                    <div className={classes.profileHeaderEditContainer}>
                      <Button
                        onFocus={() => setUpdateButtonToggled(true)}
                        onBlur={() => setUpdateButtonToggled(false)}
                        className={`${classes.editContainer_updateBtn} ${
                          updateButtonToggled &&
                          classes.editContainer_updateBtn_focused
                        }`}>
                        Update image
                      </Button>
                      {updateButtonToggled && (
                        <ul className={classes.editContainer_menu}>
                          <Button buttonSize="large">Replace image</Button>
                          <Button buttonSize="large">Delete image</Button>
                        </ul>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              width="100%">
              <Box className={classes.profile__profileActions}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered>
                  {tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab}
                    />
                  ))}
                </Tabs>
                <Grid>
                  {profile && user && user.id !== profile.userID && (
                    <Button
                      className={classes.profile__header_button_follow}
                      onClick={handleFollowClick}
                      disabled={isProcessingFollow}
                      buttonSize="large">
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                  {profile && user && user.uid === profile.userID ? (
                    <Button
                      className={classes.profile__header_button}
                      onClick={() => setIsEditingProfile(true)}
                      disabled={isEditingProfile}
                      buttonSize="large">
                      Edit Profile
                    </Button>
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={210}
                      height={60}
                    />
                  )}
                  {profile &&
                    user &&
                    user.uid === profile.userID &&
                    (!isPending ? (
                      <Button
                        className={classes.profile__header_button}
                        onClick={logout}
                        buttonSize="large">
                        Logout
                      </Button>
                    ) : (
                      <Button
                        className={classes.profile__header_button}
                        disabled
                        buttonSize="large">
                        Loading..
                      </Button>
                    ))}
                  {error && <p>{error}</p>}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {profile && (
          <Grid
            item
            xs={12}>
            <CollectionResults
              scrollRef={scrollRef}
              query={query}
            />
          </Grid>
        )}
      </Grid>

      {isEditingProfile && (
        <Modal
          action="editProfileInformation"
          userInformation={profile}
          onConfirm={handleEditProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
    </Layout>
  );
}
