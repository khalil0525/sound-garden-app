import React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Home from './views/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Genres from './views/Genres/Genres';
import Artists from './views/Artists/Artists';
import Liked from './views/Liked/Liked';
import Uploaded from './views/Uploaded/Uploaded';
import Profile from './views/Profile/Profile';
import SideNavigation from './components/SideNavigation/SideNavigation';
import Upload from './views/Upload/Upload';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import CollectionResults from './components/CollectionResults/CollectionResults';
import { Container, Box } from '@mui/material';
import { useTheme } from '@mui/styles';
import Layout from './components/Layout/Layout';

function AppRouter({ user }) {
  // Getting the context of the user to see if they're logged in

  const scrollableNodeRef = React.createRef();

  return (
    <BrowserRouter>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#000',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}>
        <Grid
          container
          sx={{ maxWidth: '100vw', maxHeight: '100vh' }}>
          <Grid
            xs={2}
            md={'20%'}
            bgcolor="secondary"
            p="3.2rem 1.6rem 1.6rem 0">
            <SideNavigation />
          </Grid>

          <Grid
            xs={10}
            md={'80%'}
            p="1.6rem 1.6rem 1.6rem 0">
            <Box
              bgcolor={'white'}
              maxHeight="100%"
              borderRadius="1.6rem">
              <SimpleBar
                autoHide={false}
                scrollableNodeProps={{ ref: scrollableNodeRef }}
                style={{
                  overflowX: 'hidden',
                  height: '95vh',
                  padding: '1.6rem',
                }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Layout>
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
                    path="/liked"
                    element={
                      user ? (
                        <Liked scrollRef={scrollableNodeRef} />
                      ) : (
                        <Navigate to="/" />
                      )
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
              </SimpleBar>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </BrowserRouter>
  );
}

export default AppRouter;
