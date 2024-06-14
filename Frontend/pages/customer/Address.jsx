import { useState } from 'react';
import { nanoid } from 'nanoid';
import extractedData from '../restaurant/new/extractedData.json';
import { useNavigate } from 'react-router-dom';


const Auth = () => {

	const URL = import.meta.env.VITE_REACT_API_URL;
	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4MzY5MTQzLCJleHAiOjE3MTkwMTcxNDN9.7nSK6tG0R2jnBE91aC9aTIVRAkTSR-9pp-G4ISHJK5s';

	const navigate = useNavigate();

	const [isloading, setIsloading] = useState(false);

	const cities = extractedData;
	const [selectedCity, setSelectedCity] = useState('');
	const [areas, setAraes] = useState([]);
	const [selectedArea, setSelectedArea] = useState('');

	const [street, setStreet] = useState('');
	const [building, setBuilding] = useState('');
	const [apartment, setApartment] = useState('');

	const changeCity = (e) => {
		setSelectedCity(e.target.value);
		setAraes(cities.find((city) => city.code === e.target.value).cityDataModels);
	};

	const changeArea = (e) => {
		setSelectedArea(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const body = { addressDescription: `${building} ${street} str, apartment ${apartment}, ${selectedArea}, ${selectedCity} ` };
		// console.log(body);
		setIsloading(true);
		try {
			const resp = await fetch(`${URL}/customer/createAddress`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(body),
			});
			if (resp.ok) {
				setIsloading(false);
				const customerData = await resp.json();
				localStorage.setItem('addressId', customerData.address.addressId);
				localStorage.setItem('customerId', customerData.address.customerId);
				navigate(`/customer/chat`);
			} else {
				setIsloading(false);
				console.log(resp.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='page-container' style={{ alignItems: 'center', justifyContent: 'center' }}>{/* city */}
			<div className="form-holder">
				{
					isloading &&
					<div className="overlay"></div>
				}
				<form onSubmit={handleSubmit} className='address-form'>
					{/* city */}
					<div className="input-holder">
						<label>city <span style={{ color: 'red' }} >*</span></label>
						<select required className='input-block' value={selectedCity} onChange={changeCity} >
							<option hidden>Select a city</option>
							{
								cities.map((city) => {
									return <option value={city.code} key={nanoid()}>{city.code}</option>;

								})
							}
						</select>
					</div>

					{/* Area */}
					<div className="input-holder">
						<label>area <span style={{ color: 'red' }} >*</span> </label>
						<select required className='input-block' value={selectedArea} onChange={changeArea}>
							<option hidden>Select an area</option>
							{
								areas.map((area) => {
									return <option value={area.namePrimaryLang} key={area.id}>
										{area.namePrimaryLang}
									</option>;
								})
							}
						</select>
					</div>

					{/* street */}
					<div className="input-holder">
						<label>street name <span style={{ color: 'red' }} >*</span></label>
						<input
							style={{ caretColor: '#f49191' }}
							className='input-block'
							type="text"
							placeholder='Street name'
							value={street}
							onChange={(e) => setStreet(e.target.value)}
							required
						/>
					</div>

					{/* buliding */}
					<div className="input-holder">
						<label>buliding name/number</label>
						<input
							style={{ caretColor: '#f49191' }}
							className='input-block'
							type="text"
							placeholder='Builing name/number'
							value={building}
							onChange={(e) => setBuilding(e.target.value)}
						/>
					</div>

					{/* apartment */}
					<div className="input-holder">
						<label>apartment number</label>
						<input
							style={{ caretColor: '#f49191' }}
							className='input-block'
							type="text"
							placeholder='Apartment number'
							value={apartment}
							onChange={(e) => setApartment(e.target.value)}
						/>
					</div>

					<button className='address-btn' type='submit' >done</button>
				</form>
			</div>

		</div>
	);
};

export default Auth;