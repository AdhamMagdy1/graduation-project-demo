import "./userlogin.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Loginu() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [sucess, setSucess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    setUser("");
    setPwd("");
    setSucess(true);
  };

  return (
    <>
      {sucess ? (
        navigate("/userdashboard")
      ) : (
        <section className="login-u">
          <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div className="container-u">
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit} className="content-u">
              <input
                type="text"
                placeholder="Username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <input type="submit" value="Login" />
            </form>
            <p className="go-to-register">
              Don't Have An Account?
              <Link to="/userregister">Sign Up!</Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export default Loginu;
