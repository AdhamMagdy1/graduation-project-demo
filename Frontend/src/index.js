import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register';
import Chat from './pages/Chat';
// import Userregister from './pages/Userrgister';
// import Userlogin from './pages/Userlogin';
// import UserDashboard from './pages/UserDashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isAuthenticated } from './services/auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="login" element={<Login />} />
        <Route path="chat" element={isAuthenticated() ? <Chat /> : <Login />} />
        {/* <Route path="userregister" element={<Userregister />} />
        <Route path="userlogin" element={<Userlogin />} />
        <Route path="userdashboard" element={<UserDashboard />} /> */}
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="167637892991-v96bc1kvj3rfs86j7ige02r3q256jr29.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
