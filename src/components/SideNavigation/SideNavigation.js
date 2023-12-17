import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import Grid from '@mui/material/Unstable_Grid2';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MicIcon from '@mui/icons-material/Mic';
import { ReactComponent as LogoIcon } from '../../images/logo.svg';
import { NavLink } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  sideNavigation: {
    display: 'flex',
    color: '#ffffff',
    zIndex: 1,
    minHeight: '98vh',
    width: '100%',

    [theme.breakpoints.down('lg')]: {
      marginTop: '3.2rem',
      textAlign: 'center',
    },
    position: 'relative !important',
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
    padding: '0.8rem',

    alignItems: 'center',
    zIndex: 1,
    [theme.breakpoints.down('lg')]: {
      marginTop: '1.6rem',
    },
  },
  sideNavigationImageContainer: {
    display: 'flex',
    maxWidth: '160px',
    maxHeight: '160px',
    borderRadius: '12px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '60px',
      height: '60px',
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: '120px',
      height: '120px',
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
    alignItems: 'center',
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
    display: 'inline-flex',
    color: '#fff',
    fontWeight: '400',
    lineHeight: '24px',
    textDecoration: 'none',
    fontSize: theme.typography.h3.fontSize,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.8rem',
    width: '100%',

    '&:hover': {
      background: theme.palette.primary.main,
      opacity: 0.6,
    },
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'start',
      alignItems: 'center',
      padding: '1.6rem 0 1.6rem 4.8rem',
    },
  },
  sideNavigationAudioplayerContainer: {
    paddingLeft: '1.6rem',
    marginTop: '3.2rem',
    [theme.breakpoints.down('md')]: {
      marginBottom: '6.4rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'end',
      paddingLeft: '0',
    },
  },
}));

const SideNavigation = ({
  className,
  setDrawerOpen = null,
  drawerOpen = null,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const handleCloseDrawer = () => {
    if (setDrawerOpen) {
      setDrawerOpen(false);
    }
  };

  return (
    <Grid
      sx={{
        display: drawerOpen === true || drawerOpen === null ? 'flex' : 'none',
        position: 'relative',
        zIndex: '2000',
      }}
      container
      alignItems="center"
      className={`${classes.sideNavigation} ${className}`}>
      <Grid className={classes.sideNavigationHeader}>
        <div className={classes.sideNavigationImageContainer}>
          <LogoIcon className={classes.sideNavigationImage} />
        </div>
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
            }
            onClick={handleCloseDrawer}>
            <Box className={classes.navbarItemContent}>
              <HomeIcon fontSize="medium" />{' '}
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
            }
            onClick={handleCloseDrawer}>
            <Box className={classes.navbarItemContent}>
              <MicIcon fontSize="medium" />

              <Box className={classes.navbarItemContentText}>Genres</Box>
            </Box>
          </NavLink>
          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              isActive
                ? `
  ${classes.navLink}
  ${classes.navbarActiveItem}
`
                : ` ${classes.navLink}`
            }
            onClick={handleCloseDrawer}>
            <Box className={classes.navbarItemContent}>
              <LibraryMusicIcon fontSize="medium" />{' '}
              <Box className={classes.navbarItemContentText}>Playlists</Box>
            </Box>
          </NavLink>
        </Stack>
      </Grid>

      <Grid
        alignSelf="end"
        width="100%">
        <Box sx={{ height: { xs: '360px', md: '400px', lg: '300px' } }} />
        <Box className={classes.sideNavigationAudioplayerContainer}>
          <AudioPlayer />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SideNavigation;
