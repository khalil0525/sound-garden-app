import React, { useEffect, useReducer, useState } from 'react';
import styles from './SongItem.module.css';
import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import AudioSeekControlBar from '../AudioPlayer/AudioSeekControlBar/AudioSeekControlBar';

import placeholderImage from '../../images/blank_image_placeholder.svg';

import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { ReactComponent as HeartIcon } from '../../images/Heart_greyfill.svg';
import Modal from '../UI/Modal/Modal';
import { IconButton } from '@mui/material';
import { addLike, removeLike } from '../../api/functions';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  songItem: {
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  songItemHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  playBtn: {
    marginRight: theme.spacing(2),
  },
  songTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  songTitle: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
  },
  additional: {
    display: 'flex',
    flexDirection: 'column',
  },
  additionalDateContainer: {
    marginBottom: theme.spacing(1),
  },
  additionalUploadDate: {
    color: theme.palette.text.secondary,
  },
  additionalGenreContainer: {},
  additionalGenre: {
    color: theme.palette.text.secondary,
  },
  songItemSeekControl: {
    marginTop: theme.spacing(2),
  },
  songItemDuration: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  songItemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  actionContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  btn: {
    fontSize: '0.8rem',
  },
  btnLiked: {
    color: theme.palette.primary.main,
  },
  btnDownload: {
    color: theme.palette.success.main,
  },
  btnEdit: {
    color: theme.palette.warning.main,
  },
  btnDelete: {
    color: theme.palette.error.main,
  },
  songItemAside: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songPhotoContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  songPhotoContainerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));
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
  const classes = useStyles();

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

  // New like system

  // We set the inital state for isLiked based on if that document was found
  const [isLiked, setIsLiked] = useState(() => liked);

  // These 2 hooks are used to delete a song document/files
  const { deleteDocument: deleteSongDocument } = useFirestore('music');

  const { deleteSongFiles, response: cloudStorageResponse } = useCloudStorage();
  //***********************************************************
  // We only change playlists when we click play on a song
  // that is not apart of the current playlist.
  // If we are on any other page and the current loadedSongURL
  // is attached to a component on that page, the playlist will
  // Still reference the playlist in the component we started
  // the song at. However, we will be able to Play/pause the track
  // from that other page
  //***********************************************************

  const handlePlayPauseClick = () => {
    if (loadedSongURL !== song.songURL) {
      //If we are on the same playlist but not playing the current song
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
    // Or inserted into an <img> element
    // const img = document.getElementById("myimg");
    // img.setAttribute("src", url);
  };

  const handleEditSong = () => {
    setIsEditing(false);
  };

  const handleDeleteSong = async () => {
    deleteSongFiles(song);
  };

  // const handleLikeClick = () => {

  //   // if (user.uid) {
  //   //   setIsLiked((prevState) => !prevState);
  //   //   let newState;
  //   //   if (!isLiked) {
  //   //     newState = { likes: [...liked, song.docID] };
  //   //     updateLikedDocument(user.uid, newState);
  //   //   } else {
  //   //     newState = { likes: liked.filter((like) => like !== song.docID) };
  //   //     updateLikedDocument(user.uid, newState);
  //   //   }
  //   // }
  // };

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

  // MOUNT THE SONG WHEN WE PLAY IT OR SWITCH BACK TO A PLACE THIS COMPONENT
  // IS AT.
  // OR DISMOUNT IF THIS WAS THE PREVIOUS SONG AND WE CHANGED
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

  // When we press pause from the AudioPlayer this will be triggered to activate
  // The play state inside of the songItem
  useEffect(() => {
    // If globally no song is playing OR song was changed and this songItem isPlaying
    // Set isPlaying to false.
    if ((!isSongPlaying || !isMounted) && playing) {
      // if ((!isSongPlaying || loadedSongURL !== song.songURL) && isPlaying) {

      dispatchSongItemState({ type: 'PAUSE' });
      // setIsPlaying(false);
    }
    //Otherwise, if globally a song is playing and the URL is this songs
    //
    else if (isSongPlaying && isMounted && !playing) {
      // else if (isSongPlaying && loadedSongURL === song.songURL && !isPlaying) {

      dispatchSongItemState({ type: 'PLAY' });
      // setIsPlaying(true);
    }
  }, [loadedSongURL, isSongPlaying, playing, isMounted, song.title]);

  // When we edit a song this will ensure that we get a new version of our playlist
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
  // This useEffect fires if we delete the song and get a success message back
  // It will then delete the likes on this song and then the song document itself.
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

  return (
    <li className={styles['songItem']}>
      <div className={styles['songItem__header']}>
        <div className={styles['songItem__titleContainer']}>
          <IconButton
            className={`${styles['titleContainer__playBtn']} `}
            onClick={handlePlayPauseClick}
            altText={
              playing ? 'Song pause button icon' : 'Song play button icon'
            }>
            {playing ? <PlayArrowIcon /> : <PauseIcon />}
          </IconButton>

          <div className={styles['titleContainer__songTitle']}>
            <span className={styles['titleContainer__songTitle-artist']}>
              {song.artist}
            </span>
            <span className={styles['titleContainer__songTitle-title']}>
              {song.title}
            </span>
          </div>
          <div className={styles['titleContainer__additional']}>
            <div className={styles['titleContainer__additional-dateContainer']}>
              <span className={styles['titleContainer__additional-uploadDate']}>
                {song.createdAt}
              </span>
            </div>
            <div
              className={styles['titleContainer__additional-genreContainer']}>
              <span className={styles['titleContainer__additional-genre']}>
                {song.genre}
              </span>
            </div>
          </div>
        </div>
      </div>
      <AudioSeekControlBar
        className={styles['songItem__seekControl']}
        durationClassName={styles['songItem__duration']}
        duration={song.duration}
        played={played}
        onChange={handleSeekChange}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
      />

      <div className={styles['songItem__footer']}>
        <div className={styles['songItem__actionContainer']}>
          <IconButton
            className={`${styles['actionContainer__btn']} ${
              isLiked && user.uid && styles['actionContainer-likeBtn--liked']
            } `}
            onClick={handleLikeClick}
            disabled={isProcessingLike}
            buttonSize="small"
            iconImage={(className) => <HeartIcon alt="Song Like Icon" />}>
            <FavoriteBorderRoundedIcon />
            Like
          </IconButton>
          <IconButton
            className={styles['actionContainer__btn']}
            onClick={handleSongDownloadClick}
            buttonSize="small"
            iconClasses={styles['actionContainer_downloadBtn-icon']}
            altText="Song Download Icon">
            <FileDownloadOutlinedIcon /> Download
          </IconButton>

          {user.uid === song.userID && (
            <>
              <IconButton
                className={`${styles['actionContainer__btn']}`}
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                buttonSize="small"
                iconClasses={styles['actionContainer_editBtn-icon']}
                altText="Song Edit Icon">
                <EditOutlinedIcon />
                Edit
              </IconButton>
              <IconButton
                className={styles['actionContainer__btn']}
                onClick={() => setIsDeleting(true)}
                disabled={isDeleting}
                buttonSize="small"
                iconClasses={styles['actionContainer_deleteBtn-icon']}
                altText="Song Delete Icon">
                <DeleteForeverOutlinedIcon /> Delete
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
      <div className={styles['songItem__aside']}>
        <div className={styles['songItem__songPhotoContainer']}>
          <img
            className={styles['songPhotoContainer-img']}
            src={song.songPhotoURL ? song.songPhotoURL : placeholderImage}
            alt="Song Cover Art"
          />
        </div>
      </div>
    </li>
  );
};

export default SongItem;
