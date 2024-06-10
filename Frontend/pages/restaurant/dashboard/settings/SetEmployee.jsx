import { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Loading from '../../../../src/Loading';
const SetEmployee = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;


	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [trigger, setTrigger] = useState(0);

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
						<label htmlFor="">email</label>
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
			</div>
		</div>
	);
};

export default SetEmployee;