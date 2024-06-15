import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function UsrLogin() {
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg('');
  }, [success]);

  const responseMessage = (response) => {
    console.log(response);
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.localStorage.setItem('user', JSON.stringify(data.user));
        window.localStorage.setItem('token', data.token);
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setErrMsg('Login failed. Please try again.');
      });
  };

  const errorMessage = (error) => {
    console.log(error);
    setErrMsg('Login failed. Please try again.');
  };

  useEffect(() => {
    if (success) {
      navigate('/chat');
    }
  }, [success, navigate]);

  return (
    <>
      {success ? (
        <p>Redirecting...</p>
      ) : (
        <section className="login">
          <p className={errMsg ? 'errMsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <div className="container">
            <h1>LOGIN</h1>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </div>
        </section>
      )}
    </>
  );
}

export default UsrLogin;
