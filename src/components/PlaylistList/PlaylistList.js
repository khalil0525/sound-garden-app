import React from 'react';
import PlaylistItem from './PlaylistItem';

const PlaylistList = ({ playlists }) => {
  const playlistListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.6rem',
  };

  return (
    <div style={playlistListStyle}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.docID}
          playlist={playlist}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
