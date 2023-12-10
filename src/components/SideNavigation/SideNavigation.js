import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Unstable_Grid2';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

import { useTheme } from '@mui/material/styles';
import { ReactComponent as HomeIcon } from '../../images/Home_fill.svg';
import { ReactComponent as ArtistIcon } from '../../images/User_duotone_line.svg';
import { ReactComponent as GenreIcon } from '../../images/Mic_alt_duotone.svg';
import { ReactComponent as LogoIcon } from '../../images/logo.svg';
import { NavLink } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';
import theme from '../../theme';

const useStyles = makeStyles((theme) => ({
  sideNavigation: {
    display: 'flex',
    color: '#ffffff',
    zIndex: 1,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      textAlign: 'center',
    },
    position: 'relative',
  },
  logoIcon: {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  sideNavigationHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '100%',
    padding: '1.6rem 0 0 3.2rem !important',
    [theme.breakpoints.down('sm')]: {
      padding: '0.8rem 0 0 0.8rem !important',
    },
  },
  sideNavigationImageContainer: {
    display: 'flex',
    maxWidth: '220px',
    maxHeight: '220px',
    borderRadius: '12px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '60px',
      height: '60px',
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
    width: '100%',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
  sideNavigationNavbar: {
    display: 'flex',
    gap: '6px',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  sideNavigationNavbarTitle: {
    display: 'none',
  },
  navbarItemContent: {
    display: 'flex',
    gap: '1.6rem',
  },
  navbarItemContentIcon: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  navbarItemContentText: {},
  navbarActiveItem: {
    color: '#fff',

    background: `linear-gradient(
      90deg,
      ${theme.palette.primary.main} -55%,
      rgba(253, 99, 44, 0) 100%
    )`,
    boxShadow: `inset 4px 0 0 ${theme.palette.primary.main}`,
  },
  navLink: {
    color: '#fff',
    fontWeight: '400',
    lineHeight: '24px',
    textDecoration: 'none',
    fontSize: theme.typography.h3.fontSize,
    padding: '1.6rem 0 1.6rem 4.8rem',
    '&:hover': {
      background: theme.palette.primary.main,
      opacity: 0.6,
    },
    [theme.breakpoints.down('lg')]: {
      padding: '0.4rem 1.6rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  sideNavigationAudioplayerContainer: {
    paddingLeft: '1.6rem',
    [theme.breakpoints.down('md')]: {
      marginBottom: '6.4rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      paddingLeft: '0',
    },
  },
}));

const SideNavigation = ({ className, drawerOpen = null }) => {
  const classes = useStyles(theme);

  return (
    <Grid
      sx={{
        display: drawerOpen === true || drawerOpen === null ? 'flex' : 'none',
        position: 'relative',
        zIndex: '9999',
      }}
      container
      className={`${classes.sideNavigation} ${className}`}>
      <Grid className={classes.sideNavigationHeader}>
        <Box className={classes.sideNavigationImageContainer}>
          <LogoIcon className={classes.sideNavigationImage} />
        </Box>
      </Grid>
      <Grid className={classes.sideNavigationNavContainer}>
        <Stack className={classes.sideNavigationNavbar}>
          <Typography
            variant="h3"
            className={classes.sideNavigationNavbarTitle}>
            Menu
          </Typography>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `
          ${classes.navLink}
          ${classes.navbarActiveItem}
        `
                : ` ${classes.navLink}`
            }>
            <Box className={classes.navbarItemContent}>
              <HomeIcon className={classes.navbarItemContentIcon} />
              <Box className={classes.navbarItemContentText}>Home</Box>
            </Box>
          </NavLink>
          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive
                ? `
            ${classes.navLink}
            ${classes.navbarActiveItem}
          `
                : ` ${classes.navLink}`
            }>
            <Box className={classes.navbarItemContent}>
              <GenreIcon className={classes.navbarItemContentIcon} />
              <Box className={classes.navbarItemContentText}>Genres</Box>
            </Box>
          </NavLink>
          <NavLink
            onClick={(e) => e.preventDefault()}
            to="/artists"
            className={({ isActive }) =>
              isActive
                ? `
          ${classes.navLink}
          ${classes.navbarActiveItem}
        `
                : ` ${classes.navLink}`
            }>
            <Box className={classes.navbarItemContent}>
              <ArtistIcon className={classes.navbarItemContentIcon} />
              <Box className={classes.navbarItemContentText}>Artists</Box>
            </Box>
          </NavLink>
        </Stack>
      </Grid>

      <Grid
        alignSelf="end"
        width="100%">
        <div style={{ height: '400px' }} />
        <Box className={classes.sideNavigationAudioplayerContainer}>
          <AudioPlayer />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SideNavigation;
