import { useCallback, useState } from 'react';

const useDeleteItem = (url) => {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [errMsg, setErrMsg] = useState();

  const deleteItem = useCallback(
    async (itemId) => {
      try {
        const token = localStorage.getItem('token');
        console.log(`${URL}${url}${itemId}`);
        const response = await fetch(`${URL}${url}${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
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

  return { deleteItem };
};

export default useDeleteItem;
