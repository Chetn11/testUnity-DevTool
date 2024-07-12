import axios from "axios";
import {
  GET_DATA_ERROR,
  GET_DATA_LOADING,
  GET_DATA_SUCCESS,
} from "./actionType";
const corsProxy = "https://cors-anywhere.herokuapp.com/";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  }
);

export const getData = (payload) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
      "Custom-Header": "Custom Value",
    },
  };

  try {
    dispatch({ type: GET_DATA_LOADING });

    const response = await axiosInstance.get(corsProxy + payload, config);
    console.log(`Response time: ${response.duration}ms`);

    const htmlContent = response.data;
    // console.log(htmlContent)
    const parser = new DOMParser();

    const document = parser.parseFromString(htmlContent, "text/html");
    // console.log(document)
    const fetchedData = [];
    document
      .querySelectorAll('link[rel="stylesheet"][as="fetch"]')
      .forEach((fetch) =>
        fetchedData.push({ type: "fetch/xhr", url: fetch.href })
      );
    document
      .querySelectorAll("script")
      .forEach((script) => fetchedData.push({ type: "js", url: script.src }));
    document
      .querySelectorAll('link[rel="stylesheet"]')
      .forEach((link) => fetchedData.push({ type: "css", url: link.href }));

    document
      .querySelectorAll("iframe")
      .forEach((iframe) => fetchedData.push({ type: "doc", url: iframe.src }));
    document
      .querySelectorAll('link[rel="font"]')
      .forEach((font) => fetchedData.push({ type: "font", url: font.href }));
    document
      .querySelectorAll("img")
      .forEach((img) => fetchedData.push({ type: "image", url: img.src }));
    document
      .querySelectorAll("video, audio")
      .forEach((media) => fetchedData.push({ type: "media", url: media.src }));
    document
      .querySelectorAll('link[rel="manifest"]')
      .forEach((manifest) =>
        fetchedData.push({ type: "manifest", url: manifest.href })
      );
    document
      .querySelectorAll('link[rel="stylesheet"][as="websocket"]')
      .forEach((ws) => fetchedData.push({ type: "ws", url: ws.href }));
    // console.log(fetchedData);
    const allData = { response: response, fetchedData: fetchedData };
    dispatch({ type: GET_DATA_SUCCESS, payload: allData });
  } catch (error) {
    console.log(`Error response time: ${error.duration}ms`);

    dispatch({ type: GET_DATA_ERROR });
  }
};
