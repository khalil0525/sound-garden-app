import React from 'react';
import PlaylistItem from './PlaylistItem';

const PlaylistList = ({ playlists }) => {
  const playlistListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '1.6rem',
    width: '100%',
  };

  return (
    <div style={playlistListStyle}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.docID}
          playlist={playlist}
          playlistDisplayName={playlist.displayName}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
