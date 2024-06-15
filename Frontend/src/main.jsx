import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from '../pages/restaurant/dashboard/context.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="167637892991-v96bc1kvj3rfs86j7ige02r3q256jr29.apps.googleusercontent.com">
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
