import React, { useEffect } from 'react';
import styles from './styles/App.module.css';
import { useAuthContext } from './hooks/useAuthContext';
import AppRouter from './AppRouter';

function App() {
  // Getting the context of the user to see if they're logged in
  const { user, authIsReady } = useAuthContext();

  useEffect(() => {});
  return (
    <div className={styles.app}>{authIsReady && <AppRouter user={user} />}</div>
  );
}

export default App;
