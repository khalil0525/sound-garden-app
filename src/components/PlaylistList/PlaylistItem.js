import React from 'react';
import { makeStyles } from '@mui/styles';

import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  playlistItem: {
    display: 'flex',
    alignItems: 'center',
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
  },
  playlistName: {
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
    editButton: {
      color: '#4caf50',
    },
    deleteButton: {
      color: '#f44336',
    },
  },
}));

const PlaylistItem = ({ playlist }) => {
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
      12{' '}
    </div>
  );
};

export default PlaylistItem;
