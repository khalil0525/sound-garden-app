import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { NavLink } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  playlistCard: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridTemplateRows: '1fr 1fr',
    width: '100%',
    alignItems: 'start',
    gap: '0.4rem',
    listStyle: 'none',
    borderRadius: '1.4rem',
    marginTop: '1.6rem',
    backgroundColor: 'silver',
    padding: '1.6rem ',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '5fr 1fr',
      gridTemplateRows: '1fr 1fr',
      justifyContent: 'flex-start',
      padding: '2rem',
    },
  },
  playlistCardTitleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  titleContainerPlayBtn: {
    alignSelf: 'center',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    background: `${theme.palette.primary.main} !important`,
    width: '3.6rem',
    height: '3.6rem',
    border: 'none',
    boxShadow: '0 1px rgba(15, 15, 15, 0.5)',
    margin: '0 0.2rem 0 1rem',
    order: 2,

    [theme.breakpoints.up('md')]: {
      order: 0,
      width: '4.8rem',
      height: '4.8rem',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  titleContainerSongTitle: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
    justifyContent: 'center',
  },
  titleContainerSongTitleTitle: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: 1.2,
    fontWeight: 500,
    color: '#333',
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    opacity: 1,
    borderRadius: '0',
    boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
  },
  playlistImgContainer: {
    gridColumn: '2/-1',
    gridRow: '1/-1',
    width: '8rem',
    height: '8rem',

    [theme.breakpoints.up('sm')]: {
      width: '12rem',
      height: '12rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '12rem',
      height: '12rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '24rem',
      height: '24rem',
    },
  },
  playlistName: {
    flexGrow: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
}));

const PlaylistCard = ({ playlist, onDelete, onEdit }) => {
  const classes = useStyles();

  return (
    <Box className={classes.playlistCard}>
      <div className={classes.playlistCardHeader}>
        <div className={classes.playlistCardTitleContainer}>
          <IconButton className={classes.titleContainerPlayBtn}>
            {true ? (
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
              to={`/profile/${playlist?.profileURL || ''}`}
              style={{ textDecoration: 'none' }}>
              {/* <span className={classes.titleContainerSongTitleArtist}>
                {song?.artist}
              </span> */}
            </NavLink>
            <span className={classes.titleContainerSongTitleTitle}>
              {playlist?.playlistName}
            </span>
          </div>
        </div>
      </div>
      <Box className={classes.playlistImgContainer}>
        <img
          component="img"
          alt={playlist.playlistName}
          src={playlist.playlistPhotoURL || 'https://picsum.photos/300/300'}
          className={classes.playlistImage}
        />
      </Box>
    </Box>
  );
};

export default PlaylistCard;
