import React, { useEffect, useReducer, useRef } from 'react';
import ReactPlayer from 'react-player/file';
import { makeStyles } from '@mui/styles';

import { useAudioPlayerContext } from '../../hooks/useAudioPlayerContext';
import AudioSeekControlBar from './AudioSeekControlBar/AudioSeekControlBar';
import AudioPlayerMarquee from './AudioPlayerMarquee';
import { IconButton } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import placeholderImage from '../../images/blank_image_placeholder.svg';
import theme from '../../theme';
import { Slider, Stack } from '@mui/material';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
const useStyles = makeStyles((theme) => ({
  audioPlayerLower: {
    display: 'flex',
    gap: '1rem',
    background: '#313132',
    padding: '0.2rem',
  },
  audioPlayerControlsSeek: {
    display: 'none',
  },
  audioPlayerControlsMainPrevious: {
    display: 'none',
  },
  audioPlayerControlsMainNext: {
    display: 'none',
  },
  audioPlayerControlsVolume: {
    display: 'none',
  },
  audioPlayerControlsMain: {
    order: 2,
  },
  audioPlayerControlsMainPlay: {
    marginLeft: '0.6rem',
    background: 'none',
    border: 'none',
  },
  audioPlayerTrackDetails: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: '1 0 auto',
    order: 1,
  },
  audioPlayerTrackDetailsSongArt: {
    width: '3.6rem',
    height: 'auto',
  },
  audioPlayerTrackDetailsSongArtImage: {
    width: '100%',
    height: '100%',
  },
  audioPlayerTrackDetailsSongDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 'inherit',
    textOverflow: 'ellipsis',
    justifyContent: 'center',
    gap: '0.2rem',
    maxWidth: '17rem',
    minWidth: '16rem',
    marginLeft: '0.8rem',
  },
  audioPlayerTrackDetailsSongDetailsTitle: {
    fontWeight: 400,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: '1.4rem',
    color: '#ffffff',
    overflow: 'hidden',
  },
  audioPlayerTrackDetailsSongDetailsArtist: {
    fontWeight: 400,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: '1.4rem',
    color: '#ffffff',
    opacity: 0.5,
  },
  '@media only screen and (min-width: 992px) and (min-device-height: 768px) and (orientation: landscape)':
    {
      audioPlayer: {
        // padding: "2rem 0 0 1rem",
        // max-width: "100%",
        maxHeight: '20.6rem',
        position: 'relative',
        margin: '0 auto',
        padding: '',
      },
      audioPlayerUpper: {
        maxWwidth: '23rem',
        height: '15rem',
        position: 'relative',
        zIndex: 0,
        background: '#313132',
        borderRadius: '2.5rem',
        margin: 'inherit',
      },
      audioPlayerLower: {
        display: 'block',
        maxWidth: '26rem',
        height: '14.6rem',
        padding: '0',
        gap: '0',
        position: 'relative',
        zIndex: 1,
        top: '-9rem',
        margin: 'inherit',
        background: 'linear-gradient(180deg, #725bcf 0%, #a99ae5 100%)',
        borderRadius: '2.5rem',
      },
      audioPlayerControls: {
        display: 'flex',
        flexDirection: 'column',
      },
      audioPlayerControlsSeek: {
        display: 'flex',
        gap: '0.6rem',
        justifyContent: 'center',
        margin: '2.4rem auto',
        width: '100%',
        opacity: 'none',
      },
      audioPlayerControlsSeekDuration: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: theme.typography.body3.fontSize,
        lineHeight: '1.5rem',
        color: '#ffffff',
        width: '10%',
      },
      audioPlayerControlsMain: {
        display: 'flex',
        gap: '0.8rem',
        justifyContent: 'center',
      },
      audioPlayerControlsMainPrevious: {
        display: 'block',
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
      },
      audioPlayerControlsMainNext: {
        display: 'block',
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
      },
      audioPlayerControlsMainPlay: {
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        top: '-1.6rem',
        position: 'absolute',
        zIndex: 2,
        border: '6px solid #313132 !important',
        background:
          'linear-gradient(180deg, #725bcf 0%, #a99ae5 100%) !important',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25) !important',
        borderRadius: '3.6rem',
        '&:hover': {
          cursor: 'pointer',
        },
        '& svg': {
          fontSize: '2rem', // Adjust the icon size
          color: '#fff', // Adjust the icon color
        },
      },

      audioPlayerControlsVolume: {
        display: 'flex',
        gap: '0.2rem',
        justifyContent: 'center',
        maxWidth: '100%',
        padding: '0 3.2rem',
      },
      audioPlayerControlsVolumeInput: {
        cursor: 'pointer',
      },
      audioPlayerTrackDetails: {
        justifyContent: 'flex-start',
        margin: '0.6rem 0 0 1.4rem',
      },
      audioPlayerTrackDetailsSongArt: {
        width: '5rem',
        height: '5rem',
      },
      audioPlayerTrackDetailsSongArtImage: {
        borderRadius: '12px',
      },
      audioPlayerTrackDetailsSongDetails: {
        gap: '0.4rem',
      },
      audioPlayerTrackDetailsSongDetailsTitle: {
        lineHeight: '1.7rem',
      },
      audioPlayerTrackDetailsSongDetailsArtist: {
        lineHeight: '1.7rem',
      },
    },
  '@media only screen and (min-width: 1600px)': {
    // Extra large devices (large laptops and desktops, 1200px and up)
  },
}));
let initialState = {
  url: null,
  playing: false,
  volume: localStorage.getItem('volume')
    ? parseFloat(localStorage.getItem('volume'))
    : 0.5,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  loop: false,
  seeking: false,
};

const audioPlayerReducer = (state, action) => {
  switch (action.type) {
    case 'PLAY_PAUSE_CLICK':
      return { ...state, playing: !state.playing };
    case 'VOLUME_CHANGE':
      return { ...state, volume: action.payload };
    case 'SEEK_POSITION_CHANGE':
      return { ...state, played: action.payload };
    case 'SEEK_MOUSE_DOWN':
      return { ...state, seeking: true };
    case 'SEEK_MOUSE_UP':
      return { ...state, seeking: false };
    case 'PROGRESS_CHANGE':
      return { ...state, ...action.payload };
    case 'DURATION_CHANGE':
      return { ...state, duration: action.payload };
    case 'LOAD_SONG':
      return { ...state, ...action.payload };
    case 'PLAY':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    default:
      return { ...state };
  }
};
//Component function
const AudioPlayer = () => {
  const classes = useStyles(theme);

  //Reducer
  const [audioPlayerState, dispatchAudioPlayerState] = useReducer(
    audioPlayerReducer,
    initialState
  );
  //Destructure our reducer state
  const {
    url,
    playing,
    volume,
    muted,
    played,

    duration,

    seeking,
  } = audioPlayerState;
  //Ref to ReactPlayer
  const player = useRef();
  //Audio player context
  const {
    loadedSongURL,
    dispatchAudioPlayerContext,
    isSongPlaying,
    playlistEnded,
    playlistIndex,
    playlist,
    currentSongPlayedTime,
    seekingFromSongItem,
    seekingFromSongItemComplete,
  } = useAudioPlayerContext();
  // const { getDocument: getArtistName, response: getArtistNameResponse } =
  //   useFirestore("users");

  //Function to load songs
  const load = (url) => {
    dispatchAudioPlayerState({
      type: 'LOAD_SONG',
      payload: { url, played: 0, loaded: 0 },
    });
  };

  const handlePlayPause = () => {
    if (isSongPlaying) {
      dispatchAudioPlayerContext({ type: 'SONG_PAUSED' });
    } else {
      dispatchAudioPlayerContext({ type: 'SONG_PLAYED' });
    }
    dispatchAudioPlayerState({ type: 'PLAY_PAUSE_CLICK' });
  };

  const handlePreviousClick = () => {
    const elapsedTime = duration * played;
    if ((elapsedTime < 4 || !isSongPlaying) && playlistIndex !== 0) {
      dispatchAudioPlayerContext({ type: 'LOAD_PREVIOUS_SONG' });
    } else {
      dispatchAudioPlayerContext({
        type: 'SEEK_POSITION_CHANGE',
        payload: 0.0,
      });
      player.current.seekTo(0.0);
    }
  };

  const handleNextClick = () => {
    if (playlistIndex < playlist.length - 1) {
      dispatchAudioPlayerContext({ type: 'LOAD_NEXT_SONG' });
    } else {
      dispatchAudioPlayerContext({ type: 'PLAYLIST_ENDED' });
    }
  };
  const handleVolumeChange = (event) => {
    dispatchAudioPlayerState({
      type: 'VOLUME_CHANGE',
      payload: parseFloat(event.target.value),
    });
  };
  const handlePlay = () => {
    dispatchAudioPlayerContext({ type: 'SONG_PLAYED' });
    dispatchAudioPlayerState({ type: 'PLAY' });
  };
  const handlePause = () => {
    dispatchAudioPlayerContext({ type: 'SONG_PAUSED' });
    dispatchAudioPlayerState({ type: 'PAUSE' });
  };
  const handleAudioStart = () => {
    if (playlistEnded) {
      handlePause();
    } else {
      handlePlay();
    }
  };
  const handleSeekMouseDown = (event) => {
    dispatchAudioPlayerContext({ type: 'SEEK_MOUSE_DOWN_FROM_AUDIO_PLAYER' });
    dispatchAudioPlayerState({ type: 'SEEK_MOUSE_DOWN' });
  };

  const handleSeekChange = (event) => {
    dispatchAudioPlayerState({
      type: 'SEEK_POSITION_CHANGE',
      payload: parseFloat(event.target.value),
    });
  };

  const handleSeekMouseUp = (event) => {
    dispatchAudioPlayerContext({
      type: 'SEEK_MOUSE_UP_FROM_AUDIO_PLAYER',
      payload: parseFloat(event.target.value),
    });
    dispatchAudioPlayerState({ type: 'SEEK_MOUSE_UP' });

    player.current.seekTo(parseFloat(event.target.value));
  };

  const handleProgress = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      dispatchAudioPlayerContext({
        type: 'PLAYED_TIME_CHANGE',
        payload: state.played,
      });
      dispatchAudioPlayerState({ type: 'PROGRESS_CHANGE', payload: state });
    }
  };
  const handleDuration = (songDuration) => {
    dispatchAudioPlayerState({
      type: 'DURATION_CHANGE',
      payload: songDuration,
    });
  };
  //THIS FUNCTION NEEDS TO CHECK WHETHER WE HAVE MORE TRACKS TO PLAY OR THIS IS THE LAST SONG
  const handleEnded = () => {
    // dispatchAudioPlayerState({ playing: false });
    //Calls the handleNextClick function which has the same
    //Functionality as this would have
    handleNextClick();
  };
  //This will load the song whenever the loadedSongURL changes
  useEffect(() => {
    if (loadedSongURL) {
      load(loadedSongURL);
    }
  }, [loadedSongURL]);

  //This useEffect is used to receive messages from the a songItem component
  // If a SongItem component pauses/plays the audio this will fire..
  // Or if the state of the AudioPlayerContext changes..
  useEffect(() => {
    if (!isSongPlaying && playing) {
      dispatchAudioPlayerState({ type: 'PAUSE' });
    } else if (isSongPlaying && !playing) {
      dispatchAudioPlayerState({ type: 'PLAY' });
    }
  }, [isSongPlaying, playing]);

  //This useEffect is used to store the user's volume settings in localStorage when it changes.
  useEffect(() => {
    localStorage.setItem('volume', volume);
  }, [volume]);

  //This is used when a SongItem sends us a position to seek to,
  // It causes the AudioPlayer to scrub through the song
  useEffect(() => {
    if (seekingFromSongItem) {
      dispatchAudioPlayerState({ type: 'SEEK_MOUSE_DOWN' });
      dispatchAudioPlayerState({
        type: 'SEEK_POSITION_CHANGE',
        payload: parseFloat(currentSongPlayedTime),
      });
      player.current.seekTo(parseFloat(currentSongPlayedTime));
    }
  }, [currentSongPlayedTime, seekingFromSongItem, dispatchAudioPlayerContext]);

  // When a user lifts their mouse from a SongItem seek change,
  // This will trigger in order to stop seeking in the audio player
  useEffect(() => {
    if (seekingFromSongItemComplete && seeking) {
      dispatchAudioPlayerContext({ type: 'SEEK_FROM_SONG_ITEM_COMPLETE' });
      dispatchAudioPlayerState({ type: 'SEEK_MOUSE_UP' });
    }
  }, [
    currentSongPlayedTime,
    dispatchAudioPlayerContext,
    seeking,
    seekingFromSongItemComplete,
  ]);

  // useEffect(() => {
  //   if (url) {
  //     getArtistName(playlist[playlistIndex].artist);
  //   }
  // }, [url]);

  return (
    <div className={classes.audioPlayer}>
      <ReactPlayer
        ref={player}
        width={0}
        height={0}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onStart={handleAudioStart}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />

      <div className={classes.audioPlayerUpper}>
        <div className={classes.audioPlayerControls}>
          <AudioSeekControlBar
            className={classes.audioPlayerControlsSeek}
            durationClassName={classes.audioPlayerControlsSeekDuration}
            duration={duration}
            played={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>

      <div className={classes.audioPlayerLower}>
        <div className={classes.audioPlayerControlsMain}>
          <IconButton
            disabled={!loadedSongURL}
            className={classes.audioPlayerControlsMainPrevious}
            onClick={handlePreviousClick}
            aria-label="previous">
            <SkipPreviousIcon htmlColor="#ffffff" />
          </IconButton>
          <IconButton
            disabled={!loadedSongURL}
            onClick={handlePlayPause}
            className={classes.audioPlayerControlsMainPlay}
            aria-label={playing ? 'pause' : 'play'}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            disabled={!loadedSongURL}
            className={classes.audioPlayerControlsMainNext}
            onClick={handleNextClick}
            aria-label="next">
            <SkipNextIcon htmlColor="#ffffff" />
          </IconButton>
        </div>

        <Stack
          className={classes.audioPlayerControlsVolume}
          spacing={1}
          direction="row"
          sx={{}}
          alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            min={0}
            st
            step="any"
            max={1}
            value={volume}
            onChange={handleVolumeChange}
          />
          <VolumeUp />
        </Stack>

        <div className={classes.audioPlayerTrackDetails}>
          <div className={classes.audioPlayerTrackDetailsSongArt}>
            <img
              className={classes.audioPlayerTrackDetailsSongArtImage}
              src={
                loadedSongURL && playlist[playlistIndex].songPhotoURL
                  ? playlist[playlistIndex].songPhotoURL
                  : placeholderImage
              }
              alt="Song Cover Art"
              width="64"
              height="64"
            />
          </div>
          <div className={classes.audioPlayerTrackDetailsSongDetails}>
            <AudioPlayerMarquee
              className={classes.audioPlayerTrackDetailsSongDetailsTitle}>
              {loadedSongURL && playlist[playlistIndex].title}
            </AudioPlayerMarquee>
            <p className={classes.audioPlayerTrackDetailsSongDetailsArtist}>
              {loadedSongURL && playlist[playlistIndex].artist}
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AudioPlayer;
