/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [accountType, setAccountType] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setErrMsg('');
	}, [success]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			"email": email,
			"password": password,
			"accountType": accountType
		};

		const login = async () => {
			try {
				const response = await fetch('http://localhost:5000/restaurant/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				const result = await response.json();
				if (response.status != 200) {
					setErrMsg(result.message);
				} else {
					setSuccess(true);
					const token = result.token;
					console.log(token);
					localStorage.setItem("token", token);

					const res = await fetch('http://localhost:5000/restaurant/owner', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': token,
						},
					});

					const userData = await res.json();
					localStorage.setItem("userData", JSON.stringify(userData));
					localStorage.setItem("isLogged", true);

					if (userData.hasRestaurant) {
						navigate("/restaurant/stats");
					} else {
						navigate("/restaurant/create");
					}
				}
			} catch (error) {
				// Handle any errors that occurred during the fetch
				console.error(error);
			}
		};
		login();
	};

	return (
		<main>
			<div className="form-container">
				<div className="logo">chef<span className="second-word">bot</span></div>
				<p className="text">sign in!</p>

				<form onSubmit={handleSubmit} className="form">

					<label htmlFor="email">email</label>
					<input type="email" name="email" id="email" placeholder="enter email"
						className="auth-form-input input-block"
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label htmlFor="password">password</label>
					<input type="password" name="password" id="password"
						placeholder="enter password"
						className="auth-form-input input-block"
						onChange={(e) => setPassword(e.target.value)} />

					<div className="radio-container">
						<label className='label' htmlFor="owner">owner</label>
						<input type="radio" name="account" id="owner" value="owner"
							onChange={(e) => setAccountType(e.target.value)}
						/>
					</div>


					<div className="radio-container">
						<label className='label' htmlFor="worker">worker</label>
						<input type="radio" name="account" id="worker" value="worker"
							onChange={(e) => setAccountType(e.target.value)}
						/>
					</div>

					<input type="submit" value="sign in" className="btn btn-block" />

				</form>

				<div className="text">
					do not have an account? <Link className="form-link" to="/restaurant/register" >sign up</Link>
				</div>
			</div>
		</main>
	);
};

export default Login;