import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Unstable_Grid2';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import soundGardenLogo from '../../images/sg-logo.png';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as LikedIcon } from '../../images/Favorite_duotone.svg';
import { ReactComponent as HomeIcon } from '../../images/Home_fill.svg';
import { ReactComponent as ArtistIcon } from '../../images/User_duotone_line.svg';
import { ReactComponent as GenreIcon } from '../../images/Mic_alt_duotone.svg';
import { ReactComponent as UploadedIcon } from '../../images/Upload_duotone_line.svg';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Box, Stack, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  sideNavigation: {
    display: 'flex',

    color: '#ffffff',

    zIndex: 1,
    height: '100%',
    width: '100%',
    padding: '1.6rem',

    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center',
    },
  },
  sideNavigationHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
    padding: theme.spacing(2, 0, 0, 4),
    [theme.breakpoints.up('lg')]: {
      gap: theme.spacing(2),
      padding: theme.spacing(0, 4, 4, 1),
    },
  },
  sideNavigationImageContainer: {
    display: 'flex',
    maxWidth: '14rem',
    maxHeight: '14rem',

    borderRadius: '1.2rem',

    [theme.breakpoints.down('lg')]: {
      maxWidth: '6rem',
      height: '6rem',
    },
  },
  sideNavigationImage: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
  },
  sideNavigationGreeting: {
    display: 'block',
    fontSize: theme.typography.h3.fontSize,
  },
  sideNavigationArtistNameText: {
    fontSize: theme.typography.h1.fontSize,
  },
  sideNavigationNavContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    },
  },
  sideNavigationNavbar: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    // background: '#161618',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  sideNavigationNavbarTitle: {
    display: 'none',
  },
  navbarItemContent: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  navbarItemContentIcon: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  navbarItemContentText: {},
  navbarActiveItem: {
    color: '#fff',
  },
  navLink: {
    color: '#fff',
    fontWeight: '400',
    lineHeight: '24px',
    textDecoration: 'none',
    padding: '10px 32px 10px 32px',
    '&:hover': {
      background: 'red',
      opacity: 0.6,
    },
  },
}));

const SideNavigation = ({ className }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={`${classes.sideNavigation} ${className}`}>
      <Grid
        item
        className={classes.sideNavigationHeader}>
        <Box className={classes.sideNavigationImageContainer}>
          <img
            src={soundGardenLogo}
            alt="Soundgarden logo"
            className={classes.sideNavigationImage}
          />
        </Box>
      </Grid>
      <Grid
        item
        className={classes.sideNavigationNavContainer}>
        <Stack className={classes.sideNavigationNavbar}>
          <Typography
            variant="h4"
            className={classes.sideNavigationNavbarTitle}>
            Menu
          </Typography>
          <NavLink
            to="/"
            className={`
              ${classes.navLink}
              ${null ? classes.navbarActiveItem : ''}
            `}>
            <Box className={classes.navbarItemContent}>
              <HomeIcon
                className={classes.navbarItemContentIcon}
                alt="Home button icon"
              />
              <Box className={classes.navbarItemContentText}>Home</Box>
            </Box>
          </NavLink>
          <NavLink
            to="/genres"
            className={`
            ${classes.navLink}
            ${null ? classes.navbarActiveItem : ''}
          `}>
            <Box className={classes.navbarItemContent}>
              <GenreIcon
                className={classes.navbarItemContentIcon}
                alt="Genre button icon"
              />
              <Box className={classes.navbarItemContentText}>Genres</Box>
            </Box>
          </NavLink>
          <NavLink
            onClick={(e) => e.preventDefault()}
            to="/artists"
            className={`
            ${classes.navLink}
            ${null ? classes.navbarActiveItem : ''}
          `}>
            <Box className={classes.navbarItemContent}>
              <ArtistIcon
                className={classes.navbarItemContentIcon}
                alt="Artist button icon"
              />
              <Box className={classes.navbarItemContentText}>Artists</Box>
            </Box>
          </NavLink>
        </Stack>
      </Grid>

      <Grid
        item
        alignSelf="end">
        <Box className={classes.sideNavigationAudioplayerContainer}>
          <AudioPlayer />
        </Box>
      </Grid>
    </Grid>
  );
};
export default SideNavigation;
