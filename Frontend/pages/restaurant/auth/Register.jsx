import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const userRgx = /^[0-9A-Za-z]{6,16}$/;
const pwdRgx = /^(?=.*?[0-9])(?=.*[@$!%*?&])(?=.*?[A-Za-z]).{8,32}$/;

const apiUrl = import.meta.env.VITE_REACT_API_URL;

const RestaurantRegister = () => {
	const navigate = useNavigate();

	const userRef = useRef(null);
	// const errRef = useRef();

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState("");


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
		console.log(v1, v2);
		if (!v1 || !v2) {
			setErrMsg("Invalid Entry");
			return;
		}

		const data = {
			"name": user,
			"password": pwd,
			"email": email,
		};

		const register = async () => {
			try {
				const response = await fetch(`${apiUrl}/restaurant/create`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				const result = await response.json();
				if (response.status != 201) {
					setErrMsg(result.message);
				} else {
					setSuccess(true);
					console.log(result.message);
				}

			} catch (error) {
				// Handle any errors that occurred during the fetch
				console.error(error);
			}
		};

		register();

	};



	return (
		<>
			{success ? (
				navigate('/restaurant/login')
			) : (
				<main>
					<div className="form-container">
						<div className="logo" style={{ color: 'white' }}>chef<span className="second-word">bot</span></div>
						<p className="text">sign up as a shop owner</p>


						<form onSubmit={handleSubmit} className="form">


							{/* username field  */}
							<label htmlFor="user">name</label>
							<input
								type="text"
								name="user"
								id="user"
								placeholder="enter your name"
								className={validName && user ? "valid auth-form-input input-block" : "invalid auth-form-input input-block"}
								ref={userRef}
								onChange={(e) => setUser(e.target.value)}
								onFocus={() => setUserFocus(true)}
								onBlur={() => setUserFocus(false)}
								required
							/>
							<div className="info">
								<p className={userFocus && user && !validName ? "instructions" : "offscreen"}>
									&nbsp;6 to 16 Characters.
									Must begin with a letter.
									Letters, numbers, underscores, hyphens allowed
								</p>
							</div>

							{/* email field */}
							<label htmlFor="email">email address</label>
							<input
								type="email"
								name="email"
								id="email"
								placeholder="enter your email"
								onChange={(e) => setEmail(e.target.value)}
								required
								className="auth-form-input input-block"
							/>

							{
								errMsg ?

									<p className="err">{errMsg}</p> :
									<p className="offscreen"></p>
							}


							{/* password field */}
							<label htmlFor="password">password</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="enter your password"
								className={validPwd && pwd ? "valid auth-form-input input-block " : "invalid auth-form-input input-block"}
								onChange={(e) => setPwd(e.target.value)}
								onFocus={() => setPwdFocus(true)}
								onBlur={() => setPwdFocus(false)}
								required
							/>
							<div className="info">
								<p
									className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
								>
									&nbsp;8 to 32 characters. Must include uppercase letters, a number and a special character.
									Allowed specil characters:
									<span aria-label="exclamation mark"> !</span>
									<span aria-label="at symbol">@</span>
									<span aria-label="hashtag">#</span>
									<span aria-label="dollar sign">$</span>
									<span aria-label="percentage">%</span>
								</p>
							</div>


							{/* confirm password field */}
							<label htmlFor="confirm-password">confirm password</label>
							<input
								type="password"
								name="confirm-password"
								id="confirm-password"
								placeholder="re-enter your password"
								className={validMatch && matchPwd ? "valid auth-form-input input-block" : "invalid auth-form-input input-block"}
								onChange={(e) => setMatchPwd(e.target.value)}
								onFocus={() => setMatchFocus(true)}
								onBlur={() => setMatchFocus(false)}
								required
							/>
							<div className="info">
								<p className={matchFocus && !validMatch ? "instructions" : "offscreen"} >passwords do not match</p>
							</div>

							<input type="submit" className="btn-block btn" value="sign up" />
						</form>

						<div className="text">
							already have an account? <Link className="form-link" to='/restaurant/login'> sign in</Link>
						</div>
					</div >
				</main >
			)}
		</>
	);
};





export default RestaurantRegister;