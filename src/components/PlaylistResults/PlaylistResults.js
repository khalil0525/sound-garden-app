import React from 'react';

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

    borderRadius: '8px',
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

const PlaylistResults = ({ query }) => {
  const classes = useStyles();

  // const [playlists, setPlaylists] = useState(samplePlaylists);
  // const [newPlaylistName, setNewPlaylistName] = useState('');
  // const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const { documents: playlistDocuments } = useCollection(...query);

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
