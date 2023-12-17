import React, { useEffect, useReducer, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { IconButton, Box, Avatar, Menu, MenuItem } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import { useNavigate } from 'react-router-dom';
import Duration from '../AudioPlayer/AudioSeekControlBar/Duration';
import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import theme from '../../theme';
import { NavLink } from 'react-router-dom';
import { ReactComponent as MenuIcon } from '../../images/menuicon.svg';
import { useFirestore } from '../../hooks/useFirestore';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
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
      maxWidth: '100%',
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
    flex: '0 1 auto',
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
    cursor: 'pointer',
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
      width: '4rem',
      height: '4rem',
    },
  },
  songPhotoContainerImg: {
    width: '8rem',
    height: '8rem',
    [theme.breakpoints.down('sm')]: {
      width: '4rem',
      height: '4rem',
    },
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

const MiniSongItem = ({
  song,
  playlistSongs,
  songPlaylistLocation,
  songIndex,
  profileURL,
}) => {
  const navigate = useNavigate();
  const classes = useStyles(theme);

  const [songItemState, dispatchSongItemState] = useReducer(
    songItemReducer,
    initialState
  );

  const { playing, isMounted, seeking } = songItemState;
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

  const [menuOpen, setMenuOpen] = useState(null);

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

  const handleMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleMenuItemClick = (action) => {
    // Handle the action (e.g., Like or Repost)
    console.log(`Clicked: ${action}`);

    // Close the menu
    setMenuOpen(null);
  };

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
                style={{ color: theme.palette.text.secondary }}
                onClick={() =>
                  navigate(`/song/${song?.docID}`, {
                    state: {
                      song,
                      playlistSongs,
                      songPlaylistLocation,
                      songIndex,
                    },
                  })
                }>
                {song.title}
              </span>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                }}>
                <NavLink
                  to={`/profile/${profileURL}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                  <Avatar sx={{ width: 24, height: 24 }}></Avatar>
                  <span className={classes.titleContainerSongTitleArtist}>
                    {song.artist}
                  </span>
                </NavLink>

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
            <IconButton
              onClick={handleMenuOpen}
              style={{ color: '#000' }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuOpen}
              open={Boolean(menuOpen)}
              onClose={() => setMenuOpen(null)}>
              <MenuItem
                onClick={() => handleMenuItemClick('Like')}
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}>
                <FavoriteIcon className={classes.likeButton} /> Like
              </MenuItem>
              <MenuItem
                onClick={() => handleMenuItemClick('Repost')}
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}>
                <RepeatIcon className={classes.repostButton} /> Repost
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </li>
  );
};

export default MiniSongItem;
