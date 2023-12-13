import React, { useState, useEffect } from 'react';

import PlaylistList from '../../components/PlaylistList/PlaylistList';

import { useCollection } from '../../hooks/useCollection';

import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  playlistsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  createButton: {
    marginBottom: theme.spacing(2),
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: theme.spacing(3),
    borderRadius: '8px',
  },
  modalInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));
const samplePlaylists = [
  { id: 1, name: 'Playlist 1' },
  { id: 2, name: 'Playlist 2' },
  { id: 3, name: 'Playlist 3' },
];

const PlaylistResults = ({ query }) => {
  const classes = useStyles();

  const [playlists, setPlaylists] = useState(samplePlaylists);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const { documents: playlistDocuments } = useCollection(...query);

  const handleCreatePlaylist = () => {
    setIsCreatingPlaylist(false);
    if (newPlaylistName.trim() !== '') {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
      };
      setPlaylists([...playlists, newPlaylist]);

      setNewPlaylistName('');
    }
  };

  const handleDeletePlaylist = (playlistId) => {};

  const handleEditPlaylist = (playlistId, updatedName) => {};

  return (
    <div className={classes.playlistsContainer}>
      {' '}
      {playlistDocuments?.length ? (
        <PlaylistList
          playlists={playlistDocuments}
          onDelete={handleDeletePlaylist}
          onEdit={handleEditPlaylist}
        />
      ) : (
        <Typography>No playlists found!</Typography>
      )}
    </div>
  );
};

export default PlaylistResults;
