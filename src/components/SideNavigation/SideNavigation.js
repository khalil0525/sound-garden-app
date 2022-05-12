import styles from "./SideNavigation.module.css";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import AudioPlayer from "../AudioPlayer/AudioPlayer";

import soundGardenLogo from "../../images/soundgarden.jpg";
import { ReactComponent as LikedIcon } from "../../images/Favorite_duotone.svg";
import { ReactComponent as HomeIcon } from "../../images/Home_fill.svg";
import { ReactComponent as ArtistIcon } from "../../images/User_duotone_line.svg";
import { ReactComponent as GenreIcon } from "../../images/Mic_alt_duotone.svg";
import { ReactComponent as UploadedIcon } from "../../images/Upload_duotone_line.svg";

// import {ReactComponent as }
const SideNavigation = () => {
  const { user } = useAuthContext();

  return (
    //This className
    <div className={styles.sidebar}>
      <div className={styles["sidebar-header"]}>
        {/* <h1>Sound Garden</h1> */}
        <div className={styles["sidebar-header-image"]}>
          <img src={soundGardenLogo} alt="Soundgarden logo"></img>
        </div>
        {/* Conditionally render the users displayName */}
        {user && (
          <>
            <p className={styles["welcome-text"]}>Hi</p>
            <p className={styles.username}>{user.displayName}</p>
          </>
        )}
      </div>

      {/* <div className={styles["navigation-container"]}> */}
      <div className={styles["navigation-menu"]}>
        <h4 className={styles["navigation-header-text"]}>Menu</h4>
        <nav className={styles.navbar}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles["active-nav-item"] : undefined
            }
          >
            <div className={styles["navbar-item-contents"]}>
              <HomeIcon
                className={styles["navbar-item-contents-icon"]}
                alt="Home button icon"
              />
              <div>Home</div>
            </div>
          </NavLink>
          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive ? styles["active-nav-item"] : undefined
            }
          >
            <div className={styles["navbar-item-contents"]}>
              <GenreIcon
                className={styles["navbar-item-contents-icon"]}
                alt="Genre button icon"
              />
              <div>Genres</div>
            </div>
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) =>
              isActive ? styles["active-nav-item"] : undefined
            }
          >
            <div className={styles["navbar-item-contents"]}>
              <ArtistIcon
                className={styles["navbar-item-contents-icon"]}
                alt="Artist button icon"
              />
              <div>Artists</div>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* CONDITIONAL CONTENT, SHOW ONLY IF USER LOGGED IN */}
      <div className={styles["navigation-library"]}>
        {user && (
          <>
            <h4 className={styles["navigation-header-text"]}>Library</h4>
            <nav className={styles.navbar}>
              <NavLink
                to="/liked"
                className={({ isActive }) =>
                  isActive ? styles["active-nav-item"] : undefined
                }
              >
                <div className={styles["navbar-item-contents"]}>
                  <LikedIcon
                    className={styles["navbar-item-contents-icon"]}
                    alt="Liked link icon"
                  />
                  <div>Liked</div>
                </div>
              </NavLink>
              <NavLink
                to="/uploaded"
                className={({ isActive }) =>
                  isActive ? styles["active-nav-item"] : undefined
                }
              >
                <div className={styles["navbar-item-contents"]}>
                  <UploadedIcon
                    className={styles["navbar-item-contents-icon"]}
                    alt="Uploaded link icon"
                  />
                  <div>Uploaded</div>
                </div>
              </NavLink>
            </nav>
          </>
        )}
      </div>

      <div className={styles["audioplayer_container"]}>
        <AudioPlayer />
      </div>
    </div>
    // </div>
  );
};

export default SideNavigation;
