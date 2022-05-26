import React, { useEffect } from "react";
import styles from "./App.module.css";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Genres from "./pages/Genres/Genres";
import Artists from "./pages/Artists/Artists";
import Liked from "./pages/Liked/Liked";
import Uploaded from "./pages/Uploaded/Uploaded";
import Profile from "./pages/Profile/Profile";
import SideNavigation from "./components/SideNavigation/SideNavigation";
import { useAuthContext } from "./hooks/useAuthContext";
import Upload from "./pages/Upload/Upload";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import CollectionResults from "./components/CollectionResults/CollectionResults";

function App() {
  // Getting the context of the user to see if they're logged in
  const { user, authIsReady } = useAuthContext();

  const scrollableNodeRef = React.createRef();
  useEffect(() => {});
  return (
    <div className={styles.app}>
      {/* Here we are conditionally rendering our app based on authIsReady
      this ensures that we check if the user is authenticated or not
      before loading the app */}
      {authIsReady && (
        <BrowserRouter>
          {/* We pass the styles.sidebar class down to the SideNavigation
        function so that we can still use CSS grid from the app class */}
          <SideNavigation className={styles.sideNavigation} />
          {/* Within this div we will render different pages */}

          <div className={styles.page}>
            <SimpleBar
              autoHide={false}
              scrollableNodeProps={{ ref: scrollableNodeRef }}
              style={{ overflowX: "hidden", height: "91vh", top: "2rem" }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/genres" element={<Genres />} />
                <Route
                  path="/genres/:type"
                  element={<CollectionResults scrollRef={scrollableNodeRef} />}
                />
                <Route path="/artists" element={<Artists />}></Route>
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
                <Route path="*" element={<Home />} />
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
      )}
    </div>
  );
}

export default App;
