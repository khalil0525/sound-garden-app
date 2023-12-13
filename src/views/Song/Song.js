import React from 'react';
import { Box } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';

import SongCard from '../../components/Song/SongCard';
import { useAuthContext } from '../../hooks/useAuthContext';

const Song = () => {
  const { user } = useAuthContext();

  const { songId } = useParams();
  const location = useLocation();

  return (
    <Box>
      {user && location?.state.song && (
        <SongCard
          song={location.state?.song}
          liked={location.state?.song?.likes?.some(
            (like) => like.id === user.uid || false
          )}
          user={user}
          songId={songId}
          profileURL={location.state?.song.profileURL}
          playlistSongs={location.state?.playlistSongs}
          songPlaylistLocation={location.state?.songPlaylistLocation}
          songIndex={location.state?.songIndex}
        />
      )}
    </Box>
  );
};

export default Song;
