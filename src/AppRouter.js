import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Home from './views/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Genres from './views/Genres/Genres';
import Artists from './views/Artists/Artists';

import Uploaded from './views/Uploaded/Uploaded';
import Profile from './views/Profile/Profile';
import SideNavigation from './components/SideNavigation/SideNavigation';
import Upload from './views/Upload/Upload';

import CloseIcon from '@mui/icons-material/Close';

import 'simplebar/dist/simplebar.min.css';
import CollectionResults from './components/CollectionResults/CollectionResults';
import { Box, useMediaQuery, IconButton, Drawer } from '@mui/material';
import { useTheme } from '@mui/styles';
import Layout from './components/Layout/Layout';
import MenuIcon from '@mui/icons-material/Menu';

function AppRouter({ user }) {
  const theme = useTheme();
  const scrollableNodeRef = React.createRef();
  const isMobile = useMediaQuery('(max-width: 1026px)');
  const isSingleColumn = useMediaQuery('(max-width: 1200px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <BrowserRouter>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#000',
          width: '100vw',
          maxHeight: '100vh',
        }}>
        <Grid
          container
          sx={{ width: '100vw', maxHeight: '100vh' }}>
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={toggleDrawer}
                sx={{ display: { xs: 'block', md: 'none' }, zIndex: 1200 }}>
                {drawerOpen ? <CloseIcon /> : <MenuIcon fontSize="large" />}
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                PaperProps={{
                  sx: {
                    backgroundColor: '#000',
                    width: '80%', // Adjust the width as needed
                  },
                }}>
                <SideNavigation />
              </Drawer>
            </>
          )}
          {!isMobile && (
            <Grid
              xs={isMobile ? 12 : 2}
              md={'20%'}
              bgcolor="secondary"
              p="3.2rem 1.6rem 1.6rem 0">
              <SideNavigation />
            </Grid>
          )}

          <Grid
            xs={isMobile ? 12 : 10}
            md={'80%'}
            p={{ xs: '0', md: '1.6rem 1.6rem 1.6rem 0' }}>
            <Box
              bgcolor={'white'}
              maxHeight="100%"
              borderRadius={{ xs: '0', md: '3.4rem' }}
              sx={{ overflowY: 'scroll' }}>
              <Box
                ref={scrollableNodeRef}
                sx={{
                  overflowX: 'hidden',
                  height: '95vh',
                  padding: '1.6rem',

                  '::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '5px',
                  },
                  '::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Layout user={user}>
                        <Home scrollRef={scrollableNodeRef} />
                      </Layout>
                    }
                  />
                  <Route
                    path="/genres"
                    element={<Genres />}
                  />
                  <Route
                    path="/genres/:type"
                    element={
                      <CollectionResults scrollRef={scrollableNodeRef} />
                    }
                  />
                  <Route
                    path="/artists"
                    element={<Artists />}></Route>
                  <Route
                    path="/artists/:letter"
                    element={
                      <CollectionResults scrollRef={scrollableNodeRef} />
                    }
                  />

                  <Route
                    path="/uploaded"
                    element={
                      user ? (
                        <Uploaded scrollRef={scrollableNodeRef} />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                  <Route
                    path="*"
                    element={<Home scrollRef={scrollableNodeRef} />}
                  />
                  <Route
                    path="/profile/:profileURL"
                    element={<Profile scrollRef={scrollableNodeRef} />}
                  />
                  <Route
                    path="/search"
                    element={
                      <CollectionResults scrollRef={scrollableNodeRef} />
                    }
                  />
                  <Route
                    path="/upload"
                    element={user ? <Upload /> : <Navigate to="/" />}
                  />
                </Routes>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </BrowserRouter>
  );
}

export default AppRouter;
