import { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Loading from '../../../../src/Loading';
import { useGlobalContext } from '../context';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const SetEmployee = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;

	const { openFirstModal, closeFirstModal, isFirstModalOpen } = useGlobalContext();


	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [trigger, setTrigger] = useState(0);

	const [newPwd, setNewPwd] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [matchPwd, setMatchPwd] = useState('');
	const [showMatchPwd, setShowMatchPwd] = useState(false);


	const getEmployee = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/workerInfo`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			});
			if (!response.ok) {
				setIsLoading(false);
				console.log(response.message);
			} else {
				const resp = await response.json();
				setName(resp.name);
				setEmail(resp.email);
				setPassword(resp.password);
				console.log(`ok`);
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getEmployee();
	}, [trigger]);

	//edit name and email
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const newInfo = { name, email };
		try {
			const token = localStorage.getItem('token');
			const resp = await fetch(`${URL}/restaurant/worker`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(newInfo),
			});
			if (!resp.ok) console.log(resp.message);
			setTrigger(prev => prev + 1);
			setDisabled(true);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}

	};

	const changePassword = async (e) => {
		e.preventDefault();
		if (newPwd === matchPwd) {
			const body = {
				currentPassword: password,
				newPassword: newPwd
			};
			setIsLoading(true);
			try {
				const token = localStorage.getItem('token');
				const resp = await fetch(`${URL}/restaurant/worker/password`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token,
					},
					body: JSON.stringify(body),
				});
				if (!resp.ok) {
					setIsLoading(false);
					console.log(resp.message);
				} else {
					setTrigger(prev => prev + 1);
					closeFirstModal();
					setIsLoading(false);
				}

			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
		} else {
			toast.error(`passwords do not match!`);
		}
	};

	const copyAccount = async () => {
		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(`email: ${email}\npassword: ${password}`);
				toast.success("Account copied to clipboard");
			} catch (error) {
				toast.error("Failed to copy to clipboard", error);
			}
		} else {
			toast.error("Clipboard access not available");
		}
	};

	if (isLoading) {
		return (
			<div className="page-container">
				<SideBar />
				<Loading />
			</div>
		);
	}

	return (
		<div className="page-container">
			<SideBar />
			<div className="side-page">
				<div className="side-page-nav">
					<div className="side-page-heading">
						employee
					</div>
					<button type='button' onClick={copyAccount} className="btn">copy account</button>
				</div>
				<div className="settings-container">
					<p>your employee&#8216;s account</p>
					<button className='btn enable-btn' type='button' onClick={() => setDisabled(!disabled)}>edit</button>
					<form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>

						{/* name */}
						<label htmlFor="name">name</label>
						<input
							className='input input-block'
							type="text"
							name="name"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={disabled}
						/>

						{/* email */}
						<label htmlFor="email">email</label>
						<input
							className='input input-block'
							type="email"
							name="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={disabled}
						/>

						<button
							type='submit'
							className={disabled ? 'disabled-btn btn btn-block' : 'btn btn-block'}
							disabled={disabled}
						>done</button>

					</form>
				</div>

				<div className="settings-container">
					<p>password</p>
					<button className='btn enable-btn' type='button' onClick={openFirstModal}>edit</button>
					<form style={{ marginTop: '1.5rem' }}>
						{/* password */}
						<div className="password">
							<input
								className='input input-block'
								type={showPassword ? "text" : "password"}
								name='password'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								style={{
									top: '0',
									right: '0.5rem'
								}}
								className={showPassword ? 'show-password show' : 'show-password'} type='button' onClick={() => setShowPassword(!showPassword)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M14 12c-1.095 0-2-.905-2-2c0-.354.103-.683.268-.973C12.178 9.02 12.092 9 12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3c1.641 0 3-1.358 3-3c0-.092-.02-.178-.027-.268c-.29.165-.619.268-.973.268" /><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5" /></svg>
							</button>
						</div>
					</form>
				</div>

				<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
					<div className="modal-container">
						<h2 className="modal-heading">
							change password
						</h2>
						<form className='modal-form'>
							{/* new password */}
							<div className="password">
								<input
									className='modal-input'
									placeholder='New password'
									type={showPwd ? "text" : "password"}
									value={newPwd}
									onChange={(e) => setNewPwd(e.target.value)}
								/>
								<button className={showPwd ? 'show-password show' : 'show-password'} type='button' onClick={() => setShowPwd(!showPwd)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M14 12c-1.095 0-2-.905-2-2c0-.354.103-.683.268-.973C12.178 9.02 12.092 9 12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3c1.641 0 3-1.358 3-3c0-.092-.02-.178-.027-.268c-.29.165-.619.268-.973.268" /><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5" /></svg>
								</button>
							</div>

							{/* match  */}
							<div className="password">
								<input
									className='modal-input'
									placeholder='Confirm password'
									type={showMatchPwd ? "text" : "password"}
									value={matchPwd}
									onChange={(e) => setMatchPwd(e.target.value)}
								/>
								<button className={showMatchPwd ? 'show-password show' : 'show-password'} type='button' onClick={() => setShowMatchPwd(!showMatchPwd)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M14 12c-1.095 0-2-.905-2-2c0-.354.103-.683.268-.973C12.178 9.02 12.092 9 12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3c1.641 0 3-1.358 3-3c0-.092-.02-.178-.027-.268c-.29.165-.619.268-.973.268" /><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5" /></svg>								</button>
							</div>

							<button className='btn btn-block btn-black' type='submit' onClick={changePassword} >change</button>
						</form>
						<button className="close-modal-btn" onClick={closeFirstModal}>
							<FaTimes />
						</button>
					</div>
				</div>

				<ToastContainer position="top-center" />
			</div>
		</div>
	);
};

export default SetEmployee;