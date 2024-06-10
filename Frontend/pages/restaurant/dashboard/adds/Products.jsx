/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link, useParams, useLocation } from 'react-router-dom';
import SideBar from '../SideBar';
import Loading from '../../../../src/Loading';
import { useGlobalContext } from '../context';
import Empty from '../Empty';
import useFetch from '../../../../src/hooks/useFetch';
import useDeleteItem from '../../../../src/hooks/useDeleteItem';
import useAddItem from '../../../../src/hooks/useAddItem';
import useEditItem from '../../../../src/hooks/useEditItem';


const Products = (props) => {
	const { categoryId } = useParams();
	const url = `/restaurant/products/category/${categoryId}`;
	const [updateTrigger, setUpdateTrigger] = useState(0);
	const { isLoading, data: products } = useFetch(url, [updateTrigger]);


	const {
		isFirstModalOpen,
		openFirstModal,
		closeFirstModal,
		isSecondModalOpen,
		openSecondModal,
		closeSecondModal } = useGlobalContext();

	const [productName, setProductName] = useState("");
	const [ingredient, setIngredients] = useState("");
	const [size, setSize] = useState({ small: null, medium: null, large: null });
	const [activeId, setActiveID] = useState();
	const [currentProduct, setCurrentProduct] = useState();

	//delete product:
	const { deleteItem } = useDeleteItem(`/restaurant/products/`);
	const deleteProduct = async (id) => {
		const resp = await deleteItem(id);
		if (resp) {
			setUpdateTrigger(prev => prev + 1);
		} else {
			console.log('Sorry, something went wrong. cannot delete item');
		}
	};

	const toggleProduct = (id) => {
		const newActiveId = id === activeId ? null : id;
		setActiveID(newActiveId);
	};

	const filteredSize = Object.fromEntries(
		Object.entries(size).filter(([key, value]) => value !== null)
	);
	const newProduct = {
		product: {
			name: productName,
			ingredient,
			size: filteredSize,
			categoryId,
		}
	};
	//adding new prodduct:
	const { addItem } = useAddItem(`/restaurant/product`);
	const resetProduct = () => {
		setProductName('');
		setIngredients('');
		setSize({ small: null, medium: null, large: null });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(newProduct);
		const resp = await addItem(newProduct);
		if (resp) {
			setUpdateTrigger(prev => prev + 1);
			closeFirstModal();
			resetProduct();
		} else {
			console.log('Sorry, something went wrong');
		}
	};

	//editing product:
	const handleEdit = (id, name, ing, size) => {
		setCurrentProduct(id);
		setProductName(name);
		setIngredients(ing);
		setSize({ small: size.small, medium: size.medium, large: size.large });
		openSecondModal();
		console.log(newProduct);
	};
	const editUrl = `/restaurant/products/`;
	const { editItem } = useEditItem(editUrl);
	const editProduct = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		const editedProduct = {
			name: productName,
			ingredient,
			size,
			categoryId,
		};
		console.log(editedProduct);
		const resp = await editItem(currentProduct, editedProduct);
		if (resp) {
			setUpdateTrigger(prev => prev + 1);
			closeSecondModal();
		} else {
			console.log(`sorry, somthing went wrong. cannot edit item`);
		}
	};

	if (isLoading) {
		return (<div className="page-container">
			<SideBar />
			<Loading />
		</div>);
	}

	if (!products) {
		return <div className="page-container">
			<Empty pageName={"products"} openFirstModal={openFirstModal} />
			<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
				<div className="modal-container">
					<h2 className="modal-heading">
						add product
					</h2>
					<form style={{ width: '100%' }} onSubmit={handleSubmit} className='modal-form'>

						<div className="input-holder">
							<label htmlFor="name">name</label>
							<input
								type="text"
								name='name'
								id='name'
								placeholder='product name'
								className='modal-input input-block'
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
								required
							/>
						</div>

						<div className="input-holder">
							<label htmlFor="ingredients">ingredients</label>
							<input
								type="text"
								name='ingredients'
								id='ingredients'
								placeholder='ing1, ing2, ing3,..'
								className='modal-input input-block'
								value={ingredient}
								onChange={(e) => setIngredients(e.target.value)}
								required
							/>
						</div>

						<div className="sizes-container">
							<label htmlFor="size">small</label>
							<input
								type="number"
								name="small"
								id="size"
								className=' input-num'
								value={size.small !== null ? size.small : ""}
								onChange={(e) => setSize({ ...size, small: +e.target.value })}
								required />
							<label htmlFor="size">medium</label>
							<input
								type="number"
								name="medium"
								id="size"
								className='input-num'
								value={size.medium !== null ? size.medium : ""}
								onChange={(e) => setSize({ ...size, medium: +e.target.value })}
							/>
							<label htmlFor="size">large</label>
							<input
								type="number"
								name="large"
								id="size"
								className='input-num'
								value={size.large !== null ? size.large : ""}
								onChange={(e) => setSize({ ...size, large: +e.target.value })}
							/>
						</div>

						<button onClick={handleSubmit} type='submit' className='btn btn-block btn-black '>add</button>
					</form>

					<button className="close-modal-btn" onClick={closeFirstModal}>
						<FaTimes />
					</button>
				</div>
			</div>
		</div>;
	}

	return (
		<div className='page-container'>
			<SideBar />
			<div className="side-page">
				<div className="side-page-nav">
					<div className="side-page-heading">products</div>
					<div className="add-item">
						<button onClick={openFirstModal} type='button' className='btn'
						>add new product</button>
					</div>
				</div>
				<ul className="list-items">
					{
						products.map((product) => {
							const isActive = product.productId === activeId;
							return <li key={product.productId} className='long-item li'>
								<div className="item">
									<div className="item-name">
										{product.name}
									</div>
									<div className="actions">
										<button onClick={() => deleteProduct(product.productId)} className="btn-action btn-red">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" /></svg>
										</button>
										<button className="btn-action btn-green" onClick={() => handleEdit(product.productId, product.name, product.ingredient, product.size)} >
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M17.204 10.796L19 9c.545-.545.818-.818.964-1.112a2 2 0 0 0 0-1.776C19.818 5.818 19.545 5.545 19 5c-.545-.545-.818-.818-1.112-.964a2 2 0 0 0-1.776 0c-.294.146-.567.419-1.112.964l-1.819 1.819a10.9 10.9 0 0 0 4.023 3.977m-5.477-2.523l-6.87 6.87c-.426.426-.638.638-.778.9c-.14.26-.199.555-.316 1.145l-.616 3.077c-.066.332-.1.498-.005.593c.095.095.26.061.593-.005l3.077-.616c.59-.117.885-.176 1.146-.316c.26-.14.473-.352.898-.777l6.89-6.89a12.901 12.901 0 0 1-4.02-3.98" clipRule="evenodd" /></svg>
										</button>
										<button
											onClick={() => toggleProduct(product.productId)}
											className="btn-action " >
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 16c3.13 0 5.963-1.833 8.5-5.5C16.463 6.833 13.63 5 10.5 5S4.537 6.833 2 10.5c2.537 3.667 5.37 5.5 8.5 5.5" /><path d="M10.5 7c.185 0 .366.014.543.042a2.5 2.5 0 0 0 2.915 2.916A3.5 3.5 0 1 1 10.5 7" /></g></svg>
										</button>
									</div>

								</div>
								{
									isActive &&
									<div className="item-info">
										{product.size.small &&
											(<div className="item-price">
												small size: {product.size.small}$
											</div>)
										}
										{product.size.medium &&
											<div className="item-price">
												medium size: {product.size.medium}$
											</div>
										}
										{
											product.size.large &&
											<div className="item-price">
												large size: {product.size.large}$
											</div>
										}
										<p className="item-desc">Ingredients: {product.ingredient}</p>
									</div>
								}
							</li>;
						})
					}
				</ul>

				<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
					<div className="modal-container">
						<h2 className="modal-heading">
							add product
						</h2>
						<form style={{ width: '100%' }} onSubmit={handleSubmit} className='modal-form'>

							<div className="input-holder">
								<label htmlFor="name">name</label>
								<input
									type="text"
									name='name'
									id='name'
									placeholder='product name'
									className='modal-input input-block'
									value={productName}
									onChange={(e) => setProductName(e.target.value)}
									required
								/>
							</div>

							<div className="input-holder">
								<label htmlFor="ingredients">ingredients</label>
								<input
									type="text"
									name='ingredients'
									id='ingredients'
									placeholder='ing1, ing2, ing3,..'
									className='modal-input input-block'
									value={ingredient}
									onChange={(e) => setIngredients(e.target.value)}
									required
								/>
							</div>

							<div className="sizes-container">
								<label htmlFor="size">small</label>
								<input
									type="number"
									name="small"
									id="size"
									className=' input-num'
									value={size.small !== null ? size.small : ""}
									onChange={(e) => setSize({ ...size, small: +e.target.value })}
									required />
								<label htmlFor="size">medium</label>
								<input
									type="number"
									name="medium"
									id="size"
									className='input-num'
									value={size.medium !== null ? size.medium : ""}
									onChange={(e) => setSize({ ...size, medium: +e.target.value })}
								/>
								<label htmlFor="size">large</label>
								<input
									type="number"
									name="large"
									id="size"
									className='input-num'
									value={size.large !== null ? size.large : ""}
									onChange={(e) => setSize({ ...size, large: +e.target.value })}
								/>
							</div>

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
							edit category
						</h2>
						<form onSubmit={editProduct} className='modal-form'>

							<div className="input-holder">
								<label htmlFor="name">name</label>
								<input
									type="text"
									name='name'
									id='name'
									placeholder='product name'
									className='modal-input input-block'
									value={productName}
									onChange={(e) => setProductName(e.target.value)}
									required
								/>
							</div>

							<div className="input-holder">
								<label htmlFor="ingredients">ingredients</label>
								<input
									type="text"
									name='ingredients'
									id='ingredients'
									placeholder='ing1, ing2, ing3,..'
									className='modal-input input-block'
									value={ingredient}
									onChange={(e) => setIngredients(e.target.value)}
									required
								/>
							</div>

							<div className="sizes-container">
								<label htmlFor="size">small</label>
								<input
									type="number"
									name="small"
									id="size"
									className=' input-num'
									value={size.small !== null ? size.small : ""}
									onChange={(e) => setSize({ ...size, small: +e.target.value })}
									required />
								<label htmlFor="size">medium</label>
								<input
									type="number"
									name="medium"
									id="size"
									className='input-num'
									value={size.medium !== null ? size.medium : ""}
									onChange={(e) => setSize({ ...size, medium: +e.target.value })}
								/>
								<label htmlFor="size">large</label>
								<input
									type="number"
									name="large"
									id="size"
									className='input-num'
									value={size.large !== null ? size.large : ""}
									onChange={(e) => setSize({ ...size, large: +e.target.value })}
								/>
							</div>
							<button type='submit' className='btn btn-block btn-black ' >edit</button>
						</form>

						<button className="close-modal-btn" onClick={closeSecondModal}>
							<FaTimes />
						</button>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Products;