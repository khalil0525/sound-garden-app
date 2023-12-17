import React from 'react';

import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';
import womanListeningToMusicBg from '../../images/woman-listening-to-music.png';

import MiniBanner from '../../components/UI/MiniBanner';

import CollectionResults from '../../components/CollectionResults/CollectionResults';

import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import { Box, IconButton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Headphones } from '@mui/icons-material';
import PlaylistResults from '../../components/PlaylistResults/PlaylistResults';
import { useAuthContext } from '../../hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  home: {
    display: 'grid',
    gridTemplateColumns: '55% 45%',
    gap: theme.spacing(6),
    alignContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
    padding: '0',
    width: '100%',
  },

  homeLeftSide: {
    marginTop: '0.8rem',

    display: 'flex',
    flexDirection: 'column',

    width: '100%',
  },

  homeRightSide: {
    marginTop: '1.6rem',
    display: 'flex',

    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    width: '100%',
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
    padding: '0.8rem',
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

    width: '100%',
  },
  homeBanner: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    borderRadius: '12px',
    justifyContent: 'flex-start ',
    alignItems: 'flex-start',
    minHeight: '220px',
    maxHeight: '300px',
    maxWidth: '100%',
    flex: '1 0 46%',

    padding: '16px',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('md')]: {
      marginTop: '1.6rem',
      maxHeight: '600px',
    },
  },
  homeBannerContainer: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      textAlign: 'center',
      alignItems: 'center',
      marginTop: '0.6rem',
      gap: '0.8rem',
    },
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
    color: theme.palette.text.secondary,
    width: '60%',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    alignSelf: 'start',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      marginTop: '1.6rem !important',
      alignSelf: 'center',
      width: '100%',
    },
  },
  homeBannerImg: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
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

export default function Home({ scrollRef }) {
  const { user } = useAuthContext();
  const classes = useStyles(theme);
  const query = ['music', ['userID', '==', 'xCvggxf5HPhL9xBbHOz49BWcsly2']];
  const playlistQuery = ['playlists', ['userID', '==', user?.uid]];

  return (
    <Grid2 className={classes.home}>
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
            <IconButton
              className={classes.homeBannerButton}
              size="medium"
              variant="contained"
              sx={{ color: '#fff !important', display: 'flex', gap: '0.8rem' }}>
              <Headphones /> Listen Now
            </IconButton>
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
          {user && user.uid && <PlaylistResults query={playlistQuery} />}
          {/* <CardList
            className={classes.homeCardList}
            list={tempList}
            page=""
          /> */}
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

      <Box className={classes.homeRightSide}>
        <MiniBanner />
      </Box>
    </Grid2>
  );
}
