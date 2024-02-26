import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library
export const isAuthenticated = () => {
    const token = window.localStorage.getItem('token');
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp;
        // console.log("token",expirationTime);
        // console.log("date",Date.now() / 1000);
  
        // Check if the token is expired
        if (Date.now() / 1000 > expirationTime) {
          return false; // Token has expired
        }
  
        return true; // Token is valid and not expired
      } catch (error) {
        // Handle any errors during decoding, such as invalid tokens
        return false; // Assume invalid token if decoding fails
      }
    } else {
      return false; // No token found
    }
  };