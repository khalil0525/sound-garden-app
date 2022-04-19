import styles from "./App.module.css";
import Home from "./pages/Home/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
} from "react-router-dom";
import Genres from "./pages/Genres/Genres";
import Artists from "./pages/Artists/Artists";
import Liked from "./pages/Liked/Liked";
import Uploaded from "./pages/Uploaded/Uploaded";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useAuthContext } from "./hooks/useAuthContext";
import { useLogout } from "./hooks/useLogout";

function App() {
  // Getting the context of the user to see if they're logged in
  const { user, authIsReady } = useAuthContext();
  const { logout, error, isPending } = useLogout();

  return (
    <div className={styles.app}>
      {/* Here we are conditionally rendering our app based on authIsReady
      this ensures that we check if the user is authenticated or not
      before loading the app */}
      {authIsReady && (
        <BrowserRouter>
          <div className={styles.sidebar}>
            <div className={styles["sidebar-header"]}>
              {/* <h1>Sound Garden</h1> */}
              <img src="/img/soundgarden.jpg" alt="Soundgarden logo"></img>

              {/* Conditionally render the users displayName */}
              {user && (
                <>
                  <p className={styles["welcome-text"]}>Hi,</p>
                  <p className={styles.username}>{user.displayName}</p>
                </>
              )}
            </div>

            <div className={styles.navigation}>
              <div className={styles["navigation-main"]}>
                <h4>Menu</h4>
                <nav className={styles.navbar}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? styles["active-nav-item"] : undefined
                    }
                  >
                    <img src="/img/Home_fill.svg" alt="Home button icon" />
                    <div>Home</div>
                  </NavLink>
                  <NavLink
                    to="/genres"
                    className={({ isActive }) =>
                      isActive ? styles["active-nav-item"] : undefined
                    }
                  >
                    <img
                      src="/img/Mic_alt_duotone.svg"
                      alt="Genre button icon"
                    />
                    <div>Genres</div>
                  </NavLink>
                  <NavLink
                    to="/artists"
                    className={({ isActive }) =>
                      isActive ? styles["active-nav-item"] : undefined
                    }
                  >
                    <img
                      src="/img/User_duotone_line.svg"
                      alt="Artist button icon"
                    />
                    <div>Artists</div>
                  </NavLink>
                  {!user && (
                    <>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive ? styles["active-nav-item"] : undefined
                        }
                      >
                        <div>Login temp</div>
                      </NavLink>
                      <NavLink
                        to="/register"
                        className={({ isActive }) =>
                          isActive ? styles["active-nav-item"] : undefined
                        }
                      >
                        <div>Register temp</div>
                      </NavLink>
                    </>
                  )}

                  {/* Logout button temp */}
                  {user && !isPending && (
                    <button onClick={logout}>Logout</button>
                  )}
                  {user && isPending && <button disabled>Loading..</button>}
                  {user && error && <p>{error}</p>}
                </nav>
              </div>

              {/* CONDITIONAL CONTENT, SHOW ONLY IF USER LOGGED IN */}
              <div className={styles["navigation-library"]}>
                {user && (
                  <>
                    <h4>Library</h4>
                    <nav className={styles.navbar}>
                      <NavLink
                        to="/liked"
                        className={({ isActive }) =>
                          isActive ? styles["active-nav-item"] : undefined
                        }
                      >
                        <img
                          src="/img/favorite_duotone.svg"
                          alt="Artist button icon"
                        />
                        <div>Liked</div>
                      </NavLink>
                      <NavLink
                        to="/uploaded"
                        className={({ isActive }) =>
                          isActive ? styles["active-nav-item"] : undefined
                        }
                      >
                        <img
                          src="/img/Upload_duotone_line.svg"
                          alt="Artist button icon"
                        />
                        <div>Uploaded</div>
                      </NavLink>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Within this div we will render different pages */}
          <div className={styles.page}>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/genres" element={<Genres />}></Route>
              <Route path="/artists" element={<Artists />}></Route>
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
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
