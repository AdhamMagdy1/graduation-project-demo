/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { FaTimes } from "react-icons/fa";
import SideBar from './SideBar'
import { useGlobalContext } from './context';


const Menu = () => {

	const [products, setProducts] = useState([]);

	const [productName, setProductName] = useState("");
	const [productDesc, setProductDesc] = useState("");
	const [productPrice, setProductPrice] = useState();
	const [productQuantity, setProductQuantity] = useState();


	const [errMsg, setErrMsg] = useState();

	const { isModalOpen, openModal, closeModal } = useGlobalContext();


	const URL = import.meta.env.VITE_REACT_API_URL;
	const apiUrl = `${URL}/restaurant/products/all`


	const newProduct = {
		"products": [
			{
				"name": productName,
				"description": productDesc,
				"price": productPrice,
				"quantity": productQuantity,
			}
		]
	};

	const addProduct = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${URL}/restaurant/products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(newProduct)
			})
			const result = await response.json();
			if (response.status != 201) {
				setErrMsg(result.message);
				console.log(errMsg);
			} else {
				console.log(result.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const resetProduct = () => {
		setProductName("");
		setProductDesc("");
		setProductPrice(null);
		setProductPrice(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		addProduct();
		fetchData();
		closeModal();
		resetProduct();
	}

	const fetchData = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
			});
			const data = await response.json();
			setProducts(data);
		} catch (error) {
			console.log(error);
		}
	}


	useEffect(() => {
		fetchData();
	}, []);



	return (
		<>
			<div className="page-container">
				<SideBar />
				<div className="menu">
					<div className="menu-nav">
						<div className="menu-heading">menu</div>
						<div className="add-item">
							<button type='button' className='btn'
								onClick={openModal}
							>add new item</button>
						</div>
					</div>
					<ul className="menu-items">
						{
							products.map((product) => {
								return <li key={product.productId} className="menu-item">
									<div className="item-img">
										<img className='item-img' src="https://pngimg.com/d/pizza_PNG43991.png" alt="" />
									</div>
									<div className="item-name">{product.name}</div>
									<div className="item-quantity">{product.quantity}</div>
									<div className="item-price">{product.price}</div>
									<div className="item-desc">{product.desc}</div>
								</li>
							})
						}
					</ul>
				</div>


				<div
					className={isModalOpen ? "modal-overlay show-modal" : "modal-overlay"}
				>
					<div className="modal-container">
						<h2 className="modal-heading">
							add item
						</h2>
						<form onSubmit={handleSubmit} className='modal-form'>

							<input
								type="text"
								placeholder='product name'
								className='modal-input input-block'
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
							/>

							<input
								type="text"
								placeholder='description'
								className='modal-input input-block'
								value={productDesc}
								onChange={(e) => setProductDesc(e.target.value)}
							/>

							<input type="number"
								placeholder='price'
								className='modal-input input-block'
								value={productPrice}
								onChange={(e) => setProductPrice(e.target.value)}
							/>

							<input type="number"
								placeholder='quantity'
								className='modal-input input-block'
								value={productQuantity}
								onChange={(e) => setProductQuantity(e.target.value)}
							/>

							<button type='submit' className='btn btn-block btn-black '>add</button>
						</form>

						<button className="close-modal-btn" onClick={closeModal}>
							<FaTimes />
						</button>

					</div>
				</div>
			</div>
		</>
	)
}

export default Menu