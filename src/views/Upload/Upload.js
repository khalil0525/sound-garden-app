import React, { useReducer, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Box, Paper, Typography, Button, TextField } from '@mui/material';

import { useCloudStorage } from '../../hooks/useCloudStorage';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import GenreSelect from '../../components/UploadForm/GenreSelect/GenreSelect';
import { FileUploader } from 'react-drag-drop-files';
import { projectFirestore } from '../../firebase/config';
const useStyles = makeStyles((theme) => ({
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '3.2rem',
    border: '1px rgba(128, 128, 128, 0.671) solid',
    borderRadius: '6px',
    width: '100%',

    minHeight: '220px',
  },
  filePicker: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  photoPicker: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0.4rem auto',
    flex: '1 0 auto',
  },
  uploadForm: {
    display: 'flex',

    padding: '1.6rem',

    gap: '1rem',
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.8rem',
  },
  photoPickerPhoto: {
    width: '160px',
    height: '160px',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '4px',
    },
  },
}));
let initialState = {
  songFile: null,
  songPhotoFile: null,
  songPhotoURL: null,
  songDuration: null,
  songDurationIsValid: false,
  uploadIsReady: false,
  songName: '',
  genreType: 'none',
  formIsValid: false,
};
const uploadReducer = (state, action) => {
  switch (action.type) {
    case 'SONG_FILE_CHANGED':
      return {
        ...state,
        songFile: action.payload,
      };
    case 'SONG_DURATION_CHANGED':
      return {
        ...state,
        songDuration: action.payload,
        songDurationIsValid: true,
        uploadIsReady: state.songName.length > 0,
      };
    case 'PHOTO_FILE_CHANGED':
      return {
        ...state,
        songPhotoFile: action.payload,
        songPhotoURL: URL.createObjectURL(action.payload),
      };

    case 'SONG_NAME_CHANGE':
      return {
        ...state,
        songName: action.payload,
        formIsValid: action.payload.length > 0,
        uploadIsReady: action.payload.length > 0 && state.songDurationIsValid,
      };
    case 'GENRE_TYPE_CHANGE':
      return {
        ...state,
        genreType: action.payload,
      };
    case 'CANCEL_UPLOAD':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

const Upload = () => {
  const classes = useStyles();

  const [songUploadState, dispatchSongUploadState] = useReducer(
    uploadReducer,
    initialState
  );

  const {
    songFile,
    songPhotoFile,
    songPhotoURL,
    songName,
    genreType,
    formIsValid,
    songDuration,
    uploadIsReady,
  } = songUploadState;

  const {
    addSongFiles,
    response: cloudStorageResponse,
    uploadProgress,
  } = useCloudStorage();
  const [profileURL, setProfileURL] = useState(null);
  const { addDocument, response: firestoreResponse } = useFirestore('music');

  const { user } = useAuthContext();

  const handleSongUpload = async () => {
    if (songFile && formIsValid && uploadIsReady) {
      const userDocRef = projectFirestore.collection('users').doc(user.uid);

      userDocRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Access the user document data
            const userData = doc.data();
            setProfileURL(userData.profileURL);
            addDocument({
              artist: userData.displayName,
              genre: genreType,
              title: songName,
              duration: songDuration,
              userID: userData.userID,
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
      addSongFiles(firestoreResponse.document, user, [songFile, songPhotoFile]);
    }
  }, [
    firestoreResponse,
    cloudStorageResponse,
    addSongFiles,
    user,
    songFile,
    songPhotoFile,
  ]);

  const handleCancelClick = () => {
    dispatchSongUploadState({
      type: 'CANCEL_UPLOAD',
    });
  };

  const handleSongFileChange = (file) => {
    if (file['type'].split('/')[0] === 'audio') {
      dispatchSongUploadState({
        type: 'SONG_FILE_CHANGED',
        payload: file,
      });
    }
  };

  const handleSongPhotoFileChange = (event) => {
    if (event.target.files[0].type.split('/')[0] === 'image') {
      dispatchSongUploadState({
        type: 'PHOTO_FILE_CHANGED',
        payload: event.target.files[0],
        songPhotoURL: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      event.target.value = '';
    }
  };

  const handleSongNameChange = (event) => {
    dispatchSongUploadState({
      type: 'SONG_NAME_CHANGE',
      payload: event.target.value,
    });
  };

  const handleGenreTypeChange = (event) => {
    dispatchSongUploadState({
      type: 'GENRE_TYPE_CHANGE',
      payload: event.target.value,
    });
  };

  useEffect(() => {
    const getAudioDuration = () => {
      let reader = new FileReader();
      reader.onload = (event) => {
        let audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, (buffer) => {
          let duration = buffer.duration;
          if (duration) {
            dispatchSongUploadState({
              type: 'SONG_DURATION_CHANGED',
              payload: duration,
            });
          }
        });
      };
      reader.onerror = (event) => {
        console.error('An error occurred reading the file: ', event);
      };
      reader.readAsArrayBuffer(songFile);
    };
    if (songFile != null) {
      getAudioDuration();
    }
  }, [songFile]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '124rem',
        margin: 'auto',
      }}>
      <Paper className={classes.uploadContainer}>
        <Typography
          variant="h3"
          color="text.secondary"
          sx={{ margin: '1.6rem auto' }}>
          Drag and drop your tracks & albums here
        </Typography>
        {!songFile && (
          <FileUploader
            handleChange={handleSongFileChange}
            name="file"
            multiple={false}
            hoverTitle="Drop audio file here"
            types={['mp3', 'ogg', 'wav']}
            maxSize={200}
          />
        )}
        {songFile && (
          <Box sx={{ padding: '1.6rem 4.8rem', width: '100%' }}>
            <LoadingBar
              progress={uploadProgress}
              song={songFile.name}
            />
            <div className={classes.uploadForm}>
              {!cloudStorageResponse.success && (
                <>
                  <div className={classes.photoPicker}>
                    <div className={classes.photoPickerPhoto}>
                      <img
                        src={songPhotoFile ? songPhotoURL : placeholderImage}
                        alt="Song Cover Art"
                      />
                    </div>
                    <Box sx={{ position: 'relative', width: '80%' }}>
                      <input
                        type="file"
                        onChange={handleSongPhotoFileChange}
                        disabled={cloudStorageResponse.isPending}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="photo-file-input"
                      />
                      <label htmlFor="photo-file-input">
                        <Button
                          component="span"
                          variant="contained"
                          color="primary"
                          disabled={cloudStorageResponse.isPending}
                          sx={{
                            position: 'absolute',
                            top: '-3.6rem',
                            zIndex: 1000,
                            width: '100%',
                          }}>
                          Choose Photo
                        </Button>
                      </label>
                    </Box>
                  </div>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      label="Song Name"
                      id="song-name"
                      value={songName}
                      onChange={handleSongNameChange}
                      disabled={cloudStorageResponse.isPending}
                      fullWidth
                      margin="normal"
                    />
                    <GenreSelect
                      onGenreTypeChange={handleGenreTypeChange}
                      genreValue={genreType}
                      disabled={cloudStorageResponse.isPending}
                    />
                    {!cloudStorageResponse.isPending && (
                      <div className={classes.actionContainer}>
                        <Button
                          onClick={handleCancelClick}
                          variant="outlined"
                          color="secondary">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSongUpload}
                          variant="contained"
                          color="primary"
                          disabled={!uploadIsReady}>
                          Upload
                        </Button>
                      </div>
                    )}
                  </Box>
                </>
              )}
              {cloudStorageResponse.success && (
                <>
                  <Typography variant="h5">Uploaded Successfully!</Typography>
                  <div>
                    <Link to={`/profile/${profileURL}`}>
                      Go to your uploaded tracks
                    </Link>
                  </div>
                </>
              )}
              {cloudStorageResponse.isPending && (
                <Button
                  disabled
                  variant="contained"
                  color="primary">
                  Uploading... Please wait
                </Button>
              )}
            </div>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Upload;
