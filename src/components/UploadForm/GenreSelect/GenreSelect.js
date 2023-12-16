import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

const genres = [
  'None',
  'Alternative Rock',
  'Ambient',
  'Classical',
  'Country',
  'Dance & EDM',
  'Dancehall',
  'Deep House',
  'Disco',
  'Drum & Bass',
  'Dubstep',
  'Electronic',
  'Hip-hop & Rap',
  'House',
  'Indie',
  'Jazz & Blues',
  'Latin',
  'Metal',
  'Piano',
  'Pop',
  'R&B',
  'Reggae',
  'Reggaeton',
  'Rock',
  'Soundtrack',
  'Techno',
  'Trance',
  'Trap',
  'Triphop',
  'World',
];

const GenreSelect = ({ onGenreTypeChange, genreValue, disabled }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="genre-type">Genre</InputLabel>
      <Select
        label="Genre"
        id="genre-type"
        value={genreValue}
        onChange={onGenreTypeChange}
        disabled={disabled}
        fullWidth
        sx={{ minWidth: '100%' }}>
        {genres.map((genre, index) => (
          <MenuItem
            fullWidth
            sx={{ color: '#000 !important', width: '' }}
            key={index}
            value={genre.toLowerCase()}>
            {genre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreSelect;
