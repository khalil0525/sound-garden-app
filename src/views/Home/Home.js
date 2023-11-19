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
import TwoColumnLayout from '../../components/Layout/TwoColumnLayout';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
import { useAuthContext } from '../../hooks/useAuthContext';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';

const useStyles = makeStyles((theme) => ({
  homeLeftSide: {
    marginTop: '1.6rem',
    display: 'flex',
    flexDirection: 'column',

    gap: '1.6rem',
  },
  homeRightSide: {
    display: 'flex',
    flexDirection: 'inherit',
    gap: '1.6rem',
  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginBottom: '1.6rem',
    width: '100%',
  },
  homeHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '1.6rem 0',
  },
  homeTitle: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.palette.text.primary,
    fontWeight: 500,
    wordWrap: 'break-word',
  },
  homeLink: {
    fontSize: theme.typography.body2.fontSize,
    textDecoration: 'none',
    color: theme.palette.secondary.main,
    whiteSpace: 'nowrap',
  },
  homeSubtitle: {
    fontSize: theme.typography.h4.fontSize,
    color: theme.palette.background,
    fontWeight: 600,
    width: '70%',
  },
  homeCardList: {
    alignSelf: 'flex-start',
    justifySelf: 'flex-start',
    marginLeft: '0.6rem',
    width: '100%',
  },
  homeBanner: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row !important',
    justifyContent: 'flex-start !important',
    alignItems: 'flex-start !important',
    maxHeight: '300px',
    flex: '1 0 46%',
    gridRow: '1/2',
    padding: '1.6rem !important',
  },
  homeBannerContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '1.6rem',
    textAlign: 'left',
  },
  homeBannerButton: {
    borderRadius: '32px !important',
    padding: '1.2rem 0.6rem !important',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    width: '80%',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    alignSelf: 'center',
  },
  homeBannerImg: {
    display: 'block',
    img: {
      display: 'block',
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
  const classes = useStyles();
  const query = ['music', ['userID', '==', 'xCvggxf5HPhL9xBbHOz49BWcsly2']];
  const { user } = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.homeLeftSide}>
        <Card
          background={null}
          className={classes.homeBanner}>
          <div className={classes.homeBannerContainer}>
            <p>SoundGarden</p>
            <Typography
              variant="h1"
              className={classes.homeTitle}>
              Listen to latest trending Music all the time
            </Typography>
            <p>
              <Skeleton
                containerClassName="flex-1"
                height={20}
                width={30}
              />
            </p>
            <p>With SoundGarden, you can get premium quality music for free</p>
            <Button
              className={classes.homeBannerButton}
              size="large"
              variant="contained"
              color="primary">
              Listen Now
            </Button>
          </div>
          <div className={classes.homeBannerImg}>
            <img
              src={womanListeningToMusicBg}
              alt="woman listening to music"></img>
          </div>
        </Card>
        <div className={classes.homeHeaderContainer}>
          <Typography
            variant="h4"
            className={classes.homeSubtitle}>
            Playlists
          </Typography>
          <Link
            className={classes.homeLink}
            to="/playlist">
            Explore more...
          </Link>
        </div>
        <div className={classes.homeContainer}>
          <CardList
            className={classes.homeCardList}
            list={tempList}
            page=""
          />
        </div>
        <div className={classes.homeHeaderContainer}>
          <Typography
            variant="h4"
            className={classes.homeSubtitle}>
            Trending
          </Typography>
          <Link
            className={classes.homeLink}
            to="/artists">
            Explore more...
          </Link>
        </div>
        <div className={classes.homeContainer}>
          {query && (
            <CollectionResults
              scrollRef={scrollRef}
              query={query}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
