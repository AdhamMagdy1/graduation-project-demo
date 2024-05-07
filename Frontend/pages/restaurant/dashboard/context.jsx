/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
	const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

	const openFirstModal = () => {
		setIsFirstModalOpen(true);
	};

	const closeFirstModal = () => {
		setIsFirstModalOpen(false);
	};


	const openSecondModal = () => {
		setIsSecondModalOpen(true);
	};

	const closeSecondModal = () => {
		setIsSecondModalOpen(false);
	};

	return <AppContext.Provider value={{
		isFirstModalOpen,
		openFirstModal,
		closeFirstModal,
		isSecondModalOpen,
		openSecondModal,
		closeSecondModal
	}}
	>
		{children}
	</AppContext.Provider>;
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};