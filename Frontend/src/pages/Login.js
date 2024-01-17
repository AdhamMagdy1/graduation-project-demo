import './login.css';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [success]);

  const responseMessage = (response) => {
    // Send the ID token to your backend for verification
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) =>{
        console.log(data);
        window.localStorage.setItem('user',JSON.stringify(data.user))
        window.localStorage.setItem('token',data.token)
      }).then(()=>window.location.href ='/chat');
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <>
      {success ? (
        navigate('/chat')
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

export default Login;
