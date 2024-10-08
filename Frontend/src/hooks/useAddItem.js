import { useCallback, useState } from 'react';

const useAddItem = (url) => {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [errMsg, setErrMsg] = useState();

  const addItem = useCallback(
    async (newItem) => {
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
          return false;
        } else {
          console.log(result.message);
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [URL, url]
  );

  return { addItem };
};

export default useAddItem;
