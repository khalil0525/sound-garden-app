import React, { useEffect, useReducer, useState } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

import AudioSeekControlBar from '../AudioPlayer/AudioSeekControlBar/AudioSeekControlBar';
import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import Modal from '../UI/Modal/Modal';
import { addLike, removeLike } from '../../api/functions';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import { useFirestore } from '../../hooks/useFirestore';

import { song } from '../../styles';
const useStyles = makeStyles(song);

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
const SongCard = ({
  song,
  playlistSongs,
  songPlaylistLocation,
  songIndex,
  liked,
  user,
  songId = null,
}) => {
  const theme = useTheme();
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
    } else if (playing) {
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
    // xhr.open('GET', song.songURL);
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

      setIsDeleting(false);
    }
  }, [
    cloudStorageResponse.success,
    deleteSongDocument,
    song.docID,
    dispatchAudioPlayerContext,
  ]);

  return (
    <Box className={classes.songItem}>
      <Box className={classes.songItemBody}>
        <div className={classes.songItemHeader}>
          <div className={classes.songItemTitleContainer}>
            <IconButton
              className={classes.titleContainerPlayBtn}
              onClick={handlePlayPauseClick}>
              {playing ? (
                <PauseIcon
                  htmlColor="#fff"
                  fontSize="large"
                />
              ) : (
                <PlayArrowIcon
                  htmlColor="#fff"
                  fontSize="large"
                />
              )}
            </IconButton>

            <div className={classes.titleContainerSongTitle}>
              <NavLink
                to={`/profile/${song?.profileURL || ''}`}
                style={{ textDecoration: 'none' }}>
                <span className={classes.titleContainerSongTitleArtist}>
                  {song?.artist}
                </span>
              </NavLink>
              <span className={classes.titleContainerSongTitleTitle}>
                {song?.title}
              </span>
            </div>
            <div className={classes.titleContainerAdditional}>
              <div className={classes.titleContainerAdditionalDateContainer}>
                <span
                  className={classes.titleContainerAdditionalUploadDate}
                  style={{ width: '20px !important' }}>
                  {/* {song && new Date(song?.createdAt['_seconds'])} */}
                </span>
              </div>
              <div className={classes.titleContainerAdditionalGenreContainer}>
                <span className={classes.titleContainerAdditionalGenre}>
                  {song?.genre}
                </span>
              </div>
            </div>
          </div>
        </div>
        <AudioSeekControlBar
          className={classes.songItemSeekControl}
          durationClassName={classes.songItemDuration}
          duration={song?.duration}
          played={played}
          onChange={handleSeekChange}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={handleSeekMouseUp}
        />

        <div className={classes.songItemAside}>
          <div className={classes.songItemSongPhotoContainer}>
            <img
              className={classes.songPhotoContainerImg}
              src={song?.songPhotoURL ? song?.songPhotoURL : placeholderImage}
              alt="Song Cover Art"
            />
          </div>
        </div>
      </Box>{' '}
      <div className={classes.songItemFooter}>
        <div className={classes.songItemActionContainer}>
          <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
            <IconButton
              className={`${classes.actionContainerBtn} ${
                isLiked && user.uid && classes.actionContainerLikeBtnLiked
              } `}
              onClick={handleLikeClick}
              disabled={isProcessingLike}>
              {isProcessingLike ? (
                <CircularProgress
                  size={18}
                  className={classes.spinner}
                />
              ) : isLiked ? (
                <FavoriteIcon htmlColor={theme.palette.primary.main} />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Download">
            <IconButton
              className={classes.actionContainerBtn}
              onClick={handleSongDownloadClick}>
              <FileDownloadOutlinedIcon />
            </IconButton>
          </Tooltip>

          {user?.uid === song?.userID && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  className={classes.actionContainerBtn}
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}>
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  className={classes.actionContainerBtn}
                  onClick={() => setIsDeleting(true)}
                  disabled={isDeleting}>
                  <DeleteForeverOutlinedIcon />
                </IconButton>
              </Tooltip>
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
    </Box>
  );
};

export default SongCard;
