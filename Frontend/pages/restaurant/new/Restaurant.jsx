import { useState } from 'react';
import extractedData from './extractedData.json';
import { nanoid } from 'nanoid';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../src/Loading';


const Restaurant = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;
	const navigate = useNavigate();

	const inputArr = [
		{
			id: nanoid(),
			value: "",
			selectedCity: '',
			selectedAreas: [],
			areas: []
		},
	];
	const [isLoading, setIsLoading] = useState(false);
	const [arr, setArr] = useState(inputArr);
	const cities = extractedData;
	const [name, setName] = useState('');
	const [desc, setDesc] = useState('');
	const [logo, setLogo] = useState(null);
	const [color, setColor] = useState('');

	const [errMsg, setErrMsg] = useState();

	//create a new restaurant:
	const resetRestaurant = () => {
		setName("");
		setDesc("");
		setLogo(null);
		setColor("");
		setArr([]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();

		// Append restaurant name, description, theme color
		formData.append('name', name);
		formData.append('description', desc);
		formData.append('themeColor', color);

		// Append logo file
		if (logo) {
			formData.append('logo', logo);
		}

		// Append delivery areas
		const deliveryAreas = arr.map(({ selectedCity, selectedAreas }) => ({
			city: selectedCity,
			areas: selectedAreas.map(area => area.value)
		}));

		formData.append('deliveryAreas', JSON.stringify(deliveryAreas));

		for (var pair of formData.entries()) {
			console.log(pair[0] + ': ' + pair[1]);
		} // Log the FormData object being sent

		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/setup`, {
				method: 'POST',
				headers: {
					Authorization: token,
				},
				body: formData,
			});

			if (!response.ok) {
				setIsLoading(false);
				const result = await response.json();
				setErrMsg(result.message);
				console.log(errMsg);
			} else {
				console.log('Restaurant created successfully');
				resetRestaurant();
				const userDataRes = await fetch(`${URL}/restaurant/owner`, {
					method: 'GET',
					headers: {
						Authorization: token,
					},
				});
				if (userDataRes.ok) {
					setIsLoading(false);
					const userData = await userDataRes.json();
					if (userData.hasRestaurant) {
						navigate(`/restaurant/menus`);
					}
				} else {
					setIsLoading(false);
					console.error('Failed to fetch user data');
				}
			}
		} catch (error) {
			console.error('Error creating restaurant:', error);
			setErrMsg('Internal server error');
		}
	};

	const changeCity = (id) => (e) => {
		const selectedCity = e.target.value;
		const cityData = cities.find((city) => city.code === selectedCity).cityDataModels;
		const newAreas = cityData.map((area) => ({ value: area.namePrimaryLang, label: area.namePrimaryLang }));
		setArr(arr.map((item) => item.id === id ? { ...item, selectedCity, areas: newAreas, selectedAreas: [] } : item));
	};


	const changeAreas = (id) => (selectedOptions) => {
		setArr(arr.map((item) => item.id === id ? { ...item, selectedAreas: selectedOptions } : item));
	};

	const addCity = () => {
		setArr((s) => {
			return [
				...s,
				{
					id: nanoid(),
					value: "",
					selectedCity: '',
					selectedAreas: [],
					areas: []
				}
			];
		});
	};

	const deleteCity = (id) => {
		setArr(arr.filter((item) => item.id !== id));
	};

	if (isLoading) {
		return <div className="page-container">
			<Loading />
		</div>;
	}

	return (
		<div className="container">
			<h2 className="container-heading">welcome to <div className="logo" style={{ display: 'inline', color: 'black' }}>chef<span className="second-word">bot</span></div></h2>
			<p>Now we would like you to fill this form, please.</p>
			<form onSubmit={handleSubmit}>
				{/* Restaurant name */}
				<label htmlFor="name">restaurant name</label>
				<input
					value={name}
					type="text"
					id='name'
					placeholder='Enter restaurant name'
					onChange={(e) => setName(e.target.value)}
					className=' input input-block '
					required />

				{/* description */}
				<label htmlFor="desc">description</label>
				<textarea
					placeholder='Enter description'
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					className='input input-block'
					required
					id="desc"></textarea>

				{/* logo */}
				<label htmlFor='logo'>logo</label>
				<input
					className='input input-block'
					type="file"
					id='logo'
					name="logo"
					onChange={(event) => {
						setLogo(event.target.files[0]);
						console.log(event.target.files);
					}}
					required
				/>

				{/* theme color */}
				<label htmlFor='color'>theme color</label>
				<input className='color-input' id='color' value={color} onChange={(e) => setColor(e.target.value)} type="color" name="" />

				<div className="delivery-container">
					<div className="delivery-heading">
						<h4>Delivery Areas</h4>
						<button type='button' className='plus-icon' onClick={addCity}>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#eaa90f" d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16" /></svg>
						</button>
					</div>
					{
						arr.map((item) => {
							return <div className="select-container" key={item.id}>

								<div className='mini-container'>
									<label htmlFor='city'>city</label>
									<select style={{ height: '2.2rem', padding: '0.3rem' }} className='select' id='city' value={item.selectedCity} onChange={changeCity(item.id)} >
										<option hidden>Select..</option>
										{
											cities.map((city) => {
												return <option value={city.code} key={nanoid()}>{city.code}</option>;
											})
										}
									</select>
								</div>

								<div className='mini-container'>
									<label htmlFor='area'>area</label>
									<Select
										styles={{ width: '100%' }}
										className='select'
										id='area'
										isMulti
										name="areas"
										options={item.areas}
										value={item.selectedAreas}
										onChange={changeAreas(item.id)}
									/>
								</div>
								{
									(arr.length > 1) && (
										<button className=' minus-icon' type='button' onClick={() => deleteCity(item.id)}>
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="#eaa90f"><path d="M8 11a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z" /><path fillRule="evenodd" d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1s11 4.925 11 11m-2 0a9 9 0 1 1-18 0a9 9 0 0 1 18 0" clipRule="evenodd" /></g></svg>
										</button>)
								}

							</div>;
						})
					}
				</div>

				<button className='btn btn-block' type="submit">submit</button>
			</form>
		</div>
	);
};

export default Restaurant;