import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { getPlaylist } from '../../api/functions';

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

  // ['music', ['userID', '==', profile.userID]]

  return (
    <Box>
      {user && location?.state.playlist && (
        <PlaylistCard playlist={location.state?.playlist} />
      )}

      {playlist?.docID && (
        <CollectionResults
          query={['music', ['docID', 'in', playlist?.songs]]}
        />
      )}
    </Box>
  );
};

export default Playlist;
