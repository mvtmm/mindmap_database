import React, { useMemo, useState } from 'react';
import { Login } from './components/Login';
import { GraphView } from './components/GraphView';
import { createDirectusClient } from './auth/directus';

export function App() {
  const directus = useMemo(() => createDirectusClient(), []);
  const [isAuthed, setIsAuthed] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAuthed ? (
        <Login directus={directus} onSuccess={() => setIsAuthed(true)} />
      ) : (
        <GraphView directus={directus} />
      )}
    </div>
  );
}
