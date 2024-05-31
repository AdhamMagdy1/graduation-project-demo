/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useGlobalContext } from './context';
import { FaTimes } from "react-icons/fa";
import SideBar from './SideBar';
import Loading from '../../../src/Loading';
import { Link } from 'react-router-dom';
import Empty from './Empty';
import useFetch from '../../../src/hooks/useFetch';
// import useAddItem from '../../../src/hooks/useAddItem';

const url = `/restaurant/category/all`;

const Categories = () => {
	const URL = import.meta.env.VITE_REACT_API_URL;

	const [updateTrigger, setUpdateTrigger] = useState(0);
	const { isLoading, isError, data: resp } = useFetch(url, [updateTrigger]);

	const [categoryName, setCategoryName] = useState("");
	const [errMsg, setErrMsg] = useState();
	const [currentCategoryId, setCurrentCategoryId] = useState();

	const {
		isFirstModalOpen,
		openFirstModal,
		closeFirstModal,
		isSecondModalOpen,
		openSecondModal,
		closeSecondModal
	} = useGlobalContext();

	const newCategory = {
		name: categoryName,
	};
	// const {updatedTrigger} = useAddItem(`/restaurant/category`, newCategory);

	const addCategory = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${URL}/restaurant/category`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(newCategory)
			});
			const result = await response.json();
			if (response.status != 201) {
				setErrMsg(result.message);
				console.log(errMsg);
			} else {
				console.log(result.message);
				setUpdateTrigger(prev => prev + 1);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const resetCategory = () => {
		setCategoryName("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		addCategory();
		closeFirstModal();
		resetCategory();
	};

	const deleteCategory = async (id) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${URL}/restaurant/category/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': token,
				}
			});
			const result = await response.json();

			if (response.status != 200) {
				setErrMsg(result.message);
				console.log(errMsg);
			} else {
				setUpdateTrigger(prev => prev + 1);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = (id, name) => {
		setCurrentCategoryId(id);
		setCategoryName(name);
		openSecondModal();
	};

	const editCategory = async (id) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${URL}/restaurant/category/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(newCategory)
			});
			const result = await response.json();
			if (response.status != 201) {
				setErrMsg(result.message);
				console.log(errMsg);
			} else {
				console.log(result.message);
				setUpdateTrigger(prev => prev + 1);
			}
		} catch (error) {
			console.log(error);
		}
	};

	if (isError) {
		return <div className="page-container">
			<SideBar />
			<div className="side-page">
				sorry something went wrong
			</div>
		</div>;
	}

	if (isLoading) {
		return (
			<div className="page-container">
				<SideBar />
				<Loading />
			</div>
		);
	}

	if (!resp || !resp.categories) {
		return <Empty pageName={'categories'} />;
	}

	const categories = resp.categories;


	return (
		<>
			<div className="page-container">
				<SideBar />
				<div className="side-page">
					<div className="side-page-nav">
						<div className="side-page-heading">categories</div>
						<div className="add-item">
							<button type='button' className='btn'
								onClick={openFirstModal}
							>add new category</button>
						</div>
					</div>

					<ul className="list-items">
						{
							categories.map((category) => {
								return <li key={category.categoryId} className="li interactive-item">
									<Link to={{
										pathname: `/restaurant/products/category/${category.categoryId}`,
										state: { id: category.categoryId },
									}}
									>
										<div className="name-container">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" /></svg>
											<h4 className='item-name' >{category.name}</h4>
										</div>
									</Link>
									<div className="actions">
										<button className="btn-action btn-red" onClick={() => deleteCategory(category.categoryId)}>
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" /></svg>
										</button>

										<button className="btn-action btn-green" onClick={() => handleEdit(category.categoryId, category.name)}>
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M17.204 10.796L19 9c.545-.545.818-.818.964-1.112a2 2 0 0 0 0-1.776C19.818 5.818 19.545 5.545 19 5c-.545-.545-.818-.818-1.112-.964a2 2 0 0 0-1.776 0c-.294.146-.567.419-1.112.964l-1.819 1.819a10.9 10.9 0 0 0 4.023 3.977m-5.477-2.523l-6.87 6.87c-.426.426-.638.638-.778.9c-.14.26-.199.555-.316 1.145l-.616 3.077c-.066.332-.1.498-.005.593c.095.095.26.061.593-.005l3.077-.616c.59-.117.885-.176 1.146-.316c.26-.14.473-.352.898-.777l6.89-6.89a12.901 12.901 0 0 1-4.02-3.98" clipRule="evenodd" /></svg>
										</button>
									</div>
								</li>;
							})
						}
					</ul>
				</div>

				<div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
					<div className="modal-container">
						<h2 className="modal-heading">
							add category
						</h2>
						<form onSubmit={handleSubmit} className='modal-form'>

							<input
								type="text"
								placeholder='category name'
								className='modal-input input-block'
								value={categoryName}
								onChange={(e) => setCategoryName(e.target.value)}
							/>

							<button type='submit' className='btn btn-block btn-black '>add</button>
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
						<form onSubmit={() => editCategory(currentCategoryId)} className='modal-form'>

							<input
								type="text"
								placeholder='category name'
								className='modal-input input-block'
								value={categoryName}
								onChange={(e) => setCategoryName(e.target.value)}
							/>

							<button type='submit' className='btn btn-block btn-black ' >edit</button>
						</form>

						<button className="close-modal-btn" onClick={closeSecondModal}>
							<FaTimes />
						</button>
					</div>
				</div>


			</div>
		</>
	);
};

export default Categories;