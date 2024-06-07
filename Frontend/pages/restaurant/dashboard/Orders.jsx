/* eslint-disable no-unused-vars */
import { useState } from 'react';
import SideBar from "./SideBar";
import { nanoid } from 'nanoid';

const fakeOrders = [
	{
		id: nanoid(),
		customer: "name",
		product: "burger",
		phone: 789456123,
		bill: 220,
		address: "miami",
		status: 'delivered',
	},
	{
		id: nanoid(),
		customer: "name",
		product: "burger",
		phone: 789456123,
		bill: 220,
		address: "miami",
		status: '',
	},
	{
		id: nanoid(),
		customer: "name",
		product: "burger",
		phone: 789456123,
		bill: 220,
		address: "miami",
		status: 'in progress',
	},
	{
		id: nanoid(),
		customer: "name",
		product: "burger",
		phone: 789456123,
		bill: 220,
		address: "miami",
		status: 'waiting',
	},
	{
		id: nanoid(),
		customer: "name",
		product: "burger",
		phone: 789456123,
		bill: 220,
		address: "miami",
		status: 'delivered',
	}
];

const allStates = ['all', ...new Set(fakeOrders.map((order) => order.status))];

const Orders = () => {

	const [orders, setOrders] = useState(fakeOrders);
	const [states, setStates] = useState(allStates);

	//filtering orders:
	const filterOrders = (state) => {
		if (state === 'all') {
			setOrders(fakeOrders);
			return;
		}
		const filteredOrders = fakeOrders.filter((order) => order.status === state);
		setOrders(filteredOrders);
	};

	//changing status of the order:
	const changeOrderStatus = (e, id) => {
		const newStatus = e.target.value;
		const updatedOrders = orders.map((order) => {
			return order.id === id ? { ...order, status: newStatus } : order;
		});
		setOrders(updatedOrders);
	};
	const editOrder = (id) => {
		const updatedOrders = orders.map((order) => {
			return order.id === id ? { ...order, status: '' } : order;
		});
		setOrders(updatedOrders);
	};

	//deleting order:
	const deleteOrder = (id) => {
		const updatedOrders = orders.filter((order) => order.id !== id);
		setOrders(updatedOrders);
	};

	return (
		<>
			<div className="page-container">
				<SideBar />
				<div className="side-page">
					<div className="orders-center">
						<div className="side-page-nav">
							<h2 className='side-page-heading'>recent orders</h2>
						</div>
						{/* filter buttons  */}
						<div className="btn-holder">
							<div className="filter-buttons">
								{
									states.map((state) => {
										return <button
											key={nanoid()}
											type='button'
											className='btn'
											onClick={() => filterOrders(state)}
										>
											{state ? state : 'unset'}
										</button>;
									})
								}
							</div>
						</div>
						{/* orders */}
						<table>
							<thead>
								<tr>
									<th>order id</th>
									<th>customer</th>
									<th>product</th>
									<th>phone</th>
									<th>Bill</th>
									<th>address</th>
									<th>status</th>
									<th>action</th>
								</tr>
							</thead>
							<tbody>
								{
									orders.map((order) => {
										return <tr key={order.id}>
											<td>{order.id}</td>
											<td>{order.customer}</td>
											<td>{order.product}</td>
											<td>{order.phone}</td>
											<td>{order.bill}</td>
											<td>{order.address}</td>
											<div className="status-holder">
												{
													order.status ? (
														<div className={order.status === 'delivered' ? 'green order-status' : order.status === 'waiting' ? 'red order-status' : 'blue order-status'}>
															<td>{order.status}</td>
														</div>
													) : (
														<select
															className='select-status'
															name="status"
															id="status"
															value={order.status || ''}
															onChange={(e) => changeOrderStatus(e, order.id)}
														>
															<option hidden value="">select status</option>
															<option value="delivered">delivered</option>
															<option value="waiting">waiting</option>
															<option value="in progress">in progress</option>
														</select>
													)
												}
											</div>
											<td>
												<div className="actions">
													<button className="btn-action" onClick={() => editOrder(order.id)} >
														<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M17.204 10.796L19 9c.545-.545.818-.818.964-1.112a2 2 0 0 0 0-1.776C19.818 5.818 19.545 5.545 19 5c-.545-.545-.818-.818-1.112-.964a2 2 0 0 0-1.776 0c-.294.146-.567.419-1.112.964l-1.819 1.819a10.9 10.9 0 0 0 4.023 3.977m-5.477-2.523l-6.87 6.87c-.426.426-.638.638-.778.9c-.14.26-.199.555-.316 1.145l-.616 3.077c-.066.332-.1.498-.005.593c.095.095.26.061.593-.005l3.077-.616c.59-.117.885-.176 1.146-.316c.26-.14.473-.352.898-.777l6.89-6.89a12.901 12.901 0 0 1-4.02-3.98" clipRule="evenodd" /></svg>
													</button>
													<button className="btn-action btn-red" onClick={() => deleteOrder(order.id)}>
														<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" /></svg>
													</button>
												</div>
											</td>
										</tr>;
									})
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default Orders;