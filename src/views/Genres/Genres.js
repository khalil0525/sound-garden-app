import React from 'react';
import { makeStyles } from '@mui/styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import CardList from '../../components/CardList/CardList';
import Layout from '../../components/Layout/Layout';

const genres = [
  { title: 'none' },
  { title: 'alternative rock' },
  { title: 'ambient' },
  { title: 'classical' },
  { title: 'country' },
  { title: 'dance & edm' },
  { title: 'dancehall' },
  { title: 'deep house' },
  { title: 'disco' },
  { title: 'drum & bass' },
  { title: 'dubstep' },
  { title: 'electronic' },
  { title: 'hip-hop & rap' },
  { title: 'house' },
  { title: 'indie' },
  { title: 'latin' },
  { title: 'metal' },
  { title: 'piano' },
  { title: 'pop' },
  { title: 'r&b' },
  { title: 'reggae' },
  { title: 'reggaeton' },
  { title: 'rock' },
  { title: 'soundtrack' },
  { title: 'techno' },
  { title: 'trance' },
  { title: 'trap' },
  { title: 'triphop' },
  { title: 'world' },
];

const useStyles = makeStyles((theme) => ({
  genres: {
    display: 'grid',
    gridTemplateColumns: '24% 24% 24% 24%',
    gridTemplateRows: '1fr auto',
    alignContent: 'center',

    width: '100%',
    gridRow: '2/-1',
    gridColumn: '1/-1',
    justifyContent: 'center',
  },
  genresCardList: {
    gridRow: '2/-1',
    gridColumn: '1/-1',
    margin: '3.6rem auto',
  },
  genresActionBar: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'flex-end',
      gridColumn: '3/-1',
      gridRow: '1',
    },
  },
}));

export default function Genres() {
  const classes = useStyles();
  const { user } = useAuthContext();

  return (
    <Layout user={user}>
      <div className={classes.genres}>
        <CardList
          className={classes.genresCardList}
          list={genres}
          page={'genres'}
        />
      </div>
    </Layout>
  );
}
