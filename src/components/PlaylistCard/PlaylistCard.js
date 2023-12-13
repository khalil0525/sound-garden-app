import React from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  playlistCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    border: '1px solid #ccc',
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
    flexGrow: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
}));

const PlaylistCard = ({ playlist }) => {
  const classes = useStyles();

  return (
    <Card className={classes.playlistCard}>
      <CardMedia
        component="img"
        alt={playlist.playlistName}
        image={playlist.playlistPhotoURL || 'https://picsum.photos/300/300'}
        className={classes.playlistImage}
      />
      <CardContent>
        <Typography className={classes.playlistName}>
          {playlist.playlistName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
