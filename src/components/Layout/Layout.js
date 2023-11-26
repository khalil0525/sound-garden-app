import React from 'react';
import { Box, Grid } from '@mui/material';
import ActionBar from '../ActionBar/ActionBar'; // Adjust the path as needed

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '3.2rem',
        justifyContent: 'center',
      }}>
      <Grid
        container
        spacing={3}
        width="100%">
        <Grid
          item
          container
          xs={12}
          justifyContent="flex-end">
          <ActionBar />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          width="100%">
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}>
          {/* Content for the second column */}
          {/* Add more Grid items for additional columns if needed */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
