/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return <AppContext.Provider value={{
		isModalOpen,
		openModal,
		closeModal
	}}
	>
		{children}
	</AppContext.Provider>;
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};