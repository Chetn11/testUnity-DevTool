import axios from "axios";
import { GET_DATA_ERROR, GET_DATA_LOADING, GET_DATA_SUCCESS, MAKE_REQUEST } from "./actionType";
const corsProxy = "https://cors-anywhere.herokuapp.com/";
// Axios instance with interceptors to measure response time
const axiosInstance = axios.create();

// Interceptor to capture request start time
axiosInstance.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
});

// Interceptor to capture response time
axiosInstance.interceptors.response.use(response => {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
}, error => {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

export const getData = (payload) => async (dispatch) => {
  const config = {
    headers: {
      'Authorization': '*',
      'Custom-Header': 'Custom Value'
    }
  };

  try {
    dispatch({ type: GET_DATA_LOADING });

    const response = await axiosInstance.get(corsProxy+ payload, config);
    console.log(`Response time: ${response.duration}ms`);
    
    dispatch({ type: GET_DATA_SUCCESS, payload: response });

  } catch (error) {
    console.log(`Error response time: ${error.duration}ms`);
    
    dispatch({ type: GET_DATA_ERROR });
  }
};
