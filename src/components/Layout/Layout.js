import React from 'react';
import { Box, Grid } from '@mui/material';
import ActionBar from '../ActionBar/ActionBar';
import { useTheme } from '@mui/system';

const Layout = ({ children, user }) => {
  const theme = useTheme();

  const renderChildrenWithProps = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { user });
      }
      return child;
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        [theme.breakpoints.down('lg')]: {
          marginTop: '3.2rem',
        },
        padding: {
          xs: theme.spacing(2),
          sm: theme.spacing(3),
          maxHeight: '100%',
        },
        justifyContent: 'center',
        overflowX: 'hidden',

        overflowY: 'auto',

        '::-webkit-scrollbar': {
          width: '8px',
          margin: '0 1.6rem',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '5px',
          backgroundClip: 'padding-box',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          marginTop: '3.2rem !important',
          marginBottom: '3.2rem !important',
        },
      }}
      p={{ xs: '0', sm: '0', md: '3.2rem' }}
      bgcolor={'white'}
      borderRadius={{
        xs: '0',
        lg: '3.4rem',
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
            padding: { xs: 0, sm: 0, md: theme.spacing(4) },
          }}>
          {renderChildrenWithProps()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
