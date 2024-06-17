import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

function UsrLogin() {
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [success]);

  const responseMessage = (response) => {
    fetch('http://localhost:5000/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.credential}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          window.localStorage.setItem('user', JSON.stringify(data.customer));
          window.localStorage.setItem('token', data.token);
          setSuccess(true);
          window.location.href = '/customer/chat';
        } else {
          setErrMsg('Login failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setErrMsg('Login failed. Please try again.');
      });
  };

  const errorMessage = (error) => {
    console.error('Google login error:', error);
    setErrMsg('Login failed. Please try again.');
  };

  return (
    <>
      <section className="login">
        <p className={errMsg ? 'errMsg' : 'offscreen'} aria-live="assertive">
          {errMsg}
        </p>
        <div className="container">
          <h1>LOGIN</h1>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
      </section>
    </>
  );
}

export default UsrLogin;
