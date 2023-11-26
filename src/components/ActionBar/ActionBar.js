import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ActionBar.module.css';
import { ReactComponent as UploadIcon } from '../../images/Upload_duotone_line.svg';
import placeholderImage from '../../images/profile_placeholder.svg';
import Modal from '../UI/Modal/Modal';
import ActionBarSearch from './ActionBarSearch';
import Button from '../UI/Button/Button';
import { useFirestore } from '../../hooks/useFirestore';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
const ActionBar = (props) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [profileLink, setProfileLink] = useState(null);
  const { getDocument: getUserDocument, response: getUserDocumentResponse } =
    useFirestore('users');
  // This will run only if user is currently logged in
  useEffect(() => {
    if (
      props.user &&
      props.user.uid &&
      !getUserDocumentResponse.success &&
      !getUserDocumentResponse.isPending
    ) {
      getUserDocument(props.user.uid);
    }
  }, [props.user, getUserDocument, getUserDocumentResponse]);

  useEffect(() => {
    if (!profileLink && getUserDocumentResponse.success) {
      setProfileLink(getUserDocumentResponse.document.profileURL);
    }
  }, [getUserDocumentResponse, profileLink]);

  return (
    <div className={`${styles.actionBar} ${props.className}`}>
      <nav className={styles['actionBar__nav']}>
        {!props.user ? (
          <>
            <Button
              onClick={() => setIsSigningIn(true)}
              disabled={isSigningIn}
              buttonSize="large"
              className={styles['actionBar__button']}>
              Sign in
            </Button>
            <Button
              onClick={() => setIsCreatingAccount(true)}
              disabled={isCreatingAccount}
              buttonSize="large"
              className={styles['actionBar__button']}>
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
            to={`/profile/${profileLink && profileLink}`}
            className={styles['actionBar__profileLink']}>
            <Avatar
              src={props.user.photoURL ? props.user.photoURL : placeholderImage}
              alt="Search button icon"
              className={styles['actionBar__profileLink-img']}
            />
          </Link>
        )}

        <Link
          to="/upload"
          className={styles['actionBar__uploadLink']}>
          <UploadIcon alt="Upload button icon" />
        </Link>
        <ActionBarSearch queryString={props.query} />
      </nav>
    </div>
  );
};

export default ActionBar;
