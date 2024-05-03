import SideBar from "./SideBar"

const Orders = () => {
	return (
		<>
			<div className="page-container">
				<SideBar />
				<div className="orders">
					<div className="orders-center">
						<div className="orders-heading">
							<h2>recent orders</h2>
							<button className="btn">filter</button>
						</div>
						<table>
							<thead>
								<tr>
									<th>order id</th>
									<th>customer</th>
									<th>food</th>
									<th>phone</th>
									<th>price</th>
									<th>address</th>
									<th>status</th>
									<th>action</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
								<tr>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
									<td>123</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}

export default Orders