import React from 'react';
import { Box, Grid } from '@mui/material';
import ActionBar from '../ActionBar/ActionBar'; // Adjust the path as needed

const Layout = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={3}
        width="100%">
        <Grid
          item
          marginLeft="auto"
          xs={5}>
          <ActionBar />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          width="100%">
          {/* Content for the first column */}
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
