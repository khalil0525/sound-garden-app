import React from 'react';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  miniBannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    justifyContent: 'flex-start ',
    alignItems: 'flex-start',
    maxHeight: '30rem',

    maxWidth: '46rem',
    // Adjust the width as needed
    padding: '3.2rem',
    background: theme.palette.primary.main,
  },
  miniBannerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    textAlign: 'left',
    height: '100%',
    padding: '1.6rem 0.8rem 0.8rem 1.6rem',
  },
  miniBannerButton: {
    borderRadius: '32px !important',
    padding: '12px 6px !important',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    width: '80%',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    alignSelf: 'start',
    marginTop: '16px', // Adjust the margin as needed
  },
  miniBannerImg: {
    display: 'block',
    position: 'relative',
    width: '100%',
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

const MiniBanner = () => {
  const classes = useStyles();

  return (
    <div className={classes.miniBannerContainer}>
      <div className={classes.miniBannerContent}>
        <Typography variant="h1">
          Welcome to SoundGarden, start listening now or log in to upload!
        </Typography>
      </div>
    </div>
  );
};

export default MiniBanner;
