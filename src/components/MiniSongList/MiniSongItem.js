import React, { useEffect, useReducer } from 'react';

import { makeStyles } from '@mui/styles';

import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { ReactComponent as MenuIcon } from '../../images/menuicon.svg';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import placeholderImage from '../../images/blank_image_placeholder.svg';

import Duration from '../AudioPlayer/AudioSeekControlBar/Duration';
import { IconButton, Box, Avatar } from '@mui/material';
import theme from '../../theme';
const useStyles = makeStyles((theme) => ({
  songItem: {
    padding: '1.2rem 0.6rem',
    width: '100%',
    display: 'flex',
  },
  songItemBody: {
    width: '100%',
    display: 'flex',
  },
  songItemBodyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleContainerContainer: {
    display: 'flex',
    gap: '0.8rem',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '60%',
    },
  },
  titleContainerPlayBtn: {
    alignSelf: 'center',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    backgroundColor: `${theme.palette.primary.main} !important`,
    width: '4rem',
    height: '4rem',
    border: 'none',
    boxShadow: '0 1px rgba(15, 15, 15, 0.5)',
    margin: '0 0.2rem 0 1rem',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
    justifyContent: 'center',
    marginLeft: '1.6rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0.4rem',
    },
  },
  titleContainerSongTitleArtist: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 400,
    lineHeight: '1.6rem',
    color: theme.palette.subtleAccent.main,
  },
  titleContainerSongTitleGenre: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 400,
    color: theme.palette.subtleAccent.main,
    textTransform: 'capitalize',
  },
  titleContainerSongTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  songItemRightSide: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '3.2rem',
    [theme.breakpoints.down('sm')]: {
      gap: '1.6rem',
    },
  },
  songItemSongPhotoContainer: {
    width: '8rem',
    height: '8rem',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
      width: '4rem',
      height: '4rem',
    },
  },
  songPhotoContainerImg: {
    width: '100%',
    height: '100%',
    borderRadius: '14px',
    boxShadow: `inset 0 0 0 1px ${theme.palette.background.default}`,
  },
  songItemDuration: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: theme.typography.body1.fontSize,
    lineHeight: '1.9rem',
    color: theme.palette.text.secondary,

    [theme.breakpoints.down('sm')]: {
      display: 'none',
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
  showSongItemFooter = true,
}) => {
  const classes = useStyles(theme);

  const [songItemState, dispatchSongItemState] = useReducer(
    songItemReducer,
    initialState
  );

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

  const { deleteDocument: deleteSongDocument } = useFirestore('music');

  const { response: cloudStorageResponse } = useCloudStorage();

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
  };

  useEffect(() => {
    if (loadedSongURL === song.songURL && !isMounted) {
      dispatchSongItemState({ type: 'SONG_MOUNTED' });
    } else if (loadedSongURL !== song.songURL && isMounted) {
      dispatchSongItemState({ type: 'SONG_DISMOUNTED' });
    }
  }, [loadedSongURL, song.songURL, isMounted, song.title]);

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

  return (
    <li className={classes.songItem}>
      <Box className={classes.songItemBody}>
        <Box className={classes.songItemBodyContainer}>
          <Box className={classes.titleContainerContainer}>
            <Box className={classes.songItemSongPhotoContainer}>
              <img
                className={classes.songPhotoContainerImg}
                src={song.songPhotoURL ? song.songPhotoURL : placeholderImage}
                alt="Song Cover Art"
              />
            </Box>

            <Box className={classes.titleContainer}>
              <span
                className={classes.titleContainerSongTitle}
                style={{ color: theme.palette.text.secondary }}>
                {song.title}
              </span>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                }}>
                <Avatar sx={{ width: 24, height: 24 }}></Avatar>
                <span className={classes.titleContainerSongTitleArtist}>
                  {song.artist}
                </span>
                <FiberManualRecordRoundedIcon
                  sx={{ width: '0.4rem' }}
                  htmlColor="#C4C4C4"
                />
                <span className={classes.titleContainerSongTitleGenre}>
                  {song.genre}
                </span>
              </Box>
            </Box>
          </Box>
          <Box className={classes.songItemRightSide}>
            <Duration
              className={classes.songItemDuration}
              seconds={song.duration * (1 - songItemState.played)}
            />
            <IconButton
              className={classes.titleContainerPlayBtn}
              onClick={handlePlayPauseClick}
              style={{ color: 'white' }}>
              {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <MenuIcon />
          </Box>
        </Box>
      </Box>
    </li>
  );
};

export default SongItem;
