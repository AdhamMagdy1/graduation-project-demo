/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

const useFetch = (url, deps = []) => {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      // console.log(response);
      if (response.status === 404) {
        setIsError(true);
        setIsLoading(false);
        setData(null);
        return;
      } else {
        const resp = await response.json();
        setData(resp);
      }
    } catch (error) {
      setIsError(true);
      setData(null);
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { isLoading, isError, data };
};

export default useFetch;
