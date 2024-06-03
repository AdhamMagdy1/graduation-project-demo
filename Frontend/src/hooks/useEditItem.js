import { useCallback, useState } from 'react';

const useEditItem = (url) => {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [errMsg, setErrMsg] = useState();

  const editItem = useCallback(
    async (id, newItem) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${url}${id}`, {
          method: 'PUT',
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

  return { editItem };
};

export default useEditItem;
