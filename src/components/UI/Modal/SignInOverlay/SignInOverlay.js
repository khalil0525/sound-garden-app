import { useState } from 'react';
import { useLogin } from '../../../../hooks/useLogin';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Grid,
  TextField,
  Paper,
  Button,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  signInForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    maxWidth: '100%',
  },
  signInFormHeaderText: {
    margin: '0.8rem 0 !important',
    fontSize: theme.typography.h2.fontSize,
  },
  signInFormControls: {
    width: '100%',
    backgroundColor: '#fff',
  },
  signInFormControlsInput: {
    width: '100%',
    fontSize: theme.typography.body1.fontSize,
  },
  signInFormActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  signInFormActionsButton: {
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
  signInFormActionsButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));
const SignInOverlay = (props) => {
  const classes = useStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, error, isPending, signInWithGoogle } = useLogin();
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false); // New state for toggling password recovery

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

  const handleFormSubmit = (event) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      login(email, password);
    }
  };
  const handlePasswordRecoverySubmit = (event) => {
    event.preventDefault();
    // Implement password recovery logic here
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
        {showPasswordRecovery ? (
          <form
            className={classes.signInForm}
            onSubmit={handlePasswordRecoverySubmit}>
            {/* Password Recovery Form */}

            <Grid
              container
              gap="1.6rem"
              direction="column"
              justifyContent="center"
              alignItems="center">
              {' '}
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
                  className={classes.signInFormHeaderText}
                  sx={{ color: '#fff' }}>
                  SoundGarden
                </Typography>
              </Grid>
              <Typography variant="body1">Password Recovery</Typography>{' '}
              <Grid
                item
                xs={12}
                className={classes.signInFormControls}>
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
              </Grid>
            </Grid>
            <Button
              className={classes.signInFormActionsButton}
              variant="outlined"
              fullWidth
              type="submit">
              Recover Password
            </Button>
            <Button
              onClick={() => setShowPasswordRecovery(false)}
              variant="text"
              sx={{ cursor: 'pointer', marginTop: '1rem', color: '#fff' }}
              startIcon={<ArrowBackIcon />}>
              Back to Login
            </Button>
          </form>
        ) : (
          <form
            className={classes.signInForm}
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
                  className={classes.signInFormHeaderText}
                  sx={{ color: '#fff' }}>
                  SoundGarden
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                className={classes.signInFormControls}>
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
                  sx={{
                    height: '40px',
                    marginBottom: '1.6rem',
                    padding: '0.4rem',
                  }}
                />{' '}
                {emailError && <p className={classes.error}>{emailError}</p>}
              </Grid>
              <Grid
                item
                xs={12}
                className={classes.signInFormControls}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  value={password}
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    height: '40px',
                    marginBottom: '1.6rem',
                    padding: '0.4rem',
                  }}
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
              <div className={classes.signInFormActions}>
                {!isPending && (
                  <Button
                    className={classes.signInFormActionsButton}
                    variant="outlined"
                    fullWidth
                    type="submit">
                    Login
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
              <Divider />
              <div className={classes.signInFormActions}>
                <Button
                  variant="filled"
                  fullWidth
                  size="large"
                  sx={{ backgroundColor: '#fff !important', color: 'black' }}
                  startIcon={<GoogleIcon />}
                  onClick={signInWithGoogle}>
                  Sign In with Google
                </Button>
              </div>
              <Button
                variant="body3"
                onClick={() => setShowPasswordRecovery(true)}
                sx={{ cursor: 'pointer', marginTop: '1rem', color: '#fff' }}>
                Forgot Password?
              </Button>
            </Grid>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default SignInOverlay;
