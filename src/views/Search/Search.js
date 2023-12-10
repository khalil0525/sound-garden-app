import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Layout from '../../components/Layout/Layout';
import { useAuthContext } from '../../hooks/useAuthContext';
import SongList from '../../components/SongList/SongList';

const useStyles = makeStyles((theme) => ({
  search: {
    display: 'grid',
    gridTemplateColumns: '33% 33% 33%',
    gridTemplateRows: '1fr 1fr auto',
  },
  searchHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    gridColumn: '1/-1',
    gridRow: 2,
    fontSize: theme.vars['font-size-h1'],
    borderBottom: '1px solid #f2f2f2',
  },
  searchQueryText: {
    fontSize: theme.vars['font-size-h1'],
    fontWeight: 400,
    lineHeight: 1.3,
    marginLeft: '4rem',
  },
  searchActionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gridColumn: '3/-1',
    gridRow: 1,
  },
  searchSongList: {
    gridRow: '3/-1',
    gridColumn: '1/-1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Search = ({ scrollRef }) => {
  const classes = useStyles();
  const { user } = useAuthContext();
  let location = useLocation();
  const { results, query } = location.state;

  return (
    <div className={classes.search}>
      <div className={classes.searchHeader}>
        <h1 className={classes.searchQueryText}>
          Search results for "{query}"
        </h1>
      </div>
      {results.length ? (
        <SongList
          className={classes.searchSongList}
          scrollRef={scrollRef}
          songs={results}
          user={user ? user : 'none'}
        />
      ) : (
        <h1 className={classes.searchSongList}>
          The search yielded no results!
        </h1>
      )}
    </div>
  );
};

export default Search;
