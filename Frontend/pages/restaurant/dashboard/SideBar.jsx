import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from './context';
import { FaBars, FaTimes } from 'react-icons/fa';

const SideBar = () => {

	const { openSidebar, isSidebarOpen, closeSidebar } = useGlobalContext();

	const navigate = useNavigate();
	const accountType = localStorage.getItem('accountType');

	const [isAddsOpen, setIsAddsOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('accountType');
		localStorage.setItem('isLogged', false);
		navigate('/restaurant/login');
	};


	return (
		<>
			<nav>
				<div className="nav-center">
					<div className="logo" >chef<span className="second-word">bot</span></div>
					<button className="toggle-btn" onClick={openSidebar} >
						<FaBars />
					</button>
				</div>
			</nav>
			<div className={isSidebarOpen ? 'sidemenu show-sidemenu' : 'sidemenu'}>
				<div className="sidemenu-container">
					<button className='close-btn' onClick={closeSidebar}>
						<FaTimes />
					</button>
					<div className="sidemenu-links">

						<Link onClick={() => closeSidebar()} to="/restaurant/orders" className="submenu-link" >
							<div className="link-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="#eaa90f" d="m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 640H640V512h384zm0 256H640V768h384zm-384 128h384v128H640zM512 640H384V512h128zm0 256H384V768h128zm-128 128h128v128H384zm768-384V128H256v1792h896v128H128V0h1115l549 549v731l-128 128V640zm128-128h293l-293-293z" /></svg>
							</div>
							<div className="a">orders</div>
						</Link>

						{
							accountType === 'owner' &&
							(
								<div style={{ width: '100%' }}>
									<Link onClick={() => closeSidebar()} to="/restaurant/stats" className="submenu-link" >
										<div className="link-icon">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M0 13h16v2H0zm2-4h2v3H2zm3-4h2v7H5zm3 3h2v4H8zm3-6h2v10h-2z" /></svg>
										</div>
										<div className="a">stats</div>
									</Link>


									<div className="dropdown">
										<button
											className='dropdown-btn'
											onClick={() => setIsAddsOpen(!isAddsOpen)}
										>
											<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
												<svg className='link-icon' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="currentColor"><path d="M6.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" /><path fillRule="evenodd" d="M7.5 6a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1" clipRule="evenodd" /></g></svg>
												<div style={{ fontSize: '20px' }} className="a">adds</div>
											</div>
											<svg
												className={isAddsOpen ? 'flipped' : ''}
												xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.18 15.83L6.543 9.203C5.892 8.275 6.556 7 7.689 7h8.622c1.133 0 1.797 1.275 1.147 2.203l-4.639 6.627a1 1 0 0 1-1.638 0" /></svg>
										</button>
										{
											isAddsOpen && (
												<div className="dropdown-list">
													<div className="option">
														<Link to="/restaurant/menu" onClick={() => closeSidebar()} className="submenu-link " >
															<div className="a">menu</div>
														</Link>
													</div>
													<div className="option">
														<Link to="/restaurant/categories" onClick={() => closeSidebar()} className="submenu-link" >
															<div className="a">categories</div>
														</Link>
													</div>
													<div className="option">
														<Link to="/restaurant/extras" onClick={() => closeSidebar()} className="submenu-link" >
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
											<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#eaa90f" fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797l1.415 1.415l-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796l-1.415 1.415l-.796-.797a4 4 0 0 1-1.032.428V20h-2v-1.126a4 4 0 0 1-1.032-.428l-.796.797l-1.415-1.415l.797-.796A4 4 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796l1.415-1.415l.796.797A4 4 0 0 1 15 11.126V10zm.406 3.578l.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703a7.03 7.03 0 0 0-3.235 3.235A4 4 0 0 1 5 8m4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.98 6.98 0 0 1 9 15c0-.695.101-1.366.29-2" clipRule="evenodd" /></svg>
												<p style={{ fontSize: '20px' }}>settings</p>
											</div>
											<svg
												className={isSettingsOpen ? 'flipped' : ''}
												xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.18 15.83L6.543 9.203C5.892 8.275 6.556 7 7.689 7h8.622c1.133 0 1.797 1.275 1.147 2.203l-4.639 6.627a1 1 0 0 1-1.638 0" /></svg>
										</button>
										{
											isSettingsOpen && (
												<div className="dropdown-list">
													<div className="option">
														<Link onClick={() => closeSidebar()} to="/restaurant/edit" className="submenu-link" >
															<div className="a">restaurant</div>
														</Link>
													</div>
													<div className="option">
														<Link onClick={() => closeSidebar()} to="/restaurant/employee" className="submenu-link" >
															<div className="a">employee</div>
														</Link>
													</div>
													<div className="option">
														<Link onClick={() => closeSidebar()} to="/restaurant/profile" className="submenu-link" >
															<div className="a">your profile</div>
														</Link>
													</div>
												</div>
											)
										}
									</div>
								</div>
							)
						}

					</div>
					<bottun onClick={() => logout()} style={{ position: 'fixed', bottom: '2rem' }} className='log-out'>
						<div className="link-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#c9900c" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M15 12H2m0 0l3.5-3M2 12l3.5 3" /><path d="M9.002 7c.012-2.175.109-3.353.877-4.121C10.758 2 12.172 2 15 2h1c2.829 0 4.243 0 5.122.879C22 3.757 22 5.172 22 8v8c0 2.828 0 4.243-.878 5.121c-.769.769-1.947.865-4.122.877M9.002 17c.012 2.175.109 3.353.877 4.121c.641.642 1.568.815 3.121.862" /></g></svg>
						</div>
						<div className="a">log out</div>
					</bottun>

				</div>
			</div>

			<section className="side-bar">
				<div style={{ position: 'relative' }} className="side-container">
					<div className="logo" >chef<span className="second-word">bot</span></div>
					<div className="side-links">

						<Link to="/restaurant/orders" className="side-link" >
							<div className="link-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="#eaa90f" d="m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 640H640V512h384zm0 256H640V768h384zm-384 128h384v128H640zM512 640H384V512h128zm0 256H384V768h128zm-128 128h128v128H384zm768-384V128H256v1792h896v128H128V0h1115l549 549v731l-128 128V640zm128-128h293l-293-293z" /></svg>
							</div>
							<div className="a">orders</div>
						</Link>

						{
							accountType === 'owner' &&
							(
								<div>
									<Link to="/restaurant/stats" className="side-link" >
										<div className="link-icon">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M0 13h16v2H0zm2-4h2v3H2zm3-4h2v7H5zm3 3h2v4H8zm3-6h2v10h-2z" /></svg>
										</div>
										<div className="a">stats</div>
									</Link>


									<div className="dropdown">
										<button
											className='dropdown-btn'
											onClick={() => setIsAddsOpen(!isAddsOpen)}
										>
											<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
												<svg className='link-icon' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="currentColor"><path d="M6.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" /><path fillRule="evenodd" d="M7.5 6a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1" clipRule="evenodd" /></g></svg>
												<div className="a">adds</div>
											</div>
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
											<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#eaa90f" fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797l1.415 1.415l-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796l-1.415 1.415l-.796-.797a4 4 0 0 1-1.032.428V20h-2v-1.126a4 4 0 0 1-1.032-.428l-.796.797l-1.415-1.415l.797-.796A4 4 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796l1.415-1.415l.796.797A4 4 0 0 1 15 11.126V10zm.406 3.578l.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703a7.03 7.03 0 0 0-3.235 3.235A4 4 0 0 1 5 8m4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.98 6.98 0 0 1 9 15c0-.695.101-1.366.29-2" clipRule="evenodd" /></svg>
												settings
											</div>
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
							)
						}

						<bottun onClick={() => logout()} style={{ position: 'absolute', bottom: '2rem' }} className='log-out'>
							<div className="link-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#c9900c" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M15 12H2m0 0l3.5-3M2 12l3.5 3" /><path d="M9.002 7c.012-2.175.109-3.353.877-4.121C10.758 2 12.172 2 15 2h1c2.829 0 4.243 0 5.122.879C22 3.757 22 5.172 22 8v8c0 2.828 0 4.243-.878 5.121c-.769.769-1.947.865-4.122.877M9.002 17c.012 2.175.109 3.353.877 4.121c.641.642 1.568.815 3.121.862" /></g></svg>
							</div>
							<div className="a">log out</div>
						</bottun>

					</div>
				</div>
			</section>
		</>
	);
};

export default SideBar;