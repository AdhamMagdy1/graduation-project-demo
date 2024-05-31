import { useState } from 'react';
import { nanoid } from 'nanoid';
import extractedData from './extractedData.json';


const Auth = () => {

	const cities = extractedData;
	const [selectedCity, setSelectedCity] = useState('');
	const [areas, setAraes] = useState([]);
	const [selectedArea, setSelectedArea] = useState('');

	const changeCity = (e) => {
		setSelectedCity(e.target.value);
		setAraes(cities.find((city) => city.code === e.target.value).cityDataModels);
	};


	const changeArea = (e) => {
		setSelectedArea(e.target.value);
	};

	return (
		<div>{/* city */}
			<span>city</span>
			<select value={selectedCity} onChange={changeCity} >
				{
					cities.map((city) => {
						return <option value={city.code} key={nanoid()}>{city.code}</option>;

					})
				}
			</select>

			{/* Area */}
			<span>area</span>
			<select value={selectedArea} onChange={changeArea}>
				{
					areas.map((area) => {
						return <option value={area.namePrimaryLang} key={area.id}>
							{area.namePrimaryLang}
						</option>;
					})
				}
			</select></div>
	);
};

export default Auth;