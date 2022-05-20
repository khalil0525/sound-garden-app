import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./ActionBar.module.css";
import { ReactComponent as UploadIcon } from "../../images/Upload_duotone_line.svg";
import placeholderImage from "../../images/profile_placeholder.svg";
import Modal from "../UI/Modal/Modal";
import ActionSearchBar from "./ActionSearchBar";
import Button from "../UI/Button/Button";

const ActionBar = (props) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [profileLink, setProfileLink] = useState();
  // const getUserProfile = useMemo(() => {
  //   ;
  // }, [getUserProfileLink, props.user.uid]);

  // useEffect(() => {
  //   if (props.user && props.user.uid && !profileLink) {
  //     let link = getUserProfileLink(props.user.uid).profileURL ;
  //     setProfileLink(link);
  //   }
  // }, [props.user.uid, getUserProfileLink, props.user]);
  return (
    <div className={`${styles.actionbar} ${props.className}`}>
      <nav className={styles["actionbar__nav"]}>
        {!props.user ? (
          <>
            <Button
              onClick={() => setIsSigningIn(true)}
              disabled={isSigningIn}
              buttonSize="large"
            >
              Sign in
            </Button>
            <Button
              onClick={() => setIsCreatingAccount(true)}
              disabled={isCreatingAccount}
              buttonSize="large"
            >
              Create Account
            </Button>

            {isSigningIn && (
              <Modal
                action="signIn"
                onConfirm={() => setIsSigningIn(false)}
                onCancel={() => setIsSigningIn(false)}
              />
            )}
            {isCreatingAccount && (
              <Modal
                action="createAccount"
                onConfirm={() => setIsCreatingAccount(false)}
                onCancel={() => setIsCreatingAccount(false)}
              />
            )}
          </>
        ) : (
          <Link
            to={`/${profileLink}`}
            className={styles["actionbar__profileLink"]}
          >
            <img
              src={props.user.photoURL ? props.user.photoURL : placeholderImage}
              alt="Search button icon"
              className={styles["actionbar__profileLink-img"]}
            />
          </Link>
        )}

        <Link to="/upload" className={styles["actionbar__uploadLink"]}>
          <UploadIcon alt="Upload button icon" />
        </Link>
        <ActionSearchBar queryString={props.query} />
      </nav>
    </div>
  );
};

export default ActionBar;
