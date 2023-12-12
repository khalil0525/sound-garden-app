import React from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const useStyles = makeStyles((theme) => ({
  playlistItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: '#f5f5f5', // Background color for the playlist item
  },
  playlistImage: {
    width: '100%', // Make the image take the full width
    maxHeight: '160px', // Limit the maximum height of the image
    objectFit: 'cover', // Ensure the image covers the container
    marginBottom: theme.spacing(1),
  },
  playlistName: {
    // Styling for the playlist name text
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333', // Text color
    textAlign: 'center', // Center-align the text
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between buttons
    width: '100%', // Make the buttons take the full width
    marginTop: theme.spacing(1), // Add space between name and buttons
  },
  editButton: {
    color: '#4caf50', // Green color for the edit button
  },
  deleteButton: {
    color: '#f44336', // Red color for the delete button
  },
}));

const PlaylistItem = ({ playlist, onDelete, onEdit }) => {
  const classes = useStyles();

  const handleDeleteClick = () => {
    onDelete(playlist.id);
  };

  const handleEditClick = () => {
    onEdit(playlist.id);
  };

  return (
    <div className={classes.playlistItem}>
      <img
        src={playlist.playlistPhotoURL || 'https://picsum.photos/300/300'}
        alt={playlist.playlistName}
        className={classes.playlistImage}
      />
      <div className={classes.playlistName}>{playlist.playlistName}</div>
      <div className={classes.actionButtons}>
        <Tooltip title="Edit">
          <IconButton
            onClick={handleEditClick}
            className={classes.editButton}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            onClick={handleDeleteClick}
            className={classes.deleteButton}>
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default PlaylistItem;
