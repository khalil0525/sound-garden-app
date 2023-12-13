import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';

import Modal from '../../components/UI/Modal/Modal';

import { useAuthContext } from '../../hooks/useAuthContext';

import { makeStyles } from '@mui/styles';
import PlaylistResults from '../../components/PlaylistResults/PlaylistResults';

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

const Playlists = () => {
  const classes = useStyles();
  const { user } = useAuthContext();
  const [playlists, setPlaylists] = useState(samplePlaylists);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const query = ['playlists', ['userID', '==', user.uid]];
  useEffect(() => {}, []);

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

  // const handleDeletePlaylist = (playlistId) => {};

  // const handleEditPlaylist = (playlistId, updatedName) => {};

  return (
    <div className={classes.playlistsContainer}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreatingPlaylist(true)}
        className={classes.createButton}>
        Create Playlist
      </Button>
      {user && user.uid && <PlaylistResults query={query} />}
      {/* Playlist Creation Modal */}
      {isCreatingPlaylist && (
        <Modal
          isOpen={isCreatingPlaylist}
          action="createPlaylist"
          onConfirm={handleCreatePlaylist}
          onCancel={() => setIsCreatingPlaylist(false)}
        />
      )}
    </div>
  );
};

export default Playlists;
