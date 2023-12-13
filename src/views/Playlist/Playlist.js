import React, { useState, useEffect } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { getPlaylist } from '../../api/functions';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Playlist = () => {
  const { user } = useAuthContext();
  const { playlistId } = useParams();
  const location = useLocation();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const results = await getPlaylist({ playlistId });
        setPlaylist(results.data);
      } catch (error) {
        console.error('Error fetching collection results:', error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleDeleteClick = () => {
    // onDelete(playlist.id);
  };

  const handleEditClick = () => {
    // onEdit(playlist.id);
  };

  return (
    <Box sx={{ maxWidth: '124rem', margin: '0 auto' }}>
      {user && location?.state.playlist && (
        <PlaylistCard playlist={location.state?.playlist} />
      )}
      <div
        style={{
          padding: '1.6rem 1.6rem 0.4rem 1.6rem',
          display: 'flex',
          gap: '0.8rem',
        }}>
        <Tooltip title="Edit">
          <Button
            onClick={handleEditClick}
            variant="outlined"
            color="secondary">
            <EditOutlinedIcon /> Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            onClick={handleDeleteClick}
            variant="outlined"
            color="secondary">
            <DeleteForeverOutlinedIcon /> Delete
          </Button>
        </Tooltip>
      </div>
      {playlist?.docID && (
        <CollectionResults
          query={['music', ['docID', 'in', playlist?.songs]]}
        />
      )}
    </Box>
  );
};

export default Playlist;
