import { useRef, useState, useEffect } from "react";
import {
  // faCheck,
  // faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./userregister.css";
import { Link } from "react-router-dom";

const userRgx = /^[0-9A-Za-z]{6,16}$/;
const pwdRgx = /^(?=.*?[0-9])(?=.*[@$!%*?&])(?=.*?[A-Za-z]).{8,32}$/;

function Registeru() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = userRgx.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = pwdRgx.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if button was enabled with js hack:
    const v1 = userRgx.test(user);
    const v2 = pwdRgx.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    console.log(user, pwd);
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Your registration was successfully Complited!</h1>
          <p>
            <a href="./Login.js">Sign In!</a>
          </p>
        </section>
      ) : (
        <section className="register-u">
          <section className="main-u">
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>REGISTER</h1>
            <form onSubmit={handleSubmit}>
              {/* <label htmlFor="username">
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label> */}
              <input
                type="text"
                id="username"
                className={validName && user ? "valid" : "invalid"}
                placeholder="Username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                &nbsp;6 to 16 Characters. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
              {/* <label htmlFor="password">
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label> */}
              <input
                type="password"
                className={validPwd && pwd ? "valid" : "invalid"}
                placeholder="Password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                &nbsp;8 to 32 characters. <br />
                Must include uppercase letters, a number and a special
                character. <br />
                Allowed specil characters:
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span>
                <span aria-label="percentage">%</span>
              </p>
              {/* <label htmlFor="confirm_pwd">
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label> */}
              <input
                type="password"
                className={validMatch && matchPwd ? "valid" : "invalid"}
                placeholder="Confirm password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aris-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                &nbsp;Must match the first password input field.
              </p>
              <input
                type="submit"
                value="Create Account"
                disabled={!validName || !validPwd || !validMatch ? true : false}
              />
            </form>

            <p className="go-to-login">
              Already Have An Account?
              <span className="line">
                {}
                <Link to="/userlogin">&nbsp;Login!</Link>
              </span>
            </p>
          </section>
        </section>
      )}
    </>
  );
}

export default Registeru;
