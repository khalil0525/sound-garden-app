import React from 'react';
import PlaylistItem from './PlaylistItem';

const PlaylistList = ({ playlists, onDelete, onEdit }) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.docID}
          playlist={playlist}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
