import React from 'react';

import { useAuthContext } from './hooks/useAuthContext';
import AppRouter from './AppRouter';

function App() {
  // Getting the context of the user to see if they're logged in
  const { user, authIsReady } = useAuthContext();

  return <>{authIsReady && <AppRouter user={user} />}</>;
}

export default App;
