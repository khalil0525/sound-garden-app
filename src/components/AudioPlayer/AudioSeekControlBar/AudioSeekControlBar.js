import React from 'react';
import Duration from './Duration';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  audioSeekControlBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  seekInput: {
    cursor: 'pointer',
    minWidth: '60%',
    margin: `0 ${theme.spacing(2)}px`, // Adjust margin as needed
  },
}));

const AudioSeekControlBar = ({
  className,
  durationClassName,
  duration,
  played,
  onChange,
  onMouseDown,
  onMouseUp,
}) => {
  const classes = useStyles();

  return (
    <div className={`${classes.audioSeekControlBar} ${className}`}>
      <Duration
        className={durationClassName}
        seconds={duration * played}
      />

      <input
        type="range"
        min={0}
        max={0.999999}
        step="any"
        value={played}
        onChange={onChange}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={classes.seekInput}
      />
      <Duration
        className={durationClassName}
        seconds={duration * (1 - played)}
      />
    </div>
  );
};

export default AudioSeekControlBar;
