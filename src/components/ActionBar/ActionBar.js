import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Modal from '../UI/Modal/Modal';
import placeholderImage from '../../images/profile_placeholder.svg';
import ActionBarSearch from './ActionBarSearch';
import { useFirestore } from '../../hooks/useFirestore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import theme from '../../theme';
const useStyles = makeStyles((theme) => ({
  actionBar: {
    position: 'relative',
    zIndex: 1000,
    width: '100%',
    paddingTop: theme.spacing(2),
  },
  actionBarNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: theme.spacing(1),
  },
  actionBarProfileLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundImage: `url('/src/images/blank_image_placeholder.svg')`,
    filter: 'drop-shadow(3px 4px 15px rgba(0, 0, 0, 0.12))',
    stroke: '#fff',
    borderRadius: '25px',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '4rem',
      height: '4rem',
      color: '#fff',
      background: theme.palette.primary.main,
      boxShadow: '3px 4px 15px rgba(0, 0, 0, 0.12)',
      borderRadius: '25px',
      padding: theme.spacing(1),
    },
  },
  actionBarButton: {
    backgroundColor: 'transparent',
    padding: theme.spacing(1), // Adjust padding for smaller screens
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem', // Smaller font size for mobile
      padding: theme.spacing(0.5), // Less padding on mobile
      minWidth: 'auto', // Adjust the minimum width
    },
  },
  searchInput: {
    fontSize: '0.9rem', // Adjust the font size for the search input
  },
}));

const ActionBar = ({ user, className, query }) => {
  const classes = useStyles(theme);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [profileLink, setProfileLink] = useState(null);
  const { getDocument: getUserDocument, response: getUserDocumentResponse } =
    useFirestore('users');

  useEffect(() => {
    if (
      user &&
      user.uid &&
      !getUserDocumentResponse.success &&
      !getUserDocumentResponse.isPending
    ) {
      getUserDocument(user.uid);
    }
  }, [user, getUserDocument, getUserDocumentResponse]);

  useEffect(() => {
    if (!profileLink && getUserDocumentResponse.success) {
      setProfileLink(getUserDocumentResponse?.document?.profileURL);
    }
  }, [getUserDocumentResponse, profileLink]);

  return (
    <div className={`${classes.actionBar} ${className}`}>
      <nav className={classes.actionBarNav}>
        {!user ? (
          <>
            <Button
              onClick={() => setIsSigningIn(true)}
              disabled={isSigningIn}
              size="large"
              className={classes.actionBarButton}>
              Login
            </Button>
            <Button
              onClick={() => setIsCreatingAccount(true)}
              disabled={isCreatingAccount}
              size="large"
              className={classes.actionBarButton}>
              Register
            </Button>

            <Modal
              action="signIn"
              isOpen={isSigningIn}
              onConfirm={() => setIsSigningIn(false)}
              onCancel={() => setIsSigningIn(false)}
            />

            {isCreatingAccount && (
              <Modal
                action="createAccount"
                isOpen={isCreatingAccount}
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
              src={user.photoURL ? user.photoURL : placeholderImage}
              alt="Search button icon"
              className={classes.actionBarProfileLinkImg}
            />
          </Link>
        )}

        <Link
          to="/upload"
          className={classes.actionBarUploadLink}>
          <CloudUploadIcon />
        </Link>
        <ActionBarSearch queryString={query} />
      </nav>
    </div>
  );
};

export default ActionBar;
