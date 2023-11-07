import styles from './SignInOverlay.module.css';
import { useState } from 'react';
import { useLogin } from '../../../../hooks/useLogin';

const SignInOverlay = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, error, isPending } = useLogin();
  console.log(isPending);
  const validateEmail = (value) => {
    // Basic email validation using a regular expression
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

    // Reset any previous validation errors
    setEmailError('');
    setPasswordError('');

    // Validate email and password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // If both email and password are valid, attempt to log in
    if (isEmailValid && isPasswordValid) {
      login(email, password);
    }
  };

  return (
    <div className={styles.modal}>
      <form
        className={styles['signInForm']}
        onSubmit={handleFormSubmit}>
        <h2>Sign in</h2>

        <div className={styles['signInForm_controls']}>
          <input
            type="email"
            value={email}
            placeholder="Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </div>

        <div className={styles['signInForm_actions']}>
          {!isPending && <button type="submit">Login</button>}
          {isPending && (
            <button
              className="btn"
              disabled>
              Loading
            </button>
          )}
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default SignInOverlay;
