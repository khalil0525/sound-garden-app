import styles from "./App.module.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import Genres from "./pages/Genres";
import Artists from "./pages/Artists";
import Liked from "./pages/Liked";
import Uploaded from "./pages/Uploaded";

import Login from "./pages/Login";
function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <div className={styles.sidebar}>
          <div className={styles["sidebar-header"]}>
            <h1>Sound Garden</h1>
            <p className={styles["welcome-text"]}>Hi</p>
            <p className={styles.username}>
              First_name<br></br>Last_name
            </p>
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
                  <img src="/img/Mic_alt_duotone.svg" alt="Genre button icon" />
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
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? styles["active-nav-item"] : undefined
                  }
                >
                  <div>Login Temp</div>
                </NavLink>
              </nav>
            </div>

            <div className={styles["navigation-library"]}>
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
            </div>
          </div>
        </div>

        <div className={styles.page}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/genres" element={<Genres />}></Route>
            <Route path="/artists" element={<Artists />}></Route>
            <Route path="/liked" element={<Liked />}></Route>
            <Route path="/uploaded" element={<Uploaded />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
