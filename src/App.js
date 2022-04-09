import styles from "./App.module.css";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
function App() {
  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles["sidebar-header"]}>
          <h1>Sound Garden</h1>
          <p className={styles["welcome-text"]}>Hi</p>
          <p className={styles.username}>
            First_name<br></br>Last_name
          </p>
        </div>
        <div className={styles.navigation}>
          <BrowserRouter>
            <div className={styles["navigation-main"]}>
              <h4>Menu</h4>
              <nav className={styles.navbar}>
                <NavLink to="/">
                  <img src="/img/Home_fill.svg" alt="Home button icon" />
                  <div>Home</div>
                </NavLink>
                <NavLink to="/genres">
                  <img src="/img/Mic_alt_duotone.svg" alt="Genre button icon" />
                  <div>Genres</div>
                </NavLink>
                <NavLink to="/artists">
                  <img
                    src="/img/User_duotone_line.svg"
                    alt="Artist button icon"
                  />
                  <div>Artists</div>
                </NavLink>
              </nav>
            </div>
            <div className={styles["navigation-library"]}>
              <h4>Library</h4>
              <nav className={styles.navbar}>
                <NavLink to="/liked">
                  <img
                    src="/img/favorite_duotone.svg"
                    alt="Artist button icon"
                  />
                  <div>Liked</div>
                </NavLink>
                <NavLink to="/uploaded">
                  <img
                    src="/img/Upload_duotone_line.svg"
                    alt="Artist button icon"
                  />
                  <div>Uploaded</div>
                </NavLink>
              </nav>
            </div>
            <Routes>
              <Route path="/" element={null}></Route>
              <Route path="/genres"></Route>
              <Route path="/artists"></Route>
              <Route path="/liked"></Route>
              <Route path="/uploaded"></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
      <div className={styles.page}>right</div>
    </div>
  );
}

export default App;
