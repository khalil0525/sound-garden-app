import React, { useEffect, useReducer, useState } from 'react';
import styles from './SongItem.module.css';
import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import AudioSeekControlBar from '../AudioPlayer/AudioSeekControlBar/AudioSeekControlBar';
import pauseIcon from '../../images/pause-svgrepo-com.svg';
import playIcon from '../../images/Arrow_drop_right.svg';
import downloadIcon from '../../images/Download.svg';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import editIcon from '../../images/pencil_solid.svg';
import deleteIcon from '../../images/trash_solid.svg';
import { ReactComponent as HeartIcon } from '../../images/Heart_greyfill.svg';
import Modal from '../UI/Modal/Modal';
import Button from '../UI/Button/Button';
import { addLike, removeLike } from '../../api/functions';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme) => ({
  songItem: {
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    gridTemplateRows: '1fr 1fr 1fr',
    width: '100%',
    alignItems: 'center',
    gap: '0.4rem',
    listStyle: 'none',
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'flex-start',
    },
  },
  songItemHeader: {
    gridColumn: '2/-1',
    gridRow: '1',
    [theme.breakpoints.up('lg')]: {
      gridColumn: '2/3',
    },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  playBtn: {
    alignSelf: 'center',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    background: theme.palette.primary.main,
    width: '4rem',
    height: '4rem',
    border: 'none',
    boxShadow: '0 1px rgba(15, 15, 15, 0.5)',
    margin: '0 0.2rem 0 1rem',
    [theme.breakpoints.up('lg')]: {
      gridColumn: '1/2',
      margin: '0',
    },
  },
  songTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  songTitle: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
    justifyContent: 'center',
  },
  songTitleArtist: {
    fontSize: theme.spacing(1.6),
    fontWeight: 400,
    lineHeight: theme.spacing(1.6),
    color: '#999',
  },
  songTitleTitle: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: 1.2,
    fontWeight: 500,
    color: '#333',
  },
  titleContainerAdditional: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      textAlign: 'right',
      gap: '0.4rem',
      marginLeft: '0.5rem',
    },
  },
  titleContainerAdditionalUploadDate: {
    display: 'block',
    color: '#ccc',
    fontSize: theme.spacing(1.6),
    fontWeight: 300,
    lineHeight: theme.spacing(1.6),
    [theme.breakpoints.up('lg')]: {
      marginLeft: '20rem',
    },
  },
  titleContainerAdditionalGenreContainer: {
    display: 'block',
    marginTop: '0.2rem',
    lineHeight: theme.spacing(1.2),
  },
  titleContainerAdditionalGenre: {
    padding: '0 0.6rem',
    fontSize: theme.spacing(1.6),
    fontWeight: 400,
    color: '#fff',
    textTransform: 'uppercase',
    backgroundColor: '#999',
    border: '1px solid #999',
    borderRadius: '2rem',
    height: '1.8rem',
    [theme.breakpoints.up('lg')]: {
      marginLeft: '20rem',
    },
  },
  songItemFooter: {
    display: 'none',
    gridColumn: '2/2',
    gridRow: '3/3',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  actionContainerLikeBtnLiked: {
    boxShadow: '0 0 0 1px ' + theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  songItemAside: {
    gridColumn: '1/1',
    gridRow: '1/-1',
  },
  songItemSongPhotoContainer: {
    width: '8rem',
    height: '8rem',
    [theme.breakpoints.up('md')]: {
      maxWidth: '16rem',
      maxHeight: '16rem',
    },
  },
  songPhotoContainerImg: {
    width: '100%',
    height: '100%',
    opacity: '1',
    borderRadius: '14px',
    boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
  },
  songItemSeekControl: {
    gridRow: '2',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    padding: '1.2rem',
  },
  songItemDuration: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: theme.spacing(1.6),
    lineHeight: theme.spacing(1.9),
    maxWidth: '5%',
    color: '#161618',
  },
  // Media queries
  '@media only screen and (min-width: 992px) and (min-device-height: 768px) and (orientation: landscape)':
    {
      songItem: {
        gridTemplateColumns: '1fr 4fr',
        justifyContent: 'flex-start',
      },
      songItemHeader: {
        gridColumn: '2/3',
        gridRow: '1',
      },
      titleContainerSongTitle: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.4rem',
        justifyContent: 'center',
      },
      titleContainerAdditional: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        textAlign: 'right',
        gap: '0.4rem',
        marginLeft: '0.5rem',
      },
      titleContainerAdditionalUploadDate: {
        marginLeft: '20rem',
        display: 'block',
        color: '#ccc',
        fontSize: theme.spacing(1.6),
        fontWeight: 300,
        lineHeight: theme.spacing(1.6),
      },
      titleContainerAdditionalGenreContainer: {
        display: 'block',
        marginTop: '0.2rem',
        lineHeight: theme.spacing(1.2),
      },
      titleContainerAdditionalGenre: {
        marginLeft: '20rem',
        padding: '0 0.6rem',
        fontSize: theme.spacing(1.6),
        fontWeight: 400,
        color: '#fff',
        textTransform: 'uppercase',
        backgroundColor: '#999',
        border: '1px solid #999',
        borderRadius: '2rem',
        height: '1.8rem',
      },
      songItemFooter: {
        display: 'block',
      },
      songItemActionContainer: {
        display: 'flex',
        gap: '0.5rem',
      },
      songItemActionContainerFirstChild: {
        marginLeft: '1rem',
      },
      actionContainerBtn: {
        background: '#fff',
        border: 'none',
        borderRadius: '0.3rem',
      },
      actionContainerBtnHover: {
        borderColor: '#ccc',
      },
      songItemSongPhotoContainer: {
        maxWidth: '16rem',
        maxHeight: '16rem',
      },
      songItemSeekControl: {
        gridColumn: '2/-1',
      },
      songItemSeekControlInput: {
        width: '100%',
      },
    },
  '@media (min-width: 768px) and (max-width: 991px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
  },
  '@media (min-width: 992px) and (max-width: 1199px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
  },
  '@media (min-width: 1200px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
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
    <li className={classes.songItem}>
      <div className={classes.songItemHeader}>
        <div className={classes.titleContainer}>
          <Button
            className={`${classes.btn} ${classes.playBtn}`}
            onClick={handlePlayPauseClick}
            iconImage={playing ? pauseIcon : playIcon}
            altText={playing ? 'Pause' : 'Play'}
          />
          <div className={classes.songTitleContainer}>
            <div className={classes.songTitle}>
              <span>{song.artist}</span>
              <span>{song.title}</span>
            </div>
            <div className={classes.additional}>
              <div className={classes.additionalDateContainer}>
                <span className={classes.additionalUploadDate}>
                  {song.createdAt}
                </span>
              </div>
              <div className={classes.additionalGenreContainer}>
                <span className={classes.additionalGenre}>{song.genre}</span>
              </div>
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
      {showSongItemFooter && (
        <div className={classes.songItemFooter}>
          <div className={classes.actionContainer}>
            <Button
              className={`${classes.btn} ${
                isLiked && user.uid && classes.btnLiked
              } `}
              onClick={handleLikeClick}
              disabled={isProcessingLike}
              iconImage={(className) => (
                <HeartIcon
                  className={className}
                  alt="Like"
                />
              )}>
              Like
            </Button>
            <Button
              className={`${classes.btn} ${classes.btnDownload}`}
              onClick={handleSongDownloadClick}
              iconImage={downloadIcon}
              altText="Download">
              Download
            </Button>
            {user.uid === song.userID && (
              <>
                <Button
                  className={`${classes.btn} ${classes.btnEdit}`}
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  iconImage={editIcon}
                  altText="Edit">
                  Edit
                </Button>
                <Button
                  className={`${classes.btn} ${classes.btnDelete}`}
                  onClick={() => setIsDeleting(true)}
                  disabled={isDeleting}
                  iconImage={deleteIcon}
                  altText="Delete">
                  Delete
                </Button>
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
      )}
      <div className={classes.songItemAside}>
        <div className={classes.songPhotoContainer}>
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
