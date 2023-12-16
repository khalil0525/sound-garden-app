import React from 'react';
import { makeStyles } from '@mui/styles';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  playlistItem: {
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'none',
  },
  playlistImage: {
    width: '100%',
    maxHeight: '160px',
    objectFit: 'cover',
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  playlistName: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1),
    },
    playlistDisplayName: {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 400,
      lineHeight: '1.6rem',
      color: '#999',
    },
    editButton: {
      color: '#4caf50',
    },
    deleteButton: {
      color: '#f44336',
    },
  },
}));

const PlaylistItem = ({ playlist, playlistDisplayName }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <div
      className={classes.playlistItem}
      onClick={() =>
        navigate(`/playlist/${playlist.docID}`, { state: { playlist } })
      }>
      <img
        src={playlist.playlistPhotoURL || 'https://picsum.photos/300/300'}
        alt={playlist.playlistName}
        className={classes.playlistImage}
      />
      <div className={classes.playlistName}>{playlist.playlistName}</div>
      <NavLink
        to={`/profile/${playlist.profileURL}`}
        style={{ textDecoration: 'none' }}
        className={classes.playlistDisplayName}>
        <span>{playlistDisplayName}</span>
      </NavLink>
    </div>
  );
};

export default PlaylistItem;
