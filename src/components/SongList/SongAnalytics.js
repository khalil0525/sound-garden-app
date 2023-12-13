import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
  analyticsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.6rem',
    alignItems: 'center',
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    fontSize: theme.typography.body3.fontSize,
  },
  analyticsItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
}));

const SongAnalytics = ({ likes, plays, downloads }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const isSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (isSmallerScreen) {
    return null;
  }

  return (
    <div className={classes.analyticsBar}>
      <div className={classes.analyticsItem}>
        <Tooltip title={`Likes: ${likes}`}>
          <FavoriteBorderRoundedIcon fontSize="small" />
        </Tooltip>
        <span>{likes}</span>
      </div>
      <div className={classes.analyticsItem}>
        <Tooltip title={`Plays: ${plays}`}>
          <PlayArrowIcon fontSize="small" />
        </Tooltip>
        <span>{plays}</span>
      </div>
      <div className={classes.analyticsItem}>
        <Tooltip title={`Downloads: ${downloads}`}>
          <FileDownloadOutlinedIcon fontSize="small" />
        </Tooltip>
        <span>{downloads}</span>
      </div>
    </div>
  );
};

export default SongAnalytics;
