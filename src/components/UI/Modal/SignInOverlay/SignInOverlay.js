import styles from './SignInOverlay.module.css';
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
  Link,
} from '@mui/material';
import { ReactComponent as LogoIcon } from '../../../../images/logo.svg';
import theme from '../../../../theme.js';
const SignInOverlay = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, error, isPending, signInWithGoogle } = useLogin();

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

  return (
    <div className={styles.modal}>
      <Paper
        elevation={3}
        sx={{
          padding: '3.6rem',
          maxWidth: 500,
          backgroundColor: theme.palette.secondary.main,
        }}>
        <form
          className={styles['signInForm']}
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
                sx={{ color: '#000' }}>
                SoundGarden
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              className={styles['signInForm_controls']}>
              <TextField
                variant="filled"
                fullWidth
                label="Email"
                value={email}
                size="small"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ height: '40px', marginBottom: '1rem' }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              className={styles['signInForm_controls']}>
              {emailError && <p className={styles.error}>{emailError}</p>}
              <TextField
                variant="filled"
                type="password"
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ height: '40px', marginBottom: '1rem' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {passwordError && <p className={styles.error}>{passwordError}</p>}
            </Grid>
            <div className={styles['signInForm_actions']}>
              {!isPending && <Button type="submit">Login</Button>}
              {isPending && (
                <Button
                  className="btn"
                  disabled>
                  Loading
                </Button>
              )}
              {error && <p>{error}</p>}
            </div>
            <Divider />
            <Button
              variant="filled"
              sx={{ backgroundColor: '#fff !important', color: 'black' }}
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}>
              Sign In with Google
            </Button>
            <Link
              href="/password-recovery"
              color="inherit">
              Forgot Password?
            </Link>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default SignInOverlay;
