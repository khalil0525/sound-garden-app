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
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false); // State for controlling the modal
  const query = ['playlists', ['userID', '==', user.uid]];
  useEffect(() => {
    // Fetch playlists when the component mounts
    // Implement your data fetching logic here and set playlists with the result
  }, []);

  const handleCreatePlaylist = () => {
    setIsCreatingPlaylist(false);
    if (newPlaylistName.trim() !== '') {
      // Implement your createPlaylist logic here
      // After creating a playlist, refresh the list
      // For now, let's add a new playlist with the entered name
      const newPlaylist = {
        id: Date.now(), // You can generate a unique ID
        name: newPlaylistName,
      };
      setPlaylists([...playlists, newPlaylist]);

      setNewPlaylistName(''); // Clear the input field
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    // Implement your deletePlaylist logic here
    // After deleting a playlist, refresh the list
  };

  const handleEditPlaylist = (playlistId, updatedName) => {
    // Implement your editPlaylist logic here
    // After editing a playlist, refresh the list
  };

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
