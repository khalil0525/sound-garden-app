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
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  playlistName: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
    // Set text color to black
    color: 'black',
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
      <div className={classes.playlistName}>{playlist.name}</div>
      <div>
        <Tooltip title="Edit">
          <IconButton onClick={handleEditClick}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteClick}>
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default PlaylistItem;
