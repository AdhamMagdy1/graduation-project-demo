/* eslint-disable react/prop-types */
import SideBar from './SideBar';

const Empty = ({ pageName, openFirstModal }) => {


	return (
		<div className="page-container">
			<SideBar />
			<div className="side-page">
				<div className="side-page-nav">
					<div className="side-page-heading">{pageName}</div>
				</div>
				<div className=" wrap add-item" style={{ marginTop: '3rem', width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
					<button type='button' className='button' onClick={openFirstModal}  >start adding {pageName}</button>
				</div>
			</div>
		</div>
	);
};

export default Empty;