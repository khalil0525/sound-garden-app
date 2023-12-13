import React, { useEffect, useReducer } from 'react';
import { Button, Grid, TextField, Typography, Paper, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useCloudStorage } from '../../../../hooks/useCloudStorage';
import { useFirestore } from '../../../../hooks/useFirestore';
import LoadingBar from '../../../LoadingBar/LoadingBar';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { projectFirestore } from '../../../../firebase/config';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '10vh',
    left: 0,
    right: 0,
    zIndex: 2000,
    margin: '0 auto',
    backgroundColor: 'transparent',
    maxWidth: '40rem',
    borderRadius: '18px',
    padding: '2rem',
    textAlign: 'center',
  },
  paper: {
    position: 'relative',
    padding: '3.6rem',
    maxWidth: 500,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '18px',
  },
  closeIcon: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    cursor: 'pointer',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  headerText: {
    margin: '0.8rem 0 !important',
    fontSize: theme.typography.h2.fontSize,
    color: '#000',
  },
  controls: {
    width: '100%',
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    fontSize: theme.typography.body1.fontSize,
    height: '40px',
    marginBottom: '1.6rem',
    padding: '0.4rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '0.8rem',
  },
  button: {
    display: 'block',

    backgroundColor: '#2196f3 !important',
    color: '#fff !important',
    border: 'none',
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: theme.typography.body1.fontSize,
    borderRadius: '4px',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));

const initialState = {
  playlistName: '',
  playlistImageFile: null,
  formIsValid: false,
  uploadIsReady: false,
};

const playlistReducer = (state, action) => {
  switch (action.type) {
    case 'PLAYLIST_NAME_CHANGE':
      return {
        ...state,
        playlistName: action.payload,
        formIsValid: action.payload.trim().length > 0,
        uploadIsReady: action.payload.trim().length > 0,
      };
    case 'PHOTO_FILE_CHANGE':
      return {
        ...state,
        playlistImageFile: action.payload,
        formIsValid: action.payload && !!state.playlistName.trim(),
        uploadIsReady: action.payload && !!state.playlistName.trim(),
      };
    case 'CANCEL_UPLOAD':
      return initialState;
    default:
      return state;
  }
};

const CreatePlaylistOverlay = ({ onConfirm, onCancel }) => {
  const { user } = useAuthContext();
  const classes = useStyles();

  const [playlistState, dispatchPlaylistState] = useReducer(
    playlistReducer,
    initialState
  );

  const { playlistName, playlistImageFile, formIsValid, uploadIsReady } =
    playlistState;
  const {
    addPlaylistFiles,
    response: cloudStorageResponse,
    uploadProgress,
  } = useCloudStorage();

  const { addDocument, response: firestoreResponse } =
    useFirestore('playlists');

  const handlePlaylistImageChange = (event) => {
    if (event.target.files[0].type.split('/')[0] === 'image') {
      const file = event.target.files[0];
      dispatchPlaylistState({
        type: 'PHOTO_FILE_CHANGE',
        payload: file,
      });
    } else {
      event.target.value = '';
    }
  };

  const handlePlaylistNameChange = (event) => {
    dispatchPlaylistState({
      type: 'PLAYLIST_NAME_CHANGE',
      payload: event.target.value,
    });
    console.log(playlistName);
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (formIsValid && uploadIsReady) {
      const userDocRef = projectFirestore.collection('users').doc(user.uid);

      userDocRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();

            addDocument({
              userID: userData.userID,
              playlistName: playlistName,
              profileURL: userData.profileURL,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user document:', error);
        });
    }
  };
  useEffect(() => {
    if (
      firestoreResponse.success &&
      !cloudStorageResponse.isPending &&
      !cloudStorageResponse.success
    ) {
      console.log('ehjre');
      addPlaylistFiles(firestoreResponse.document, user, playlistImageFile);
    } else if (firestoreResponse.success && cloudStorageResponse.success) {
      onConfirm();
    }
  }, [
    firestoreResponse,
    cloudStorageResponse,
    addPlaylistFiles,
    playlistImageFile,
    user,
    onConfirm,
  ]);
  console.log(firestoreResponse.success, cloudStorageResponse.success);
  return (
    <div className={classes.modal}>
      <Paper
        elevation={3}
        className={classes.paper}>
        <Box position="relative">
          <CloseIcon
            className={classes.closeIcon}
            onClick={onCancel}
          />
        </Box>{' '}
        <LoadingBar
          progress={uploadProgress}
          song={''}
        />
        <form className={classes.form}>
          <Typography
            variant="h2"
            className={classes.headerText}>
            Create Playlist
          </Typography>
          <Grid
            container
            gap={3}
            justifyContent="center"
            alignItems="center">
            <Grid
              item
              xs={12}
              className={classes.controls}>
              <TextField
                variant="filled"
                fullWidth
                label="Playlist Name"
                value={playlistName}
                onChange={handlePlaylistNameChange}
                className={classes.input}
              />
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.controls}>
              <input
                type="file"
                accept="image/*"
                id="playlist-image"
                onChange={handlePlaylistImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="playlist-image">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}>
                  Upload Playlist Image
                </Button>
              </label>
            </Grid>
          </Grid>

          <div className={classes.actions}>
            <Button
              className={`${classes.button} ${
                !formIsValid ? classes.buttonDisabled : ''
              }`}
              variant="outlined"
              type="submit"
              disabled={!formIsValid || !uploadIsReady}
              onClick={handleCreatePlaylist}>
              Create Playlist
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CreatePlaylistOverlay;
