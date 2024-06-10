import { useState } from 'react';
import { Link } from "react-router-dom";

const SideBar = () => {

	const [isAddsOpen, setIsAddsOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);


	return (
		<>
			<section className="side-bar">
				<div className="side-container">
					<div className="logo">chef<span className="second-word">bot</span></div>
					<div className="side-links">

						<Link to="/restaurant/stats" className="side-link" >
							<div className="link-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M0 13h16v2H0zm2-4h2v3H2zm3-4h2v7H5zm3 3h2v4H8zm3-6h2v10h-2z" /></svg>
							</div>
							<div className="a">stats</div>
						</Link>

						<Link to="/restaurant/orders" className="side-link" >
							<div className="link-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="#eaa90f" d="m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 640H640V512h384zm0 256H640V768h384zm-384 128h384v128H640zM512 640H384V512h128zm0 256H384V768h128zm-128 128h128v128H384zm768-384V128H256v1792h896v128H128V0h1115l549 549v731l-128 128V640zm128-128h293l-293-293z" /></svg>
							</div>
							<div className="a">orders</div>
						</Link>

						<div className="dropdown">
							<button
								className='dropdown-btn'
								onClick={() => setIsAddsOpen(!isAddsOpen)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="currentColor"><path d="M6.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" /><path fillRule="evenodd" d="M7.5 6a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1" clipRule="evenodd" /></g></svg>
								adds
								<svg
									className={isAddsOpen ? 'flipped' : ''}
									xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.18 15.83L6.543 9.203C5.892 8.275 6.556 7 7.689 7h8.622c1.133 0 1.797 1.275 1.147 2.203l-4.639 6.627a1 1 0 0 1-1.638 0" /></svg>
							</button>
							{
								isAddsOpen && (
									<div className="dropdown-list">
										<div className="option">
											<Link to="/restaurant/menu" className="side-link" >
												<div className="a">menu</div>
											</Link>
										</div>
										<div className="option">
											<Link to="/restaurant/categories" className="side-link" >
												<div className="a">categories</div>
											</Link>
										</div>
										<div className="option">
											<Link to="/restaurant/extras" className="side-link" >
												<div className="a">extras</div>
											</Link>
										</div>
									</div>
								)
							}
						</div>

						<div className="dropdown">
							<button
								className='dropdown-btn'
								onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#eaa90f" fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797l1.415 1.415l-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796l-1.415 1.415l-.796-.797a4 4 0 0 1-1.032.428V20h-2v-1.126a4 4 0 0 1-1.032-.428l-.796.797l-1.415-1.415l.797-.796A4 4 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796l1.415-1.415l.796.797A4 4 0 0 1 15 11.126V10zm.406 3.578l.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703a7.03 7.03 0 0 0-3.235 3.235A4 4 0 0 1 5 8m4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.98 6.98 0 0 1 9 15c0-.695.101-1.366.29-2" clipRule="evenodd" /></svg>
								settings
								<svg
									className={isSettingsOpen ? 'flipped' : ''}
									xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.18 15.83L6.543 9.203C5.892 8.275 6.556 7 7.689 7h8.622c1.133 0 1.797 1.275 1.147 2.203l-4.639 6.627a1 1 0 0 1-1.638 0" /></svg>
							</button>
							{
								isSettingsOpen && (
									<div className="dropdown-list">
										<div className="option">
											<Link to="/restaurant/edit" className="side-link" >
												<div className="a">restaurant</div>
											</Link>
										</div>
										<div className="option">
											<Link to="/restaurant/employee" className="side-link" >
												<div className="a">employee</div>
											</Link>
										</div>
										<div className="option">
											<Link to="/restaurant/profile" className="side-link" >
												<div className="a">your profile</div>
											</Link>
										</div>
									</div>
								)
							}
						</div>

					</div>
				</div>
			</section>
		</>
	);
};

export default SideBar;