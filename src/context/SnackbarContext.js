import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  const handleExited = useCallback(() => {
    setMessageInfo(undefined);
  }, []);

  const showSnackbar = useCallback((message, severity) => {
    setSnackPack((prev) => [
      ...prev,
      { message, severity, key: new Date().getTime() },
    ]);
  }, []);

  const showSuccessSnackbar = useCallback(
    (message) => {
      showSnackbar(message, 'success');
    },
    [showSnackbar]
  );

  const showErrorSnackbar = useCallback(
    (message) => {
      showSnackbar(message, 'error');
    },
    [showSnackbar]
  );

  return (
    <SnackbarContext.Provider
      value={{ showSuccessSnackbar, showErrorSnackbar }}>
      {children}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#333',
            color: '#fff',
          },
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}>
        <MuiAlert
          onClose={handleClose}
          severity={messageInfo ? messageInfo.severity : 'info'}
          elevation={6}
          variant="filled"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'secondary.main',
            },
          }}>
          {messageInfo ? messageInfo.message : undefined}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
