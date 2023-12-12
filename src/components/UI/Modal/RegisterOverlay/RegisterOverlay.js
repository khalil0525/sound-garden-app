import { useState } from 'react';
import { useRegister } from '../../../../hooks/useRegister.js';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import {
  Grid,
  TextField,
  Paper,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';

import { ReactComponent as LogoIcon } from '../../../../images/logo.svg';
import { makeStyles } from '@mui/styles';

import theme from '../../../../theme.js';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '10vh',
    left: 0,
    right: 0,
    zIndex: 2000,
    margin: '0 auto',
    backgroundColor: 'transparent',
    maxWidth: '40rem',
    borderRadius: '18px',
    padding: '2rem',
    textAlign: 'center',
  },
  registerForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    maxWidth: '100%',
  },
  registerFormHeaderText: {
    margin: '0.8rem 0 !important',
    fontSize: theme.typography.h2.fontSize,
  },
  registerFormControls: {
    width: '100%',
    backgroundColor: '#fff',
  },
  registerFormControlsInput: {
    width: '100%',
    fontSize: theme.typography.body1.fontSize,
  },
  registerFormActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  registerFormActionsButton: {
    display: 'block',
    width: '100%',
    backgroundColor: '#2196f3',
    color: '#fff !important',
    border: 'none',
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: theme.typography.body1.fontSize,
    borderRadius: '4px',
  },
  registerFormActionsButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));

const RegisterOverlay = ({ onConfirm, onCancel }) => {
  const classes = useStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const { register, isPending, error } = useRegister();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.match(emailRegex)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateDisplayName = (value) => {
    if (value.length < 3) {
      setDisplayNameError('Display name must be at least 3 characters');
      return false;
    }
    setDisplayNameError('');
    return true;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Reset any previous validation errors
    setEmailError('');
    setPasswordError('');
    setDisplayNameError('');

    // Validate email, password, and display name
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isDisplayNameValid = validateDisplayName(displayName);

    // If all fields are valid, attempt to register
    if (isEmailValid && isPasswordValid && isDisplayNameValid) {
      try {
        await register(email, password, displayName);

        onConfirm();
      } catch (error) {
        console.error('Registration failed', error);
      }
    }
  };
  return (
    <div className={classes.modal}>
      <Paper
        elevation={3}
        sx={{
          padding: '3.6rem',
          maxWidth: 500,
          backgroundColor: theme.palette.secondary.main,
        }}>
        <form
          className={classes.registerForm}
          onSubmit={handleFormSubmit}>
          <Grid
            container
            gap="1.6rem"
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                width: '60%',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20px',
              }}>
              <LogoIcon />
              <Typography
                variant="h1"
                className={classes.registerFormHeaderText}
                sx={{ color: '#fff' }}>
                SoundGarden
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.registerFormControls}>
              <TextField
                variant="filled"
                fullWidth
                label="Email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {emailError && <p className={classes.error}>{emailError}</p>}
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.registerFormControls}>
              <TextField
                fullWidth
                variant="filled"
                type="password"
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {passwordError && (
                <p className={classes.error}>{passwordError}</p>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.registerFormControls}>
              <TextField
                fullWidth
                variant="filled"
                label="Username"
                value={displayName}
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {displayNameError && (
                <p className={classes.error}>{displayNameError}</p>
              )}
            </Grid>
            <div className={classes.registerFormActions}>
              {!isPending && (
                <Button
                  className={classes.registerFormActionsButton}
                  variant="outlined"
                  fullWidth
                  type="submit">
                  Register
                </Button>
              )}
              {isPending && (
                <Button
                  fullWidth
                  disabled>
                  Loading
                </Button>
              )}
              {error && <p>{error}</p>}
            </div>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default RegisterOverlay;
