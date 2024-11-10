import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/userState';
import { QueryProvider } from './context/queryState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();