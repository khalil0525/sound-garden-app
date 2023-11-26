import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Modal from '../../components/UI/Modal/Modal';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import {
  followUser,
  getSongs,
  getUserProfile,
  unfollowUser,
} from '../../api/functions';
import Layout from '../../components/Layout/Layout';

import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import Popover from '@mui/material/Popover';
import SongList from '../../components/SongList/SongList';
import SongItemSkeleton from '../../components/UI/Skeletons/SongItemSkeleton';
// const tabs = ['Tracks', 'Playlists', 'Reposted', 'Likes'];
const tabs = ['Tracks', 'Likes'];
//2480 x 520 (1240 x 260 res)
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.6rem',
    padding: '3.6rem',
    borderRadius: '1.6rem !important',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  bannerSkeleton: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '100% !important',
    height: '100% !important',
  },
  profileHeaderImageContainer: {
    width: '20rem',
    height: '20rem',
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
    '&:hover $editContainer_updateBtn': {
      display: 'inline-block !important',
      opacity: 0.8,
    },
  },
  editContainer_updateBtn: {
    display: 'none !important',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    padding: '0.2rem 0.6rem',
    backgroundColor: '#fff !important',
    color: theme.palette.text.primary,
    maxWidth: '12rem',
    opacity: 0.8,
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
  const [resetQueryTrigger, setResetQueryTrigger] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { logout, error, isPending } = useLogout();
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateButtonToggled, setUpdateButtonToggled] = useState(false);
  const [loadedSongs, setLoadedSongs] = useState([]);
  const [isProcessingFollow, setIsProcessingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [query, setQuery] = useState('resp');
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const URL = params.profileURL;
  const randomBannerPlaceholder = 'https://source.unsplash.com/random/2480x520';
  const queries = {
    profile:
      profile && profile.userID
        ? ['music', ['userID', '==', profile.userID]]
        : null,
    likes: [
      ['likes', 'music'],
      [
        ['__name__', '==', user.uid],
        ['docID', 'in'],
      ],
      'likes',
    ],
  };

  const handleEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleNewQuery = (index) => {
    setCurrentTab(index);
    setResetQueryTrigger((prev) => !prev);
  };
  const handleFollowClick = async () => {
    setIsProcessingFollow(true);
    try {
      const { data } = profile.followers.includes(user.uid)
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

  useEffect(() => {
    const fetchSongs = async () => {
      setIsProcessingFollow(true);
      try {
        console.log(profile.userID);
        const { data } =
          currentTab === 0
            ? await getSongs({
                where: {
                  field: 'userID',
                  operator: '==',
                  value: profile.userID,
                },
              })
            : currentTab === 1
            ? await getSongs({ likeUserId: profile.userID })
            : await getSongs({ repostUserId: profile.userID });
        console.log(data[0]);
        if (data) {
          setLoadedSongs([...data]);
        }
        setIsProcessingFollow(false);
      } catch (error) {
        console.error('Error:', error);
        setIsProcessingFollow(false);
      }
    };
    if (profile && profile.userID.length) {
      fetchSongs();
    }
  }, [profile, currentTab]);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
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
                className={classes.profile__header}
                style={{
                  backgroundImage: `url(${
                    profile?.bannerURL || randomBannerPlaceholder
                  })`,
                }}>
                {/* {!profile?.bannerURL && (
                  <Skeleton
                    variant="rect"
                    className={classes.bannerSkeleton}
                  />
                )} */}
                <Grid
                  item
                  xs={12}
                  md={2.5}>
                  <div className={classes.profileHeaderImageContainer}>
                    {profile && profile?.profilePhotoURL ? (
                      <img
                        src={profile.profilePhotoURL}
                        alt="User profile"
                        className={classes.profileHeaderImageContainer_img}
                      />
                    ) : (
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: '40px !important',
                          height: '40px !important',
                        }}
                      />
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={9.5}>
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
                          width={60}
                          height={20}
                        />
                      )}
                    </div>
                    <div className={classes.profileHeaderEditContainer}>
                      <Button
                        className={classes.editContainer_updateBtn}
                        onClick={handlePopoverOpen}>
                        Update image
                      </Button>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}>
                        <ul className={classes.editContainer_menu}>
                          <Button>Replace image</Button>
                          <Button>Delete image</Button>
                        </ul>
                      </Popover>
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
                      onClick={() => handleNewQuery(index)}
                    />
                  ))}
                </Tabs>
                <Grid>
                  {profile && user && user.uid !== profile.userID && (
                    <Button
                      className={classes.profile__header_button_follow}
                      onClick={handleFollowClick}
                      disabled={isProcessingFollow}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                  {profile && user && user.uid === profile.userID ? (
                    <Button
                      className={classes.profile__header_button}
                      onClick={() => setIsEditingProfile(true)}
                      disabled={isEditingProfile}>
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
                        onClick={logout}>
                        Logout
                      </Button>
                    ) : (
                      <Button
                        className={classes.profile__header_button}
                        disabled>
                        Loading..
                      </Button>
                    ))}
                  {error && <p>{error}</p>}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}>
          {/* <SongItemSkeleton count={5} /> */}
          {profile && loadedSongs && loadedSongs.length && currentTab ? (
            <SongList
              songs={loadedSongs}
              scrollRef={scrollRef}
              user={user ? user : 'none'}
            />
          ) : (
            <SongItemSkeleton count={5} />
          )}
        </Grid>
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
