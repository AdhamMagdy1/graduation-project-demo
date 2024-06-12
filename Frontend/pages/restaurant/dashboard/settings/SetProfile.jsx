import { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Loading from '../../../../src/Loading';
import { useGlobalContext } from '../context';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const SetProfile = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;

	const navigate = useNavigate();

	const {
		openFirstModal,
		closeFirstModal,
		isFirstModalOpen,
		openSecondModal,
		closeSecondModal,
		isSecondModalOpen
	} = useGlobalContext();

	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [trigger, setTrigger] = useState(0);

	const [currentPwd, setCurrentPwd] = useState('');
	const [showCurrent, setShowCurrent] = useState(false);
	const [newPwd, setNewPwd] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [matchPwd, setMatchPwd] = useState('');
	const [showMatchPwd, setShowMatchPwd] = useState(false);

	const getOwner = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/owner/`, {
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
		getOwner();
	}, [trigger]);

	//edit name and email
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const newInfo = { name, email };
		try {
			const token = localStorage.getItem('token');
			const resp = await fetch(`${URL}/restaurant/owner/`, {
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

	//handle close modal:
	const handleCloseModal = () => {
		closeFirstModal();
		resetPasswords();
	};


	const resetPasswords = () => {
		setCurrentPwd('');
		setNewPwd('');
		setMatchPwd('');
		setShowCurrent(false);
		setShowMatchPwd(false);
		setShowPwd(false);
	};

	const changePassword = async (e) => {
		e.preventDefault();
		if (newPwd === matchPwd) {
			const body = {
				currentPassword: currentPwd,
				newPassword: newPwd,
			};
			setIsLoading(true);
			try {
				const token = localStorage.getItem('token');
				const resp = await fetch(`${URL}/restaurant/owner/changePassword`, {
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
					resetPasswords();
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

	const deleteAccount = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/owner/account/`, {
				method: 'DELETE',
				headers: {
					Authorization: token,
				},
			});
			const result = await response.json();
			if (response.status !== 200) {
				console.log(result.message);
				setIsLoading(false);
				closeSecondModal();
			} else {
				console.log(result.message);
				setIsLoading(false);
				closeSecondModal();
				localStorage.removeItem('token');
				navigate("/restaurant/login");
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="page-container">
				<SideBar />
				<Loading />
				<ToastContainer position="top-center" />
			</div>
		);
	}

	return (
		<div className="page-container">
			<SideBar />
			<div className="side-page">
				<div className="side-page-nav">
					<div className="side-page-heading">
						your profile
					</div>
					<button className='btn delete' onClick={openSecondModal} >delete account</button>
				</div>

				<div className="settings-container">
					<p>manage your account</p>
					<button className='btn enable-btn' type='button' onClick={() => setDisabled(!disabled)}>edit</button>

					<form
						onSubmit={handleSubmit}
						style={{
							marginTop: '1rem',
							borderBottom: '1px solid #cbd5e1',
							padding: ' 0.75rem'
						}}>
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

					<button
						className='settings-btn'
						onClick={openFirstModal}
					>
						change password
					</button>


				</div>

				<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
					<div className="modal-container">
						<h2 className="modal-heading">
							change password
						</h2>
						<form onSubmit={changePassword} className='modal-form'>
							{/* current password */}
							<div className="password">
								<input
									className='modal-input'
									placeholder='Current password'
									type={showCurrent ? "text" : "password"}
									value={currentPwd}
									onChange={(e) => setCurrentPwd(e.target.value)}
								/>
								<button className={showCurrent ? 'show-password show' : 'show-password'} type='button' onClick={() => setShowCurrent(!showCurrent)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M14 12c-1.095 0-2-.905-2-2c0-.354.103-.683.268-.973C12.178 9.02 12.092 9 12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3c1.641 0 3-1.358 3-3c0-.092-.02-.178-.027-.268c-.29.165-.619.268-.973.268" /><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5" /></svg>
								</button>
							</div>
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

							<button className='btn btn-block btn-black' type='submit' >change</button>
						</form>
						<button className="close-modal-btn" onClick={handleCloseModal}>
							<FaTimes />
						</button>
					</div>
				</div>

				<div className={isSecondModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
					<div className="modal-container">
						<h2 className="modal-heading">
							delete account
						</h2>
						<h4>are you sure you want to delete your account?</h4>
						<div className="btn-holder">
							<button className='btn btn-black' onClick={closeSecondModal}>cancel</button>
							<button onClick={() => deleteAccount()} style={{ marginLeft: '1rem' }} className='btn delete' >delete</button>
						</div>
						<button className="close-modal-btn" onClick={closeSecondModal}>
							<FaTimes />
						</button>
					</div>
				</div>

				<ToastContainer position="top-center" />

			</div>
		</div>
	);
};

export default SetProfile;