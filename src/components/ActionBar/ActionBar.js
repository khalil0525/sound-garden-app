import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Modal from '../UI/Modal/Modal';
import { ReactComponent as UploadIcon } from '../../images/Upload_duotone_line.svg';
import placeholderImage from '../../images/profile_placeholder.svg';
import ActionBarSearch from './ActionBarSearch';
import { useFirestore } from '../../hooks/useFirestore';

const useStyles = makeStyles((theme) => ({
  actionBar: {
    position: 'relative',
    zIndex: 1000,
    maxWidth: '100%',
  },
  actionBarNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  actionBarProfileLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(4.2),
    height: theme.spacing(4.2),
    backgroundImage: `url('/src/images/blank_image_placeholder.svg')`,
    filter: 'drop-shadow(3px 4px 15px rgba(0, 0, 0, 0.12))',
    stroke: '#fff',
    borderRadius: '25px',
    order: 3,
  },
  actionBarProfileLinkImg: {
    display: 'flex',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '10.18rem',
  },
  actionBarUploadLink: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      width: theme.spacing(4.2),
      height: theme.spacing(4.2),
      color: '#fff',
      background: theme.palette.primary.main,
      boxShadow: '3px 4px 15px rgba(0, 0, 0, 0.12)',
      borderRadius: '25px',
      padding: theme.spacing(1),
    },
  },
  actionBarButton: {
    backgroundColor: 'transparent',
  },
}));

const ActionBar = (props) => {
  const classes = useStyles();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [profileLink, setProfileLink] = useState(null);
  const { getDocument: getUserDocument, response: getUserDocumentResponse } =
    useFirestore('users');

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
    <div className={`${classes.actionBar} ${props.className}`}>
      <nav className={classes.actionBarNav}>
        {!props.user ? (
          <>
            <Button
              onClick={() => setIsSigningIn(true)}
              disabled={isSigningIn}
              size="large"
              className={classes.actionBarButton}>
              Sign in
            </Button>
            <Button
              onClick={() => setIsCreatingAccount(true)}
              disabled={isCreatingAccount}
              size="large"
              className={classes.actionBarButton}>
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
            className={classes.actionBarProfileLink}>
            <Avatar
              src={props.user.photoURL ? props.user.photoURL : placeholderImage}
              alt="Search button icon"
              className={classes.actionBarProfileLinkImg}
            />
          </Link>
        )}

        <Link
          to="/upload"
          className={classes.actionBarUploadLink}>
          <UploadIcon alt="Upload button icon" />
        </Link>
        <ActionBarSearch queryString={props.query} />
      </nav>
    </div>
  );
};

export default ActionBar;
