import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import PlaylistList from '../../components/PlaylistList/PlaylistList'; // Import the PlaylistList component
// import {
//   createPlaylist,
//   getPlaylists,
//   deletePlaylist,
//   editPlaylist,
// } from './playlistService'; // Implement these functions to interact with your data

const useStyles = makeStyles((theme) => ({
  playlistsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  createPlaylistForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));
const samplePlaylists = [
  {
    id: 1,
    name: 'Workout Playlist',
    description: 'Playlist for your workout sessions.',
    songs: [
      { id: 1, title: 'Song 1', artist: 'Artist 1' },
      { id: 2, title: 'Song 2', artist: 'Artist 2' },
      // Add more songs as needed
    ],
  },
  {
    id: 2,
    name: 'Chill Music',
    description: 'Relaxing music for a lazy day.',
    songs: [
      { id: 3, title: 'Song 3', artist: 'Artist 3' },
      { id: 4, title: 'Song 4', artist: 'Artist 4' },
      // Add more songs as needed
    ],
  },
  // Add more playlists as needed
];

const Playlists = () => {
  const classes = useStyles();
  const [playlists, setPlaylists] = useState(samplePlaylists);

  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    // Fetch playlists when the component mounts
    // getPlaylists().then((data) => setPlaylists(data));
  }, []);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      //   createPlaylist(newPlaylistName).then(() => {
      //     // After creating a playlist, refresh the list
      //     getPlaylists().then((data) => setPlaylists(data));
      //     setNewPlaylistName('');
      //   });
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    // deletePlaylist(playlistId).then(() => {
    //   // After deleting a playlist, refresh the list
    //   getPlaylists().then((data) => setPlaylists(data));
    // });
  };

  const handleEditPlaylist = (playlistId, updatedName) => {
    // editPlaylist(playlistId, updatedName).then(() => {
    //   // After editing a playlist, refresh the list
    //   getPlaylists().then((data) => setPlaylists(data));
    // });
  };

  return (
    <div className={classes.playlistsContainer}>
      <h1>Playlists</h1>

      <div className={classes.createPlaylistForm}>
        <TextField
          label="New Playlist Name"
          variant="outlined"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
      </div>

      <PlaylistList
        playlists={playlists}
        onDelete={handleDeletePlaylist}
        onEdit={handleEditPlaylist}
      />
    </div>
  );
};

export default Playlists;
