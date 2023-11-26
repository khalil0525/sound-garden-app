import React from 'react';
import { Box, Grid } from '@mui/material';
import ActionBar from '../ActionBar/ActionBar'; // Adjust the path as needed
import { useTheme } from '@mui/system';

const Layout = ({ children, user }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '1.6rem',
        justifyContent: 'center',
      }}>
      <Grid
        container
        width="100%">
        <Grid
          item
          container
          xs={12}
          md={5}
          m={{ xs: '0', md: '0 0 0 auto' }}
          justifyContent={{ xs: 'center', md: 'flex-end' }}>
          <ActionBar user={user} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          width="100%"
          sx={{ marginTop: '1.6rem' }}>
          {children}
        </Grid>
        {/* <Grid item xs={12} sm={6}></Grid> */}
      </Grid>
    </Box>
  );
};

export default Layout;
