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

        padding: {
          xs: theme.spacing(1.5),
          sm: theme.spacing(4),
          md: '0.8rem 3.2rem 1.6rem 3.2rem',
        }, // Set padding to 0 for xs (mobile)
        justifyContent: 'center',
      }}>
      <Grid
        container
        width="100%">
        <Grid
          item
          container
          xs={12}
          md={12}
          lg={5}
          m={{ xs: '0', md: '0 0 3.2rem auto' }}
          justifyContent={{ xs: 'center', md: 'center' }}>
          <ActionBar user={user} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          width="100%"
          sx={{
            padding: { xs: 0, sm: 0, md: theme.spacing(2) },
          }}>
          {children}
        </Grid>
        {/* <Grid item xs={12} sm={6}></Grid> */}
      </Grid>
    </Box>
  );
};

export default Layout;
