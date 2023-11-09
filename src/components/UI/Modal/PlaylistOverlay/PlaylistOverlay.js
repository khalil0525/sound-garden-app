import React, { useEffect, useReducer } from 'react';
import { useCloudStorage } from '../../../../hooks/useCloudStorage';
import { useFirestore } from '../../../../hooks/useFirestore';
import styles from './EditSongOverlay.module.css';
import GenreSelect from '../../../UploadForm/GenreSelect/GenreSelect';
import placeholderImage from '../../../../images/blank_image_placeholder.svg';
import { useAuthContext } from '../../../../hooks/useAuthContext';

const editSongOverlayReducer = (state, action) => {
  switch (action.type) {
    case 'PHOTO_FILE_CHANGED':
      return {
        ...state,
        songPhotoFile: action.payload,
        songPhotoFileURL: URL.createObjectURL(action.payload),
        propertyChangeOccurred: true,
        editSaveReady: state.formIsValid,
      };
    case 'SONG_TITLE_CHANGE':
      return {
        ...state,
        songTitle: action.payload,
        formIsValid: action.payload.length > 0,
        propertyChangeOccurred: true,
        editSaveReady: action.payload.length > 0,
      };
    case 'SONG_GENRE_CHANGE':
      return {
        ...state,
        songGenre: action.payload,
        propertyChangeOccurred: true,
        editSaveReady: state.formIsValid,
      };

    default:
      return state;
  }
};

const EditSongOverlay = (props) => {
  let initialState = {
    songPhotoFileURL: props.song.songPhotoURL ? props.song.songPhotoURL : '',
    songTitle: props.song.title,
    songGenre: props.song.genre,
    songPhotoFile: null,
    formIsValid: true,
    editSaveReady: false,
    propertyChangeOccurred: false,
  };
  const [editSongState, dispatchEditSongState] = useReducer(
    editSongOverlayReducer,
    initialState
  );
  const {
    songPhotoFile,
    songPhotoFileURL,
    songTitle,
    songGenre,
    editSaveReady,
  } = editSongState;

  const { user } = useAuthContext();
  const {
    replaceFile,
    addFile,
    response: cloudStorageResponse,
  } = useCloudStorage();

  //Fire store hook
  const { updateDocument, response: firestoreResponse } = useFirestore('music');

  const handleSongPhotoFileChange = (event) => {
    if (event.target.files[0].type.split('/')[0] === 'image') {
      dispatchEditSongState({
        type: 'PHOTO_FILE_CHANGED',
        payload: event.target.files[0],
      });
    } else {
      event.target.value = '';
    }
  };

  const handleSongNameChange = (event) => {
    dispatchEditSongState({
      type: 'SONG_TITLE_CHANGE',
      payload: event.target.value,
    });
  };
  const handleGenreTypeChange = (event) => {
    dispatchEditSongState({
      type: 'SONG_GENRE_CHANGE',
      payload: event.target.value,
    });
  };
  const handleSongUpdate = () => {
    let newValues = { title: songTitle, genre: songGenre };
    if (editSaveReady) {
      updateDocument(props.song.docID, newValues);
    }
  };
  useEffect(() => {
    if (
      cloudStorageResponse.success ||
      (songPhotoFile === null && firestoreResponse.success)
    ) {
      props.onConfirm();
    }
  }, [cloudStorageResponse, firestoreResponse.success, songPhotoFile, props]);

  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    if (
      firestoreResponse.success &&
      !cloudStorageResponse.isPending &&
      !cloudStorageResponse.success &&
      songPhotoFile !== null
    ) {
      //If the song previously didn't have a photo
      if (props.song.songPhotoURL === '') {
        addFile(
          firestoreResponse.document,
          '/images',
          user,
          songPhotoFile,
          'songPhoto'
        );
      } else {
        //If the song previously had a photo
        replaceFile(
          firestoreResponse.document,
          props.song.songPhotoFilePath,
          songPhotoFile,
          'songPhoto',
          user
        );
      }
      // Call to useCloudStorage to add song file
      console.log(firestoreResponse.document);
    }
  }, [
    firestoreResponse,
    cloudStorageResponse,
    replaceFile,
    addFile,
    user,
    songPhotoFile,
    props.song.songPhotoFilePath,
    props.song.songPhotoURL,
  ]);

  return (
    <div className={styles.modal}>
      <div className={styles['playListForm']}>
        <div className={styles['photo-picker']}>
          <img
            className={styles['photo-picker-photo']}
            src={songPhotoFileURL ? songPhotoFileURL : placeholderImage}
            alt="Song Cover Art"
            width="160"
            height="160"
          />
          {/* */}
          <input
            type="file"
            disabled={cloudStorageResponse.isPending}
            onChange={handleSongPhotoFileChange}
            accept="image/*"
          />
        </div>
        <div className={styles['playlistForm_controls']}>
          <label htmlFor="song-name">Song Name:</label>

          <input
            type="text"
            id="song-name"
            name="song-name"
            value={songTitle}
            disabled={cloudStorageResponse.isPending}
            onChange={handleSongNameChange}></input>

          <GenreSelect
            onGenreTypeChange={handleGenreTypeChange}
            disabled={cloudStorageResponse.isPending}
            genreValue={songGenre}
          />

          {!cloudStorageResponse.isPending && !cloudStorageResponse.success && (
            <div className={styles['playlistForm_actions']}>
              <div onClick={props.onCancel}>Cancel</div>

              <button
                onClick={handleSongUpdate}
                disabled={!editSaveReady}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSongOverlay;
