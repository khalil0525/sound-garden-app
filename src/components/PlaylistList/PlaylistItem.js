import React from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  playlistItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: '#f5f5f5',
  },
  playlistImage: {
    width: '100%',
    maxHeight: '160px',
    objectFit: 'cover',
    marginBottom: theme.spacing(1),
  },
  playlistName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1),
    },
    editButton: {
      color: '#4caf50',
    },
    deleteButton: {
      color: '#f44336',
    },
  },
}));

const PlaylistItem = ({ playlist, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleDeleteClick = () => {
    onDelete(playlist.id);
  };

  const handleEditClick = () => {
    onEdit(playlist.id);
  };

  return (
    <div
      className={classes.playlistItem}
      onClick={() =>
        navigate(`/playlist/${playlist.docID}`, { state: { playlist } })
      }>
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
