import React, { useEffect, useReducer, useState } from 'react';

import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import AudioSeekControlBar from '../AudioPlayer/AudioSeekControlBar/AudioSeekControlBar';

import placeholderImage from '../../images/blank_image_placeholder.svg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import Modal from '../UI/Modal/Modal';
import { IconButton } from '@mui/material';
import { addLike, removeLike } from '../../api/functions';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import moment from 'moment';
import { songItem } from '../../styles';

const useStyles = makeStyles(songItem);

let initialState = {
  playing: false,
  isMounted: false,
  played: 0,
  duration: 0,
  seeking: false,
};

const songItemReducer = (state, action) => {
  switch (action.type) {
    case 'PLAY_PAUSE_CLICK':
      return { ...state, playing: !state.playing };
    case 'SEEK_POSITION_CHANGE':
      return { ...state, played: action.payload };
    case 'SEEK_MOUSE_DOWN':
      return { ...state, seeking: true };
    case 'SEEK_MOUSE_UP':
      return { ...state, seeking: false };
    case 'PROGRESS_CHANGE':
      return { ...state, played: action.payload };
    case 'PLAY':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    case 'SONG_MOUNTED':
      return { ...state, isMounted: true, played: 0 };
    case 'SONG_DISMOUNTED':
      return { ...state, isMounted: false, played: 0, playing: false };
    default:
      return { ...state };
  }
};

const SongItem = ({
  song,
  playlistSongs,
  songPlaylistLocation,
  songIndex,
  liked,
  user,
  songId = null,
  showSongItemFooter = true,
}) => {
  const classes = useStyles(theme);

  const [songItemState, dispatchSongItemState] = useReducer(
    songItemReducer,
    initialState
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  // const [edited, setEdited] = useState(false);
  const { playing, isMounted, played, seeking } = songItemState;
  const {
    loadedSongURL,
    isSongPlaying,
    playlist,
    currentSongPlayedTime,
    dispatchAudioPlayerContext,
    playlistLocation,
  } = useAudioPlayerContext();

  const [isLiked, setIsLiked] = useState(() => liked);

  const { deleteDocument: deleteSongDocument } = useFirestore('music');

  const { deleteSongFiles, response: cloudStorageResponse } = useCloudStorage();

  const handlePlayPauseClick = () => {
    if (loadedSongURL !== song.songURL) {
      if (JSON.stringify(playlist) === JSON.stringify(playlistSongs)) {
        dispatchAudioPlayerContext({
          type: 'PLAYLIST_INDEX_CHANGE',
          payload: songIndex,
        });
      } else {
        dispatchAudioPlayerContext({
          type: 'PLAYLIST_CHANGE',
          payload: { playlistSongs, songIndex, songPlaylistLocation },
        });
      }
    } //else it's paused
    else if (playing) {
      dispatchSongItemState({ type: 'PAUSE' });
      dispatchAudioPlayerContext({ type: 'SONG_PAUSED' });
    } else {
      dispatchSongItemState({ type: 'PLAY' });
      dispatchAudioPlayerContext({ type: 'SONG_PLAYED' });
    }
    dispatchSongItemState({ type: 'PLAY_PAUSE_CLICK' });
    // setIsPlaying((prevState) => !prevState);
  };

  const handleSongDownloadClick = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);

      a.download =
        song.songFilePath.split('_')[song.songFilePath.split('_').length - 1]; // Name the file anything you'd like.
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    };
    xhr.open('GET', song.songURL);
    xhr.send();
  };

  const handleEditSong = () => {
    setIsEditing(false);
  };

  const handleDeleteSong = async () => {
    deleteSongFiles(song);
  };

  const handleSeekMouseDown = () => {
    if (isMounted) {
      dispatchAudioPlayerContext({ type: 'SEEK_MOUSE_DOWN_FROM_SONG_ITEM' });
      dispatchSongItemState({ type: 'SEEK_MOUSE_DOWN' });
    }
  };

  const handleSeekChange = (event) => {
    if (isMounted) {
      dispatchAudioPlayerContext({
        type: 'SEEK_CHANGE_FROM_SONG_ITEM',
        payload: parseFloat(event.target.value),
      });
      dispatchSongItemState({
        type: 'SEEK_POSITION_CHANGE',
        payload: parseFloat(event.target.value),
      });
    }
  };

  const handleSeekMouseUp = (event) => {
    if (isMounted) {
      dispatchAudioPlayerContext({
        type: 'SEEK_MOUSE_UP_FROM_SONG_ITEM',
        payload: event.target.value,
      });
      dispatchSongItemState({ type: 'SEEK_MOUSE_UP' });
    }
  };

  async function handleLikeClick() {
    setIsProcessingLike(true);
    try {
      const { data } = isLiked
        ? await removeLike({ songId: songId })
        : await addLike({ songId: songId });

      if (data.success) {
        setIsLiked((prevState) => !prevState);
      }
      setIsProcessingLike(false);
    } catch (error) {
      console.error('Error:', error);
      setIsProcessingLike(false);
    }
  }

  useEffect(() => {
    if (loadedSongURL === song.songURL && !isMounted) {
      dispatchSongItemState({ type: 'SONG_MOUNTED' });
    } else if (loadedSongURL !== song.songURL && isMounted) {
      dispatchSongItemState({ type: 'SONG_DISMOUNTED' });
    }
  }, [loadedSongURL, song.songURL, isMounted, song.title]);

  // Change the current time based on the global played state
  useEffect(() => {
    if (isSongPlaying && isMounted && !seeking) {
      dispatchSongItemState({
        type: 'PROGRESS_CHANGE',
        payload: currentSongPlayedTime,
      });
    }
  }, [isSongPlaying, isMounted, currentSongPlayedTime, seeking]);

  useEffect(() => {
    if ((!isSongPlaying || !isMounted) && playing) {
      dispatchSongItemState({ type: 'PAUSE' });
    } else if (isSongPlaying && isMounted && !playing) {
      dispatchSongItemState({ type: 'PLAY' });
    }
  }, [loadedSongURL, isSongPlaying, playing, isMounted, song.title]);

  useEffect(() => {
    if (
      playlistLocation === songPlaylistLocation &&
      JSON.stringify(playlist) !== JSON.stringify(playlistSongs)
    ) {
      dispatchAudioPlayerContext({
        type: 'SONG_EDITED_IN_PLAYLIST',
        payload: playlistSongs,
      });
    }
  }, [
    playlistLocation,
    songPlaylistLocation,
    playlist,
    playlistSongs,
    dispatchAudioPlayerContext,
  ]);

  useEffect(() => {
    if (cloudStorageResponse.success) {
      deleteSongDocument(song.docID);
      dispatchAudioPlayerContext({
        type: 'SONG_DELETED_FROM_PLAYLIST',
        payload: song.docID,
      });
    }
  }, [
    cloudStorageResponse.success,
    deleteSongDocument,
    song.docID,
    dispatchAudioPlayerContext,
  ]);
  const { _seconds, _nanoseconds } = song.createdAt || {};

  // Convert Firestore timestamp to JavaScript Date
  const createdAt = _seconds
    ? new Date(_seconds * 1000 + (_nanoseconds || 0) / 1e6)
    : null;
  const relativeTime = createdAt ? moment(createdAt).fromNow() : null;

  return (
    <li className={classes.songItem}>
      <div className={classes.songItemHeader}>
        <div className={classes.songItemTitleContainer}>
          <IconButton
            className={classes.titleContainerPlayBtn}
            onClick={handlePlayPauseClick}>
            {playing ? (
              <PauseIcon htmlColor="#fff" />
            ) : (
              <PlayArrowIcon htmlColor="#fff" />
            )}
          </IconButton>

          <div className={classes.titleContainerSongTitle}>
            <span className={classes.titleContainerSongTitleArtist}>
              {song.artist}
            </span>
            <span className={classes.titleContainerSongTitleTitle}>
              {song.title}
            </span>
          </div>
          <div className={classes.titleContainerAdditional}>
            <div className={classes.titleContainerAdditionalDateContainer}>
              <span className={classes.titleContainerAdditionalUploadDate}>
                {relativeTime}
              </span>
            </div>
            <div className={classes.titleContainerAdditionalGenreContainer}>
              <span className={classes.titleContainerAdditionalGenre}>
                {song.genre}
              </span>
            </div>
          </div>
        </div>
      </div>
      <AudioSeekControlBar
        className={classes.songItemSeekControl}
        durationClassName={classes.songItemDuration}
        duration={song.duration}
        played={played}
        onChange={handleSeekChange}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
      />

      <div className={classes.songItemFooter}>
        <div className={classes.songItemActionContainer}>
          <IconButton
            className={`${classes.actionContainerBtn} ${
              isLiked && user.uid && classes.actionContainerLikeBtnLiked
            } `}
            onClick={handleLikeClick}
            disabled={isProcessingLike}>
            {isLiked ? (
              <FavoriteIcon htmlColor={theme.palette.primary.main} />
            ) : (
              <FavoriteBorderRoundedIcon />
            )}
          </IconButton>
          <IconButton
            className={classes.actionContainerBtn}
            onClick={handleSongDownloadClick}>
            <FileDownloadOutlinedIcon />
          </IconButton>

          {user.uid === song.userID && (
            <>
              <IconButton
                className={classes.actionContainerBtn}
                onClick={() => setIsEditing(true)}
                disabled={isEditing}>
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                className={classes.actionContainerBtn}
                onClick={() => setIsDeleting(true)}
                disabled={isDeleting}>
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </>
          )}
          {isEditing && (
            <Modal
              action="editSongInformation"
              song={song}
              onConfirm={handleEditSong}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {isDeleting && (
            <Modal
              action="deleteSong"
              onConfirm={handleDeleteSong}
              onCancel={() => setIsDeleting(false)}
            />
          )}
        </div>
      </div>
      <div className={classes.songItemAside}>
        <div className={classes.songItemSongPhotoContainer}>
          <img
            className={classes.songPhotoContainerImg}
            src={song.songPhotoURL ? song.songPhotoURL : placeholderImage}
            alt="Song Cover Art"
          />
        </div>
      </div>
    </li>
  );
};

export default SongItem;
