// import { useState } from 'react';
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
		status: 'delieverd',
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
		status: 'delieverd',
	}
];

const Orders = () => {

	// const [orders, setOrders] = useState(fakeOrders);


	return (
		<>
			<div className="page-container">
				<SideBar />
				<div className="side-page">
					<div className="orders-center">
						<div className="orders-heading">
							<h2>recent orders</h2>
							<button className="btn">
								filter
								<svg style={{ marginLeft: "0.3rem" }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z" /></svg>
							</button>
						</div>
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
									fakeOrders.map((order) => {
										return <tr key={order.id}>
											<td>{order.id}</td>
											<td>{order.customer}</td>
											<td>{order.product}</td>
											<td>{order.phone}</td>
											<td>{order.bill}</td>
											<td>{order.address}</td>
											<div className={order.status === 'delieverd' ? 'green' : order.status === 'waiting' ? 'red' : 'blue'}>
												<td >
													{order.status}
												</td>
											</div>

											<td>
												<button className="btn-action btn-red">
													<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" /></svg>
												</button>
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