import { useEffect, useState } from 'react';

const useAddItem = (url, newItem) => {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [errMsg, setErrMsg] = useState();
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const addCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(newItem),
      });
      const result = await response.json();
      if (response.status != 201) {
        setErrMsg(result.message);
        console.log(errMsg);
      } else {
        console.log(result.message);
        setUpdateTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    addCategory();
  }, []);

  return { updateTrigger, errMsg };
};

export default useAddItem;
