import styles from "./App.module.css";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Genres from "./pages/Genres/Genres";
import Artists from "./pages/Artists/Artists";
import Liked from "./pages/Liked/Liked";
import Uploaded from "./pages/Uploaded/Uploaded";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SideNavigation from "./components/SideNavigation/SideNavigation";
import { useAuthContext } from "./hooks/useAuthContext";
import Upload from "./pages/Upload/Upload";
import Search from "./pages/Search/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import CardResults from "./pages/CardResults/CardResults";

function App() {
  // Getting the context of the user to see if they're logged in
  const { user, authIsReady } = useAuthContext();

  return (
    <div className={styles.app}>
      {/* Here we are conditionally rendering our app based on authIsReady
      this ensures that we check if the user is authenticated or not
      before loading the app */}
      {authIsReady && (
        <BrowserRouter>
          {/* We pass the styles.sidebar class down to the SideNavigation
        function so that we can still use CSS grid from the app class */}
          <SideNavigation />
          {/* Within this div we will render different pages */}

          <div className={styles.page}>
            <SimpleBar
              autoHide={false}
              style={{ overflowX: "hidden", height: "91vh", top: "2rem" }}
            >
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/genres" element={<Genres />}></Route>
                <Route path="/genres/:type" element={<CardResults />}></Route>
                <Route path="/artists" element={<Artists />}></Route>
                <Route path="/artists/:id" element={<CardResults />}></Route>
                <Route
                  path="/liked"
                  element={user ? <Liked /> : <Navigate to="/" />}
                ></Route>
                <Route
                  path="/uploaded"
                  element={user ? <Uploaded /> : <Navigate to="/" />}
                ></Route>
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/" />}
                ></Route>
                <Route
                  path="/profile"
                  element={user ? <Profile /> : <Navigate to="/login" />}
                ></Route>
                <Route path="/search" element={<Search />}></Route>
                <Route
                  path="/upload"
                  element={user ? <Upload /> : <Navigate to="/login" />}
                ></Route>
                <Route
                  path="/register"
                  element={!user ? <Register /> : <Navigate to="/" />}
                ></Route>
              </Routes>
            </SimpleBar>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
