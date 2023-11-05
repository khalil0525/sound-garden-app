import React from 'react';
import styles from './styles/App.module.css';
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

function AppRouter({ user }) {
  // Getting the context of the user to see if they're logged in

  const scrollableNodeRef = React.createRef();

  return (
    <BrowserRouter>
      <SideNavigation className={styles.sideNavigation} />

      <div className={styles.page}>
        <SimpleBar
          autoHide={false}
          scrollableNodeProps={{ ref: scrollableNodeRef }}
          style={{
            overflowX: 'hidden',
            height: '95vh',
            paddingTop: '20px',
          }}>
          <Routes>
            <Route
              path="/"
              element={<Home scrollRef={scrollableNodeRef} />}
            />
            <Route
              path="/genres"
              element={<Genres />}
            />
            <Route
              path="/genres/:type"
              element={<CollectionResults scrollRef={scrollableNodeRef} />}
            />
            <Route
              path="/artists"
              element={<Artists />}></Route>
            <Route
              path="/artists/:letter"
              element={<CollectionResults scrollRef={scrollableNodeRef} />}
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
              element={<CollectionResults scrollRef={scrollableNodeRef} />}
            />
            <Route
              path="/upload"
              element={user ? <Upload /> : <Navigate to="/" />}
            />
          </Routes>
        </SimpleBar>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
