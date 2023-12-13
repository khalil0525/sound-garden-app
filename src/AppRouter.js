import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Home from './views/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Genres from './views/Genres/Genres';

import Profile from './views/Profile/Profile';
import SideNavigation from './components/SideNavigation/SideNavigation';
import Upload from './views/Upload/Upload';

import CloseIcon from '@mui/icons-material/Close';

import 'simplebar/dist/simplebar.min.css';
import CollectionResults from './components/CollectionResults/CollectionResults';
import { useMediaQuery, IconButton, Drawer } from '@mui/material';

import Layout from './components/Layout/Layout';
import MenuIcon from '@mui/icons-material/Menu';
import Song from './views/Song/Song';
import Playlists from './views/Playlists/Playlists';
import Playlist from './views/Playlist/Playlist';
function AppRouter({ user }) {
  const isMobile = useMediaQuery('(max-width: 1200px)');

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <BrowserRouter>
      <Grid
        container
        sx={{
          flexGrow: 0,
          backgroundColor: '#000',
          height: '100vh !important',
          padding: {
            xs: '0',
            lg: '1.6rem 1.6rem 1.6rem 0',
          },
        }}>
        <>
          {' '}
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={toggleDrawer}
                sx={{
                  display: { xs: 'block', md: 'block', lg: 'none' },
                  zIndex: 1200,
                }}>
                {drawerOpen ? <CloseIcon /> : <MenuIcon fontSize="large" />}
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                PaperProps={{
                  sx: {
                    backgroundColor: '#000',
                    width: '100%',
                  },
                }}>
                <IconButton
                  color="inherit"
                  onClick={toggleDrawer}
                  sx={{
                    position: 'absolute',
                    top: '1.6rem',
                    right: '1.6rem',
                    zIndex: 1201,
                  }}>
                  <CloseIcon fontSize="large" />
                </IconButton>

                {/* Content of the drawer */}
              </Drawer>
            </>
          )}
          <SideNavigation
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        </>

        {!isMobile && (
          <Grid
            xs={isMobile ? 12 : 2}
            md={2}
            lg={2.5}
            xl={2}
            bgcolor="secondary"
            p="3.2rem 1.6rem 1.6rem 0">
            <SideNavigation />
          </Grid>
        )}

        <>
          <Grid
            p={{ xs: '0', sm: '0', md: '1.6rem 1.6rem 1.6rem 0' }}
            bgcolor={'white'}
            md={12}
            lg={9.5}
            xl={10}
            borderRadius={{
              xs: '0',
              lg: '3.4rem',
            }}
            sx={{
              overflowX: 'hidden',

              maxHeight: '100% !important',
              overflowY: 'auto',

              '::-webkit-scrollbar': {
                width: '8px',
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '5px',
                backgroundClip: 'padding-box',
              },
              '::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
                marginTop: '1.6rem !important',
                marginBottom: '1.6rem !important',
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
        </>
      </Grid>
    </BrowserRouter>
  );
}

export default AppRouter;
