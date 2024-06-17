// const fakeData = {
//   '2024-02-22': { neg: 0.1, pos: 0.6, nat: 0.3 },
//   '2024-02-23': { neg: 0.2, pos: 0.5, nat: 0.3 },
//   '2024-02-24': { neg: 0.15, pos: 0.65, nat: 0.2 },
//   '2024-02-25': { neg: 0.12, pos: 0.68, nat: 0.2 },
//   '2024-02-26': { neg: 0.18, pos: 0.6, nat: 0.22 },
//   '2024-02-27': { neg: 0.1, pos: 0.7, nat: 0.2 },
// };

const fetchSentimentData = async () => {
  //   return fakeData;
  const URL = import.meta.env.VITE_REACT_API_URL;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${URL}/restaurant/owner/stats`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    const result = await response.json();
    if (response.status === 200) {
      console.log(result);
      return result;
    } else {
      console.log(result);
      throw new Error(result);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchSentimentData;
