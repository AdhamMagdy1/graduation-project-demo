/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import { useGlobalContext } from '../dashboard/context';
import { toast, ToastContainer } from 'react-toastify';
const Login = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;


	const {
		openFirstModal,
		closeFirstModal,
		isFirstModalOpen } = useGlobalContext();

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
					// console.log(token);
					localStorage.setItem("token", token);

					const accountType = result.accountType;
					localStorage.setItem("accountType", accountType);

					if (accountType === 'owner') {
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
							localStorage.setItem("hasRestaurant", userData.hasRestaurant);
							navigate("/restaurant/stats");
						} else {
							navigate("/restaurant/create");
						}
					}
					if (accountType === 'worker') {
						localStorage.setItem("isLogged", true);
						navigate('/restaurant/orders');
					}

				}
			} catch (error) {
				// Handle any errors that occurred during the fetch
				console.error(error);
			}
		};
		login();
	};

	const forgotPassword = async (e) => {
		e.preventDefault();
		const body = { email: email };
		closeFirstModal();
		try {
			const resp = await fetch(`${URL}/restaurant/owner/forgotPassword`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			if (resp.ok) toast.success(`An email was sent to you`);
			if (resp.status === 404) toast.error(`Sorry, This email is not registered`);
			else console.log(resp.message);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main>
			<div className="form-container">
				<div className="logo">chef<span className="second-word">bot</span></div>
				<p className="text">sign in!</p>

				<form onSubmit={handleSubmit} className="form">

					{/* email */}
					<label htmlFor="email">email</label>
					<input type="email" name="email" id="email" placeholder="enter email"
						className="auth-form-input input-block"
						onChange={(e) => setEmail(e.target.value)}
					/>

					{/* password */}
					<label htmlFor="password">password</label>
					<input type="password" name="password" id="password"
						placeholder="enter password"
						className="auth-form-input input-block"
						onChange={(e) => setPassword(e.target.value)} />

					{/* account type */}
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

				<div className="text" style={{ margin: '0.5rem 0' }}>
					<button
						style={{
							cursor: 'pointer',
							backgroundColor: 'transparent',
							borderColor: 'transparent',
							fontWeight: '500',
							fontSize: '16px',
							textTransform: 'capitalize'
						}}
						type='button'
						className="form-link"
						onClick={openFirstModal}
					>
						forgot password?
					</button>
				</div>

				<div className="text">
					do not have an account? <Link style={{ fontWeight: '500' }} className="form-link" to="/restaurant/register" >sign up</Link>
				</div>
			</div>

			<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
				<div className="modal-container">
					<h2 style={{ color: 'black' }} className="modal-heading">
						forgot password
					</h2>
					<form onSubmit={forgotPassword} className='modal-form'>

						<input
							type="email"
							placeholder='enter your email'
							className='modal-input'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button type='submit' className='btn btn-block btn-black '>done</button>
					</form>

					<button className="close-modal-btn" onClick={closeFirstModal}>
						<  FaTimes style={{ color: 'black' }} />
					</button>
				</div>
			</div>
			<ToastContainer position="top-center" />
		</main>
	);
};

export default Login;