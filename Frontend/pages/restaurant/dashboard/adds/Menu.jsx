import SideBar from '../SideBar';
import Loading from '../../../../src/Loading';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../context';
import { FaTimes } from 'react-icons/fa';
import useDeleteItem from '../../../../src/hooks/useDeleteItem';

const Menu = () => {

	const {
		isFirstModalOpen,
		openFirstModal,
		closeFirstModal,
		isSecondModalOpen,
		openSecondModal,
		closeSecondModal } = useGlobalContext();
	const URL = import.meta.env.VITE_REACT_API_URL;
	const [images, setImages] = useState([]);
	const [menuItem, setMenuItem] = useState();
	const [description, setDescription] = useState('');
	const [currentItem, setCurrentItem] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [trigger, setTrigger] = useState(0);

	//fetching menu:
	useEffect(() => {
		const fetchImages = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${URL}/restaurant/menu/get/`, {
					headers: {
						'Authorization': localStorage.getItem('token'),
					},
				});
				if (response.status === 200) {
					const data = await response.data;
					console.log(data);
					const base64Images = data.map(item => {
						const base64String = item.menuImage; // assuming item.menuImage is already a valid base64 string
						return {
							...item,
							menuImage: `data:image/png;base64,${base64String.replace(/^\\x/, '')}`, // removing the leading \x
						};
					});
					setImages(base64Images);
					setIsLoading(false);
				} else {
					console.error('Failed to fetch images');
					setIsLoading(false);
				}
			} catch (error) {
				setIsLoading(false);
				console.error('Error fetching images:', error);
			}
		};

		fetchImages();
	}, [trigger]);


	const resetMenu = () => {
		setMenuItem(null);
		setDescription('');
	};

	//editing menu:
	const handleEdit = (id, desc) => {
		openSecondModal();
		setDescription(desc);
		setCurrentItem(id);
	};
	const editMenu = async (id) => {

		const formData = new FormData();
		formData.append('description', description);
		formData.append('menuImage', menuItem);
		//logging data before send:
		for (let [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`);
		}
		setIsLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${URL}/restaurant/menu/${id}/`, {
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
				console.log('Menu uploaded successfully');
				resetMenu();
				setIsLoading(false);
				setTrigger(prev => prev + 1);
				closeSecondModal();
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	//add new menu: 
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('description', description);
		for (let i = 0; i < menuItem.length; i++) {
			formData.append('menuImage', menuItem[i]);
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
				console.log(result.message);
			} else {
				setIsLoading(false);
				closeFirstModal();
				console.log('Menu uploaded successfully');
				setTrigger(prev => prev + 1);
				resetMenu();
			}

		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	//delete menu item: 
	const { deleteItem } = useDeleteItem(`/restaurant/menu/`);
	const deleteMenu = async (id) => {
		setIsLoading(true);
		const resp = await deleteItem(id);
		if (resp) {
			setIsLoading(false);
			setTrigger(prev => prev + 1);
		} else {
			console.log('Sorry, something went wrong. cannot delete item');
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (<div className="page-container">
			<SideBar />
			<Loading />
		</div>);

	}

	return <div className="page-container">
		<SideBar />
		<div className="side-page">
			<div className="side-page-nav">
				<div className="side-page-heading">menu</div>
				<div className="add-item">
					<button onClick={openFirstModal} className='btn' type='button'>add</button>
				</div>
			</div>

			<ul className="list-items">
				<div className="menu-container">
					{
						images?.map((image) => {
							return <div key={image.menuId} className="menu-item">
								<img className='menu-img' src={image.menuImage} alt="menu image" />
								<div className="menu-description">
									<p>{image.description}</p>
									<div className="actions">
										<button onClick={() => deleteMenu(image.menuId)} className="btn-action btn-red">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" /></svg>
										</button>
										<button onClick={() => handleEdit(image.menuId, image.description)} className="btn-action btn-green" >
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M17.204 10.796L19 9c.545-.545.818-.818.964-1.112a2 2 0 0 0 0-1.776C19.818 5.818 19.545 5.545 19 5c-.545-.545-.818-.818-1.112-.964a2 2 0 0 0-1.776 0c-.294.146-.567.419-1.112.964l-1.819 1.819a10.9 10.9 0 0 0 4.023 3.977m-5.477-2.523l-6.87 6.87c-.426.426-.638.638-.778.9c-.14.26-.199.555-.316 1.145l-.616 3.077c-.066.332-.1.498-.005.593c.095.095.26.061.593-.005l3.077-.616c.59-.117.885-.176 1.146-.316c.26-.14.473-.352.898-.777l6.89-6.89a12.901 12.901 0 0 1-4.02-3.98" clipRule="evenodd" /></svg>
										</button>
									</div>
								</div>

							</div>;
						})
					}
				</div>
			</ul>

			<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
				<div className="modal-container">
					<h2 className="modal-heading">
						add extra
					</h2>
					<form className='modal-form'>
						<input
							type="file"
							name='menuImage'
							className='modal-input'
							onChange={(e) => setMenuItem(e.target.files)}
							required
						/>
						<input
							type="text"
							placeholder='description'
							name='description'
							className='modal-input'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<button onClick={handleSubmit} type='submit' className='btn btn-block btn-black '>add</button>
					</form>

					<button className="close-modal-btn" onClick={closeFirstModal}>
						<FaTimes />
					</button>
				</div>
			</div>

			<div className={isSecondModalOpen ? "modal-overlay show-modal" : "modal-overlay"}>
				<div className="modal-container">
					<h2 className="modal-heading">
						edit Menu
					</h2>
					<form onSubmit={(e) => {
						e.preventDefault();
						editMenu(currentItem);
					}} className='modal-form'>

						<input
							type="file"
							name='menuImage'
							id='menuImage'
							className='modal-input'
							onChange={(e) => {
								console.log(e.target.files[0]);
								setMenuItem(e.target.files[0]);
							}}
							required
						/>
						<input
							type="text"
							placeholder='description'
							name='descriptoin'
							className='modal-input'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<button type='submit' className='btn btn-block btn-black ' >edit</button>
					</form>

					<button className="close-modal-btn" onClick={closeSecondModal}>
						<FaTimes />
					</button>
				</div>
			</div>
		</div>
	</div>;
};

export default Menu;