// // import { jwtStorage } from "./jwt_storage";

// const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// export const getDataPublic = (url) => {
//   return fetch(url)
//     .then((response) =>
//       response.status >= 200 &&
//       response.status <= 299 &&
//       response.status !== 204
//         ? response.json()
//         : response,
//     )
//     .then((data) => {
//       return data;
//     })
//     .catch((err) => console.log(err));
// };
// export const getData = async (url) => {
//   return fetch(REACT_APP_API_URL + url)
//     .then((response) =>
//       response.status >= 200 &&
//       response.status <= 299 &&
//       response.status !== 204
//         ? response.json()
//         : response,
//     )
//     .then((data) => {
//       return data;
//     })
//     .catch((err) => console.log(err));
// };

// export const getDataPrivate = async (url) => {
//   let token = await jwtStorage.retrieveToken();
//   return fetch(REACT_APP_API_URL + url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) =>
//       response.status >= 200 &&
//       response.status <= 299 &&
//       response.status !== 204
//         ? response.json()
//         : response,
//     )
//     .then((data) => {
//       return data;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// export const sendData = async (url, data) => {
//   return fetch(REACT_APP_API_URL + url, {
//     method: "POST",
//     body: data,
//   })
//     .then((response) =>
//       response.status >= 200 &&
//       response.status <= 299 &&
//       response.status !== 204
//         ? response.json()
//         : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const sendDataPrivate = async (url, data) => {
//   //401 -> jwt expired, flow process to login
//   //400 -> jwt malformed
//   //204 -> No Content, but success
//   //NOTE : You must special handle for HTTP status above

//   let token = await jwtStorage.retrieveToken();
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   // Add body only if data exists
//   if (data) {
//     options.body = data;
//   }
//   console.log(options);

//   return fetch(REACT_APP_API_URL + url, options)
//     .then((response) =>
//       response.status === 401
//         ? { isExpiredJWT: true }
//         : response.status >= 200 &&
//             response.status <= 299 &&
//             response.status !== 204
//           ? response.json()
//           : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const deleteData = async (url, data) => {
//   return fetch(REACT_APP_API_URL + url, {
//     method: "DELETE",
//     body: data,
//   })
//     .then((response) => response)
//     .catch((err) => console.log(err));
// };

// export const editDataPrivatePut = async (url, data) => {
//   //401 -> jwt expired, flow process to login
//   //400 -> jwt malformed
//   //204 -> No Content, but success
//   //NOTE : You must special handle for HTTP status above
//   let token = await jwtStorage.retrieveToken();
//   return fetch(REACT_APP_API_URL + url, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) =>
//       response.status === 401
//         ? { isExpiredJWT: true }
//         : response.status >= 200 &&
//             response.status <= 299 &&
//             response.status !== 204
//           ? response.json()
//           : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const editDataPrivateURLEncoded = async (url, data) => {
//   //401 -> jwt expired, flow process to login
//   //400 -> jwt malformed
//   //204 -> No Content, but success
//   //NOTE : You must special handle for HTTP status above
//   // var token = localStorage.getItem("token_auth");
//   let token = await jwtStorage.retrieveToken();
//   return fetch(REACT_APP_API_URL + url, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//     },
//     body: data,
//   })
//     .then((response) =>
//       response.status === 401
//         ? { isExpiredJWT: true }
//         : response.status >= 200 &&
//             response.status <= 299 &&
//             response.status !== 204
//           ? response.json()
//           : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const deleteDataPrivateURLEncoded = async (url, data) => {
//   //401 -> jwt expired, flow process to login
//   //400 -> jwt malformed
//   //204 -> No Content, but success
//   //NOTE : You must special handle for HTTP status above
//   // var token = localStorage.getItem("token_auth");
//   let token = await jwtStorage.retrieveToken();
//   return fetch(REACT_APP_API_URL + url, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//     },
//     body: data,
//   })
//     .then((response) =>
//       response.status === 401
//         ? { isExpiredJWT: true }
//         : response.status >= 200 &&
//             response.status <= 299 &&
//             response.status !== 204
//           ? response.json()
//           : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const deleteDataPrivateJSON = async (url, data) => {
//   //401 -> jwt expired, flow process to login
//   //400 -> jwt malformed
//   //204 -> No Content, but success
//   //NOTE : You must special handle for HTTP status above
//   // var token = localStorage.getItem("token_auth");
//   let token = await jwtStorage.retrieveToken();
//   return fetch(REACT_APP_API_URL + url, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: data,
//   })
//     .then((response) =>
//       response.status === 401
//         ? { isExpiredJWT: true }
//         : response.status >= 200 &&
//             response.status <= 299 &&
//             response.status !== 204
//           ? response.json()
//           : response,
//     )
//     .then((data) => data)
//     .catch((err) => console.log(err));
// };

// export const logoutAPI = async () => {
//   let token = await jwtStorage.retrieveToken();
//   let formData = new FormData();
//   formData.append("logout", "Logout"); // Assuming jwtStorage retrieves token
//   return fetch(REACT_APP_API_URL + "/api/auth/logout", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   })
//     .then((response) => {
//       if (response.status === 200) {
//         jwtStorage.removeItem();
//         return { isLoggedOut: true };
//       } else {
//         // Handle errors (e.g., unexpected status code)
//         console.error("Logout failed:", response.statusText);
//         return false;
//       }
//     })
//     .catch((error) => {
//       console.error("Logout error:", error);
//       return false;
//     });
// };

// export const getImage = (url_image) => {
//   const imgDefault = "/storage/images/userpng_1717846018.png";
//   let imgResult = url_image ? url_image : imgDefault;
//   return REACT_APP_API_URL + imgResult;
// };


const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

/**
 * Fetch data from API (GET request)
 * @param {string} url - API endpoint
 * @returns {Promise} - Response data
 */
export const getData = async (url) => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}${url}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

/**
 * Send data to API (POST request)
 * @param {string} url - API endpoint
 * @param {object} data - Data to send
 * @param {string} [method="POST"] - HTTP method
 * @param {object} [headers] - Custom headers
 * @returns {Promise} - Response data
 */
export const sendData = async (url, data, method = "POST", headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    const response = await fetch(`${REACT_APP_API_URL}${url}`, {
      method,
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null;
  } catch (error) {
    console.error(`${method} request failed:`, error);
    throw error;
  }
};

/**
 * Update data (PUT request)
 * @param {string} url - API endpoint
 * @param {object} data - Data to update
 * @returns {Promise} - Response data
 */
export const updateData = async (url, data) => {
  return sendData(url, data, "PUT");
};

/**
 * Delete data from API (DELETE request)
 * @param {string} url - API endpoint
 * @param {object} [data] - Optional data to send
 * @returns {Promise} - Response
 */
export const deleteData = async (url, data = null) => {
  try {
    const options = {
      method: 'DELETE',
    };

    if (data) {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${REACT_APP_API_URL}${url}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null;
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};

/**
 * Get image URL
 * @param {string} url_image - Image path
 * @returns {string} - Full image URL
 */
export const getImage = (url_image) => {
  const imgDefault = "/storage/images/default_thumbnail.png";
  return `${REACT_APP_API_URL}${url_image || imgDefault}`;
};

export default {
  getData,
  sendData,
  updateData,
  deleteData,
  getImage
};