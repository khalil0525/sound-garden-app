import { LinearProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const LoadingBar = (props) => {
  const [totalLoaded, setTotalLoaded] = useState(0);

  useEffect(() => {
    if (props.progress) {
      let progress = Math.round(props.progress);
      setTotalLoaded(progress);
    }
  }, [props.progress]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{props.song}</Typography>
        {totalLoaded !== 0 && <Typography>{totalLoaded}</Typography>}
      </div>

      <LinearProgress
        variant="determinate"
        value={totalLoaded}
        sx={{ padding: '0.4rem', width: '100%', borderRadius: '0.2rem' }}
      />
    </div>
  );
};

export default LoadingBar;
