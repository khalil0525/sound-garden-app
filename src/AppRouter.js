import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Home from './views/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Genres from './views/Genres/Genres';
import { makeStyles, useTheme } from '@mui/styles';
import Profile from './views/Profile/Profile';
import SideNavigation from './components/SideNavigation/SideNavigation';
import Upload from './views/Upload/Upload';

import CloseIcon from '@mui/icons-material/Close';

import 'simplebar/dist/simplebar.min.css';
import CollectionResults from './components/CollectionResults/CollectionResults';
import { useMediaQuery, IconButton, Drawer } from '@mui/material';
import { AppBar } from '@mui/material';
import Layout from './components/Layout/Layout';
import MenuIcon from '@mui/icons-material/Menu';
import Song from './views/Song/Song';
import Playlists from './views/Playlists/Playlists';
import Playlist from './views/Playlist/Playlist';
import { ReactComponent as LogoIcon } from './images/logo.svg';
const useStyles = makeStyles((theme) => ({
  sideNavigationHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',

    padding: '0.8rem',

    alignItems: 'center',
    zIndex: 1,
  },
  sideNavigationImageContainer: {
    display: 'flex',
    maxWidth: '30px',
    height: '30px',
    borderRadius: '12px',
  },
  sideNavigationImage: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
  },

  sideNavigationNavContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
}));
function AppRouter({ user }) {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const theme = useTheme();
  const classes = useStyles(theme);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    console.log('ee');
    setDrawerOpen(!drawerOpen);
  };
  useEffect(() => {
    if (drawerOpen && !isMobile) {
      setDrawerOpen(false);
      console.log('here');
    }
  }, [isMobile, drawerOpen]);

  return (
    <BrowserRouter>
      <Grid
        container
        sx={{
          flexShrink: 0,
          backgroundColor: '#000',
        }}>
        <>
          {isMobile && (
            <>
              <AppBar
                position="fixed"
                sx={{
                  zIndex: 3000,
                  background: '#000',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <IconButton
                  color="inherit"
                  onClick={toggleDrawer}
                  sx={{
                    display: { xs: 'block', md: 'block', lg: 'none' },
                    zIndex: 3000,
                    position: 'relative',
                  }}>
                  {drawerOpen ? <CloseIcon /> : <MenuIcon fontSize="large" />}
                </IconButton>
                <div className={classes.sideNavigationHeader}>
                  <div className={classes.sideNavigationImageContainer}>
                    <LogoIcon className={classes.sideNavigationImage} />
                  </div>
                </div>
              </AppBar>
              <Drawer
                elevation={0}
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{ zIndex: 1000 }}
                PaperProps={{
                  sx: {
                    backgroundColor: '#000',
                    width: '100%',
                    height: '100%',
                    zIndex: 1000,
                  },
                }}>
                <IconButton
                  color="inherit"
                  onClick={toggleDrawer}
                  sx={{
                    display: {
                      xs: 'block',
                      md: 'block',
                      lg: 'none',
                    },
                    width: '6.4rem',
                    height: '6.4rem',
                    zIndex: '9999 !important',
                    position: 'fixed',
                  }}>
                  <CloseIcon fontSize="large" />
                </IconButton>
              </Drawer>{' '}
              <SideNavigation
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
            </>
          )}
        </>

        {!isMobile && (
          <Grid
            xs={isMobile ? 12 : 2}
            md={2}
            lg={2.5}
            xl={2}
            bgcolor="secondary"
            p="0 1.6rem 1.6rem 0">
            <SideNavigation />
          </Grid>
        )}

        <Grid
          md={12}
          lg={9.5}
          xl={10}
          sx={{
            maxHeight: { xs: '100%', md: '100vh' },
            padding: {
              xs: '0',
              lg: '1.6rem 1.6rem 1.6rem 0',
            },
          }}>
          <Layout user={user}>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/genres"
                element={<Genres />}
              />
              <Route
                path="/genres/:type"
                element={<CollectionResults />}
              />
              <Route
                path="/playlists"
                element={<Playlists />}
              />{' '}
              <Route
                path="/playlist/:playlistId"
                element={<Playlist />}
              />
              <Route
                path="*"
                element={<Home />}
              />
              <Route
                path="/profile/:profileURL"
                element={<Profile />}
              />{' '}
              <Route
                path="/song/:songId"
                element={<Song />}
              />
              <Route
                path="/search"
                element={<CollectionResults />}
              />
              <Route
                path="/upload"
                element={user ? <Upload /> : <Navigate to="/" />}
              />
            </Routes>
          </Layout>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default AppRouter;
