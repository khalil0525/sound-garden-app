import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Modal from '../../components/UI/Modal/Modal';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {
  Edit as EditIcon,
  ExitToApp as ExitToAppIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

import { Hidden, Typography } from '@mui/material';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import {
  followUser,
  getSongs,
  getUserProfile,
  unfollowUser,
} from '../../api/functions';

import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import Popover from '@mui/material/Popover';

import SongItemSkeleton from '../../components/UI/Skeletons/SongItemSkeleton';
// const tabs = ['Tracks', 'Playlists', 'Reposted', 'Likes'];
const tabs = ['Tracks', 'Likes'];
//2480 x 520 (1240 x 260 res)
const useStyles = makeStyles((theme) => ({
  profile__content: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
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
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
    },
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
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: '8rem',
      height: '8rem',
    },
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
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  profileHeaderTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      marginTop: '1.6rem',
    },
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
    [theme.breakpoints.down('md')]: {
      display: 'none',
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
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
      gap: '0.8rem',
    },
  },
  profile__statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem',
    marginTop: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },

  profile__statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.6rem',
    justifyContent: 'space-between',
    color: '#000',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      textAlign: 'center',
      gap: '0.4rem',
    },
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

  const [loadedSongs, setLoadedSongs] = useState([]);
  const [isProcessingFollow, setIsProcessingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);

  const [query, setQuery] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const URL = params.profileURL;
  const randomBannerPlaceholder = 'https://source.unsplash.com/random/2480x520';

  const handleEditProfile = (songId) => {
    setIsEditingProfile(false);
  };

  const handleNewQuery = (index) => {
    setCurrentTab(index);
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

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, [URL, user, isEditingProfile]);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsProcessingFollow(true);
      try {
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

  useEffect(() => {
    if (profile !== null) {
      console.log(profile);
      setQuery(
        currentTab === 0 && profile && profile.userID
          ? ['music', ['userID', '==', profile.userID]]
          : ['music', ['likes', 'array-contains', profile.userID]]
      );
      setResetQueryTrigger((prev) => !prev);
    }
  }, [currentTab, profile]);
  console.log(query);
  return (
    <>
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
            </Grid>{' '}
            <Grid
              item
              xs={12}>
              <Box className={classes.profile__statsContainer}>
                <Box className={classes.profile__statItem}>
                  <PersonIcon fontSize="large" />
                  <Typography variant="h3">
                    {profile !== null && profile?.followers?.length ? (
                      profile.followers.length
                    ) : profile !== null ? (
                      0
                    ) : (
                      <Skeleton width={30} />
                    )}
                    <Hidden mdDown>&nbsp;Followers</Hidden>
                  </Typography>
                </Box>
                <Box className={classes.profile__statItem}>
                  <PeopleIcon fontSize="large" />
                  <Typography variant="h3">
                    {profile !== null &&
                    profile?.following?.length !== undefined ? (
                      profile.following.length
                    ) : profile !== null ? (
                      0
                    ) : (
                      <Skeleton width={30} />
                    )}
                    <Hidden mdDown>&nbsp;Following</Hidden>
                  </Typography>
                </Box>
                <Box className={classes.profile__statItem}>
                  <MusicNoteIcon fontSize="large" />
                  <Typography variant="h3">
                    {loadedSongs !== null &&
                    loadedSongs?.length !== undefined ? (
                      loadedSongs.length
                    ) : loadedSongs !== null ? (
                      0
                    ) : (
                      <Skeleton width={30} />
                    )}
                    <Hidden mdDown>&nbsp;Tracks</Hidden>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Box
              item
              xs={12}
              sx={{ display: 'flex' }}
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
                <Grid
                  spacing={2}
                  justifyContent="flex-end">
                  {profile && user && user.uid !== profile.userID && (
                    <Tooltip title={isFollowing ? 'Following' : 'Follow'}>
                      <IconButton
                        className={classes.profile__header_button_follow}
                        onClick={handleFollowClick}
                        disabled={isProcessingFollow}
                        color="black">
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {profile && user && user.uid === profile.userID ? (
                    <Tooltip title="Edit Profile">
                      <IconButton
                        className={classes.profile__header_button}
                        onClick={() => setIsEditingProfile(true)}
                        disabled={isEditingProfile}>
                        <EditIcon htmlColor="black" />
                      </IconButton>
                    </Tooltip>
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
                  !isPending ? (
                    <Tooltip title="Logout">
                      <IconButton
                        className={classes.profile__header_button}
                        onClick={logout}>
                        <ExitToAppIcon htmlColor="red" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      className={classes.profile__header_button}
                      disabled>
                      {isPending ? 'Loading..' : null}
                    </Button>
                  )}

                  {error && <p>{error}</p>}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}>
          {profile && query ? (
            <CollectionResults
              scrollRef={scrollRef}
              query={query}
              resetQueryTrigger={resetQueryTrigger}
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
    </>
  );
}
