import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardList from '../../components/CardList/CardList';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Link from '@mui/material/Link';
import womanListeningToMusicBg from '../../images/woman-listening-to-music.png';
import card1bg from '../../images/cardBg1.png';
import card2bg from '../../images/cardBg2.png';
import card3bg from '../../images/cardBg3.png';

import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { useAuthContext } from '../../hooks/useAuthContext';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import { Box } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
const useStyles = makeStyles((theme) => ({
  homeLeftSide: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '60%',
    gap: '16px',
  },
  homeRightSide: {
    display: 'flex',
    flexDirection: 'inherit',
    gap: '16px',
  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    width: '100%',
  },
  homeHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '16px 0',
  },
  homeTitle: {
    fontSize: theme.typography.h1.fontSize,

    color: `${theme.palette.text.primary}`,
    fontWeight: '600 !important',
    wordWrap: 'break-word',
  },
  homeLink: {
    fontSize: theme.typography.body2.fontSize,
    textDecoration: 'none !important',
    color: theme.palette.secondary.main,
    whiteSpace: 'nowrap',
  },
  homeSubtitle: {
    fontSize: theme.typography.h4.fontSize,
    color: theme.palette.text.secondary,
    fontWeight: '600 !important',
    width: '70%',
  },
  homeCardList: {
    alignSelf: 'flex-start',
    justifySelf: 'flex-start',
    marginLeft: '6px',
    width: '100%',
  },
  homeBanner: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    borderRadius: '12px',
    justifyContent: 'flex-start ',
    alignItems: 'flex-start',
    maxHeight: '300px',
    maxWidth: '650px',
    flex: '1 0 46%',
    gridRow: '1/2',
    padding: '16px',
    background: theme.palette.primary.main,
  },
  homeBannerContainer: {
    display: 'flex',
    width: '60%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    textAlign: 'left',
    height: '100%',
    padding: '1.6rem 0.8rem 0.8rem 1.6rem',
  },
  homeBannerButton: {
    borderRadius: '32px !important',
    padding: '12px 6px !important',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    width: '80%',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    alignSelf: 'start',
  },
  homeBannerImg: {
    display: 'block',
    position: 'relative',
    width: '40%',
    height: '100%',
    '& img': {
      position: 'absolute',
      bottom: -17,
      left: 0,
      width: '100%',
      height: '120%',
    },
  },
}));

const tempList = [
  { title: 'Top 50 tamil', content: '50 tracks', background: card1bg },
  { title: 'Weekly Hits', content: '100 tracks', background: card2bg },
  { title: 'Tolly Hit track', content: '60 Tracks', background: card3bg },
  { title: 'Top 50 tamilll', content: '50 tracks', background: card1bg },
];

export default function Home({ scrollRef }) {
  const classes = useStyles(theme);
  const query = ['music', ['userID', '==', 'xCvggxf5HPhL9xBbHOz49BWcsly2']];
  const { user } = useAuthContext();

  return (
    <Grid2
      container
      spacing={3}>
      <Box className={classes.homeLeftSide}>
        <Box className={classes.homeBanner}>
          <Box className={classes.homeBannerContainer}>
            <Typography
              variant="body2"
              sx={{ opacity: '0.7' }}>
              SoundGarden
            </Typography>
            <Typography
              variant="h1"
              className={classes.homeTitle}>
              Listen to latest trending Music all the time
            </Typography>

            <Typography
              variant="body2"
              sx={{ opacity: '0.7' }}>
              With SoundGarden, you can get premium quality music for free
            </Typography>
            <Button
              className={classes.homeBannerButton}
              size="medium"
              variant="contained"
              color="primary">
              Listen Now
            </Button>
          </Box>
          <Box className={classes.homeBannerImg}>
            <img
              src={womanListeningToMusicBg}
              alt="woman listening to music"></img>
          </Box>
        </Box>
        <Box className={classes.homeHeaderContainer}>
          <Typography
            variant="h2"
            className={classes.homeSubtitle}>
            Playlists
          </Typography>
          <Link
            className={classes.homeLink}
            to="/playlist">
            Explore more
          </Link>
        </Box>
        <Box className={classes.homeContainer}>
          <CardList
            className={classes.homeCardList}
            list={tempList}
            page=""
          />
        </Box>
        <Box className={classes.homeHeaderContainer}>
          <Typography
            variant="h2"
            className={classes.homeSubtitle}>
            Trending
          </Typography>
          <Link
            className={classes.homeLink}
            to="/artists">
            Explore more
          </Link>
        </Box>
        <Box className={classes.homeContainer}>
          {query && (
            <CollectionResults
              scrollRef={scrollRef}
              query={query}
            />
          )}
        </Box>
      </Box>
    </Grid2>
  );
}
