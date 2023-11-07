import styles from './CreateAccountOverlay.module.css';
import { useState } from 'react';
import { useRegister } from '../../../../hooks/useRegister';

const CreateAccountOverlay = (props) => {
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

  const handleFormSubmit = (event) => {
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
      register(email, password, displayName);
    }
  };

  return (
    <div className={styles.modal}>
      <form
        className={styles['registerForm']}
        onSubmit={handleFormSubmit}>
        <h2>Create a New Account</h2>

        <div className={styles['registerForm_controls']}>
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

          <input
            type="text"
            value={displayName}
            placeholder="Username"
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {displayNameError && (
            <p className={styles.error}>{displayNameError}</p>
          )}
        </div>

        {!isPending && (
          <div className={styles['registerForm_actions']}>
            <button type="submit">Register</button>
          </div>
        )}
        {isPending && (
          <div className={styles['registerForm_actions']}>
            <button disabled>loading</button>
          </div>
        )}

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAccountOverlay;
