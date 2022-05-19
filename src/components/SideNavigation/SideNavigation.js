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
const SideNavigation = ({ className }) => {
  const { user } = useAuthContext();

  return (
    //This className
    <div className={`${styles.sideNavigation} ${className}`}>
      <div className={styles["sideNavigation__header"]}>
        <div className={styles["sideNavigation__header-imageContainer"]}>
          <img src={soundGardenLogo} alt="Soundgarden logo"></img>
        </div>
        {/* Conditionally render the users displayName */}
        {user && (
          <>
            <p className={styles["sideNavigation__header-welcomeText"]}>Hi</p>
            <p className={styles["sideNavigation__header-artistNameText"]}>
              {user.displayName}
            </p>
          </>
        )}
      </div>

      {/* <div className={styles["navigation-container"]}> */}
      <div className={styles["sideNavigation__mainMenu"]}>
        <h4 className={styles["sideNavigation__menuHeaderText"]}>Menu</h4>
        <nav className={styles["sideNavigation__navbar"]}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles["navbar__activeItem"] : undefined
            }
          >
            <div className={styles["navbar__itemContent"]}>
              <HomeIcon
                className={styles["navbar__itemContent-icon"]}
                alt="Home button icon"
              />
              <div>Home</div>
            </div>
          </NavLink>
          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive ? styles["navbar__activeItem"] : undefined
            }
          >
            <div className={styles["navbar__itemContent"]}>
              <GenreIcon
                className={styles["navbar__itemContent-icon"]}
                alt="Genre button icon"
              />
              <div>Genres</div>
            </div>
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) =>
              isActive ? styles["navbar__activeItem"] : undefined
            }
          >
            <div className={styles["navbar__itemContent"]}>
              <ArtistIcon
                className={styles["navbar__itemContent-icon"]}
                alt="Artist button icon"
              />
              <div>Artists</div>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* CONDITIONAL CONTENT, SHOW ONLY IF USER LOGGED IN */}
      <div className={styles["sideNavigation__libraryMenu"]}>
        {user && (
          <>
            <h4 className={styles["sideNavigation__menuHeaderText"]}>
              Library
            </h4>
            <nav className={styles["sideNavigation__navbar"]}>
              <NavLink
                to="/liked"
                className={({ isActive }) =>
                  isActive ? styles["navbar__activeItem"] : undefined
                }
              >
                <div className={styles["navbar__itemContent"]}>
                  <LikedIcon
                    className={styles["navbar__itemContent-icon"]}
                    alt="Liked link icon"
                  />
                  <div>Liked</div>
                </div>
              </NavLink>
              <NavLink
                to="/uploaded"
                className={({ isActive }) =>
                  isActive ? styles["navbar__activeItem"] : undefined
                }
              >
                <div className={styles["navbar__itemContent"]}>
                  <UploadedIcon
                    className={styles["navbar__itemContent-icon"]}
                    alt="Uploaded link icon"
                  />
                  <div>Uploaded</div>
                </div>
              </NavLink>
            </nav>
          </>
        )}
      </div>

      <div className={styles["sideNavigation__audioplayerContainer"]}>
        <AudioPlayer />
      </div>
    </div>
    // </div>
  );
};

export default SideNavigation;
