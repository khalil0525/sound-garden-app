import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import SearchIcon from '@mui/icons-material/Search';
import { useAlgoliaSearch } from '../../hooks/useAlgoliaSearch';

const useStyles = makeStyles((theme) => ({
  actionBarSearch: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 0 auto',
    height: '4.2rem',
    border: `1.3px solid ${theme.palette.primary.main}`,
    filter: 'drop-shadow(3px 4px 15px rgba(0, 0, 0, 0.12))',
    borderRadius: '0.6rem',
    [theme.breakpoints.down('sm')]: {
      transform: 'scale(1)', // Disable grow effect on mobile
    },
  },
  searchIcon: {
    marginLeft: '1rem',
    width: '2.4rem',
    height: '2.4rem',
    '&:hover': {
      cursor: 'pointer',
    },
    [theme.breakpoints.down('sm')]: {
      transform: 'scale(1)', // Disable grow effect on mobile
    },
  },
  input: {
    padding: '0 0.8rem',
    marginLeft: '0.6rem',
    margin: '0 0.6rem',
    border: 'none',
    background: 'none',
    flex: '1 0 auto',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: '2rem',
    opacity: 0.3,
    '&:focus': {
      border: 'none',
      outline: 'none',
      opacity: 1,
    },
  },
  actionBarSearchLandscape: {
    borderRadius: '118px',
  },
}));

const ActionBarSearch = ({ queryString }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState(() =>
    queryString ? queryString : ''
  );
  const { searchForDocuments } = useAlgoliaSearch();

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = async () => {
    if (searchText.trim().length > 0 && searchText !== queryString) {
      searchForDocuments(searchText);
    }
  };

  const handleEnterPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div
      className={`${classes.actionBarSearch} ${classes.actionBarSearchLandscape}`}>
      <InputBase
        type="text"
        placeholder="Type here to search"
        value={searchText}
        onChange={handleSearchTextChange}
        onKeyPress={handleEnterPressed}
        className={classes.input}
        endAdornment={
          <InputAdornment position="start">
            <IconButton
              className={classes.searchIcon}
              onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default ActionBarSearch;
