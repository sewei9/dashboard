import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useAuth } from './auth/authContext';

function App() {
  const [count, setCount] = useState(0);
  const { account, login, logout } = useAuth();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="auth-section">
        {account ? (
          <>
            <p>Welcome, {account.username}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </>
  );
}

export default App;
