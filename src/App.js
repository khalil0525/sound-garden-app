import styles from "./App.module.css";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
function App() {
  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.navigation}>
          <BrowserRouter>
            <div className={styles["navigation-main"]}>
              <h2>Menu</h2>
              <nav className={styles.navbar}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/genres">Genres</NavLink>
                <NavLink to="/artists">Artists</NavLink>
              </nav>
            </div>
            <div className={styles["navigation-library"]}>
              <h2>Library</h2>
              <nav className={styles.navbar}>
                <NavLink to="/liked">Liked</NavLink>
                <NavLink to="/uploaded">Uploaded</NavLink>
              </nav>
            </div>
            <Routes>
              <Route path="/"></Route>
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
