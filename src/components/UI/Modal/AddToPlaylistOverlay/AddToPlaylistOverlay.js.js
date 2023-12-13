import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { addSongToPlaylist, getPlaylists } from '../../../../api/functions';
import theme from '../../../../theme';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '10vh',
    left: 0,
    right: 0,
    zIndex: 2000,
    margin: '0 auto',
    backgroundColor: 'transparent',
    maxWidth: '40rem',
    borderRadius: '18px',
    padding: '2rem',
    textAlign: 'center',
  },
  paper: {},
  list: {
    marginTop: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  cancelButton: {
    marginTop: '20px',
  },
  listItemText: {
    flex: 1,
    marginRight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  avatar: {
    borderRadius: '0',
  },
  squareImage: {
    borderRadius: '0',
  },
  musicIcon: {
    marginRight: '5px',
  },
}));

const AddToPlaylistOverlay = ({ songDocID, onConfirm, onCancel }) => {
  const classes = useStyles(theme);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addToPlaylistLoading, setAddToPlaylistLoading] = useState(false); // Loading state for the button

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await getPlaylists();
        if (data.success && data.playlists?.length) {
          setPlaylists(data.playlists);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const addToPlaylist = async (playlistId, songId) => {
    try {
      setAddToPlaylistLoading(true); // Set loading state to true when starting the request
      const { data } = await addSongToPlaylist({ playlistId, songId });
      if (data.success) {
        onConfirm();
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    } finally {
      setAddToPlaylistLoading(false); // Set loading state to false when the request is completed
    }
  };

  return (
    <div className={classes.modal}>
      {!loading && (
        <Paper
          elevation={3}
          className={classes.paper}>
          <Typography
            variant="h2"
            color="#000">
            Add to Playlist
          </Typography>
          <List className={classes.list}>
            {playlists &&
              playlists.map((playlist) => (
                <ListItem
                  key={playlist.id}
                  className={classes.listItem}
                  sx={{ width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: '0.8rem' }}>
                    <ListItemAvatar>
                      {playlist.playlistPhotoURL ? (
                        <Avatar
                          alt={playlist.playlistName}
                          src={playlist.playlistPhotoURL}
                          className={classes.avatar}
                        />
                      ) : (
                        <Avatar
                          sx={{ borderRadius: '0' }}
                          alt={playlist.playlistName}
                          src="https://picsum.photos/300/300"
                          className={classes.squareImage}
                        />
                      )}
                    </ListItemAvatar>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                      }}>
                      <Tooltip title={playlist.playlistName}>
                        <Typography
                          color="#000"
                          variant="body2"
                          sx={{ textTransform: 'uppercase !important' }}>
                          {playlist.playlistName}
                        </Typography>
                      </Tooltip>
                      <Tooltip
                        title={`Total Tracks: ${
                          playlist?.songs?.length
                            ? playlist?.songs?.length
                            : '0'
                        } `}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                          }}>
                          <MusicNoteIcon
                            fontSize="xs"
                            htmlColor="#000"
                          />
                          <Typography
                            color="#000"
                            variant="body1">
                            {playlist?.songs?.length
                              ? playlist?.songs?.length
                              : '0'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => addToPlaylist(playlist.docID, songDocID)}
                    className={classes.addButton}
                    disabled={
                      playlist?.songs?.includes(songDocID) ||
                      addToPlaylistLoading
                    } // Disable button while loading
                  >
                    {addToPlaylistLoading ? (
                      <CircularProgress
                        size={24}
                        color="inherit"
                      />
                    ) : playlist?.songs?.includes(songDocID) ? (
                      'Added'
                    ) : (
                      'Add to Playlist'
                    )}
                  </Button>
                </ListItem>
              ))}
          </List>
          <Button
            variant="outlined"
            onClick={onCancel}
            className={classes.cancelButton}>
            Cancel
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default AddToPlaylistOverlay;
