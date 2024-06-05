import { useState } from "react";
import Loading from '../../../src/Loading';
import { useNavigate } from 'react-router-dom';


const Menus = () => {
	const URL = import.meta.env.VITE_REACT_API_URL;
	const navigate = useNavigate();

	const [menu, setMenu] = useState(null);
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('description', description);

		for (let i = 0; i < menu.length; i++) {
			formData.append('menuImage', menu[i]);
		}

		for (let [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`);
		}

		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/menu/upload`, {
				method: 'POST',
				headers: {
					Authorization: token,
				},
				body: formData,
			});
			if (!response.ok) {
				setIsLoading(false);
				const result = await response.json();
				// setErrMsg(result.message);
				console.log(result.message);
			} else {
				console.log('Menu uploaded successfully');
				// resetRestaurant();
				navigate(`/restaurant/menu`);

			}

		} catch (error) {
			console.log(error);
		}
	};

	if (isLoading) {
		return <div className="page-container">
			<Loading />
		</div>;
	}

	return (
		<div className="container">
			<h2 className="container-heading">welcome to <div className="logo" style={{ display: 'inline', color: 'black' }}>chef<span className="second-word">bot</span></div></h2>
			<p>please upload your menu here:</p>
			<form>
				{/* menu files */}
				<label htmlFor='menuImage'>Menu</label>
				<input
					className='input input-block'
					type="file"
					id='menuImage'
					name="menuImage"
					onChange={(event) => {
						setMenu(event.target.files);
						console.log(event.target.files);
					}}
					required
					multiple
				/>

				{/* description */}
				<label htmlFor="description">description</label>
				<input
					type="text"
					className='input input-block '
					name='description'
					id='description'
					placeholder='description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<button className='btn btn-block' onClick={handleSubmit} type='submit'>done</button>
			</form>
		</div>
	);
};

export default Menus;