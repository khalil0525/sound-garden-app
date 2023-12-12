import React from 'react';
import PlaylistItem from './PlaylistItem';

const PlaylistList = ({ playlists, onDelete, onEdit }) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
