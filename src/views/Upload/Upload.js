import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import GenreSelect from '../../components/UploadForm/GenreSelect/GenreSelect';
import { FileUploader } from 'react-drag-drop-files';
import Layout from '../../components/Layout/Layout';

const useStyles = makeStyles((theme) => ({
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '60rem',
    margin: '10% auto',
    backgroundColor: 'white',
    padding: '2rem',
    border: '1px rgba(128, 128, 128, 0.671) solid',
    borderRadius: '6px',
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
    margin: '0 auto',
  },
  uploadForm: {
    maxWidth: '50rem',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.5rem',
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

  const { addDocument, response: firestoreResponse } = useFirestore('music');
  const { user } = useAuthContext();

  const handleSongUpload = () => {
    if (songFile && formIsValid && uploadIsReady) {
      addDocument({
        artist: user.displayName,
        genre: genreType,
        title: songName,
        duration: songDuration,
        userID: user.uid,
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
    <Layout user={user}>
      <Paper className={classes.uploadContainer}>
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
          <div className={classes.uploadForm}>
            <LoadingBar
              progress={uploadProgress}
              song={songFile.name}
            />
            {!cloudStorageResponse.success && (
              <>
                <div className={classes.photoPicker}>
                  <div className={classes.photoPickerPhoto}>
                    <img
                      src={songPhotoFile ? songPhotoURL : placeholderImage}
                      alt="Song Cover Art"
                    />
                  </div>
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
                      disabled={cloudStorageResponse.isPending}>
                      Choose Photo
                    </Button>
                  </label>
                </div>
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
              </>
            )}
            {cloudStorageResponse.success && (
              <>
                <Typography variant="h5">Uploaded Successfully!</Typography>
                <div>
                  <Link to="/uploaded">Go to your uploaded tracks</Link>
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
        )}
      </Paper>
    </Layout>
  );
};

export default Upload;
