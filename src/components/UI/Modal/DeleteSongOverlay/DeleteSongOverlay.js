import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '40vh',
    left: 0,
    right: 0,
    zIndex: 100,
    margin: '0 auto',
    width: '30%',
    overflow: 'hidden',
    borderRadius: '18px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#000 !important',
  },
  header: {
    background: 'linear-gradient(360deg, #fd4d2d 0%, #f9330e 100%)',
    padding: '1rem',
  },
  headerText: {
    margin: 0,
    color: 'white',
  },
  content: {
    padding: '1rem',
    fontSize: theme.typography.body1.fontSize,
  },
  actions: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginRight: '0.8rem',
  },
  cancelButton: {
    backgroundColor: '#e74c3c !important',
    color: 'white !important',
  },
  deleteButton: {
    backgroundColor: '#2196f3 !important',
    color: 'white !important',
  },
}));

const DeleteSongOverlay = ({ onCancel, onConfirm }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.modal}>
      <header className={classes.header}>
        <Typography
          variant="h6"
          className={classes.headerText}>
          Are you sure?
        </Typography>
      </header>
      <div className={classes.content}>
        <Typography variant="body1">
          Removing this track is irreversible. You will lose all the plays and
          likes for this track with no way to get them back.
        </Typography>
      </div>
      <footer className={classes.actions}>
        <Button
          className={`${classes.cancelButton}`}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className={`${classes.deleteButton}`}
          onClick={onConfirm}>
          Delete Forever
        </Button>
      </footer>
    </Paper>
  );
};

export default DeleteSongOverlay;
