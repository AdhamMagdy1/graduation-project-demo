import Loading from '../../../../src/Loading';
import SideBar from '../SideBar';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Select from 'react-select';
import extractedData from '../../new/extractedData.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobalContext } from '../context';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SetRestaurant = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;


	const navigate = useNavigate();

	useEffect(() => {
		const getOwner = async () => {
			try {
				const token = localStorage.getItem('token');
				const res = await fetch(`${URL}/restaurant/owner`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': token,
					},
				});
				if (res.ok) {
					const userData = await res.json();
					if (!(userData.hasRestaurant)) {
						navigate("/restaurant/create");
					}
					console.log(`has restaurant status: ${userData.hasRestaurant}`);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getOwner();
	}, []);

	const { isFirstModalOpen,
		openFirstModal,
		closeFirstModal, } = useGlobalContext();

	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState();
	const [desc, setDesc] = useState();
	const [logo, setLogo] = useState(null);
	const [color, setColor] = useState();
	const [link, setLink] = useState();
	const [disabled, setDisabled] = useState(true);
	const [trigger, setTrigger] = useState(0);
	const [arr, setArr] = useState([]);

	const cities = extractedData;

	//getting restaurant info
	const getRestaurant = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/info`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			});
			if (!response.ok) {
				setIsLoading(false);
				console.log(`not ok`);
				return;
			} else {
				const resp = await response.json();
				if (resp.restaurant) {
					const restaurant = resp.restaurant;
					setName(restaurant.name);
					setDesc(restaurant.description);
					setColor(restaurant.themeColor);
					setLink(restaurant.link);
					setLogo(restaurant.logo);
				}
				console.log(`ok`);
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
		setIsLoading(false);
	};

	//getting delivery areas:
	const getDeliveryAreas = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/deliveryAreas`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			});
			if (!response.ok) {
				setIsLoading(false);
				console.log(`not ok`);
				return;
			} else {
				const resp = await response.json();
				if (resp.deliveryAreas) {
					const deliveryAreas = resp.deliveryAreas.map((item) => {
						const city = cities.find(city => city.code === item.city);
						const areas = city.cityDataModels.map(area => ({
							value: area.namePrimaryLang,
							label: area.namePrimaryLang
						}));
						return {
							id: nanoid(),
							selectedCity: item.city,
							selectedAreas: item.areas.map(area => ({
								value: area,
								label: area
							})),
							areas
						};
					});
					console.log(deliveryAreas);
					setArr(deliveryAreas);
				}
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		getRestaurant();
		getDeliveryAreas();
	}, [trigger]);

	//edit restaurant basic information:
	const handleSubmit = async (e) => {
		e.preventDefault();
		//preparing data:
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', desc);
		formData.append('themeColor', color);
		formData.append('logo', logo);
		//logging data before send:
		// for (let [key, value] of formData.entries()) {
		// 	console.log(`${key}: ${value}`);
		// }
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/edit/`, {
				method: 'PUT',
				headers: {
					Authorization: token,
				},
				body: formData,
			});
			if (!response.ok) {
				setIsLoading(false);
				const result = await response.json();
				console.log(result.message);
			} else {
				console.log('restaurant edited successfully');
				setTrigger(prev => prev + 1);
				setIsLoading(false);
				setDisabled(true);
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
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
	const changeCity = (id) => (e) => {
		const selectedCity = e.target.value;
		const cityData = cities.find((city) => city.code === selectedCity).cityDataModels;
		const newAreas = cityData.map((area) => ({ value: area.namePrimaryLang, label: area.namePrimaryLang }));
		setArr(arr.map((item) => item.id === id ? { ...item, selectedCity, areas: newAreas, selectedAreas: [] } : item));
	};
	const deleteCity = (id) => {
		setArr(arr.filter((item) => item.id !== id));
	};
	const changeAreas = (id) => (selectedOptions) => {
		setArr(arr.map((item) => item.id === id ? { ...item, selectedAreas: selectedOptions } : item));
	};

	//edit delivery areas:
	const handleDeliveryAreas = async (e) => {
		e.preventDefault();
		//preparing request body: 
		const newDeliveryAreas = arr.map(({ selectedCity, selectedAreas }) => ({
			city: selectedCity,
			areas: selectedAreas.map(area => area.value)
		}));
		const requestBody = { "deliveryAreas": newDeliveryAreas };
		console.log(requestBody);
		setIsLoading(true);
		//start sending data:
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/editDeliveryAreas`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(requestBody),
			});
			if (!response.ok) {
				setIsLoading(false);
				const result = await response.json();
				console.log(result.message);
			} else {
				console.log('delivery areas updated successfully');
				setIsLoading(false);
				setTrigger(prev => prev + 1);
			}
		} catch (error) {
			console.error('Error creating restaurant:', error);
			setIsLoading(false);
		}
	};


	//delete restaurant:
	const deleteRestaurant = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/delete/`, {
				method: 'DELETE',
				headers: {
					Authorization: token,
				},
			});
			const result = await response.json();
			if (response.status !== 200) {
				console.log(result.message);
				setIsLoading(false);
				navigate("/restaurant/create");
			} else {
				console.log(result.message);
				setIsLoading(false);
				closeFirstModal();
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	//copy link to clipboard:
	const saveToClipboard = async () => {
		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(`${link}`);
				toast.success("Link copied to clipboard");
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
			<div className="side-page" style={{ backgroundColor: '#f7f2e7' }}>
				<div className="side-page-nav">
					<div className="side-page-heading">
						restaurant information
					</div>
					<button className='btn delete' onClick={openFirstModal} >delete restaurant</button>
				</div>
				<div className='settings-container'>
					<p>Basic Information</p>
					<button className='btn enable-btn' type='button' onClick={() => setDisabled(!disabled)}>edit</button>
					<form style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
						{/* Restaurant name */}
						<label htmlFor="name">restaurant name</label>
						<input
							value={name}
							type="text"
							id='name'
							placeholder='Enter restaurant name'
							onChange={(e) => setName(e.target.value)}
							className=' input input-block '
							required
							disabled={disabled}
						/>

						{/* description */}
						<label htmlFor="desc">description</label>
						<textarea
							placeholder='Enter description'
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							className='input input-block'
							required
							disabled={disabled}
							id="desc"></textarea>

						{/* logo */}
						<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
							<div>
								{logo && (
									<img src={typeof logo === 'string' ? `data:image/png;base64,${logo.replace(/^\\x/, '')}` : URL.createObjectURL(logo)} alt="Current logo" style={{ width: '50px', height: '50px', margin: '10px 0px' }} />
								)}
							</div>
							<div style={{ marginLeft: '0.75rem' }} >
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
									disabled={disabled}
								/>
							</div>
						</div>

						{/* theme color */}
						<label htmlFor='color'>theme color</label>
						<input
							style={{ maxWidth: '7rem' }}
							className='color-input input-block'
							id='color'
							value={color}
							disabled={disabled}
							onChange={(e) => setColor(e.target.value)} type="color" name="" />

						{/* link */}
						<label htmlFor="name">restaurant link</label>
						<div className="link-holder">
							<input
								type="text"
								id='link'
								value={link}
								className='input-block '
								style={{ borderRightColor: 'transparent', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', padding: '0.25rem 0.75rem' }}
								required
								disabled
							/>
							<button
								type='button'
								style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
								onClick={() => saveToClipboard()}
								className='btn'>copy</button>
						</div>

						<button
							className={disabled ? 'btn btn-block disabled-btn' : 'btn btn-block'}
							disabled={disabled}
							type='submit'
						>
							done
						</button>
					</form>
				</div>
				<div className="settings-container" style={{ marginBottom: '2rem' }}>
					<div className="delivery-heading">
						<p>Delivery Areas</p>
						<button type='button' className='plus-icon' onClick={addCity}>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#eaa90f" d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16" /></svg>
						</button>
					</div>
					<form onSubmit={handleDeliveryAreas}>
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
						<button style={{ marginTop: '0.5rem' }} className='btn btn-block' type="submit">submit</button>
					</form>
				</div>
			</div>
			<ToastContainer position="top-center" />

			<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
				<div className="modal-container">
					<h2 className="modal-heading">
						delete restaurant
					</h2>
					<h4>are you sure you want to delete your restaurant?</h4>
					<div className="btn-holder">
						<button className='btn btn-black'>cancel</button>
						<button onClick={() => deleteRestaurant()} style={{ marginLeft: '1rem' }} className='btn delete' >delete</button>
					</div>
					<button className="close-modal-btn" onClick={closeFirstModal}>
						<FaTimes />
					</button>
				</div>
			</div>
		</div>
	);
};

export default SetRestaurant;