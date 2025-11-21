import axios from "axios";
import { message } from "antd";
import { getToken, clearToken } from "../utils/auth";

const callApi = (
  url,
  data = null,
  headers = {},
  method = "GET",
  responseType = "json"
) => {
  if (!headers) headers = {};

  // Lấy token từ localStorage nếu có
  const { accessToken } = getToken();
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  let params = {};
  if (typeof data === "object") {
    if (data instanceof FormData) {
      let key;
      for (key of data.keys()) {
        if (data.get(key) === "null" || data.get(key) === "undefined") {
          data.set(key, "");
        }
      }
    } else {
      let prop_name;
      for (prop_name in data) {
        if (data[prop_name] === null || data[prop_name] === undefined) {
          data[prop_name] = "";
        }
      }
    }
  }

  if (!(method === "PUT" || method === "POST" || method === "PATCH")) {
    params = data;
    data = {};
  }

  return axios({
    method,
    url,
    data,
    params,
    headers,
    responseType: responseType,
    timeout: 30000, // 30 seconds timeout
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error, "api error");
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          // Unauthorized - clear token and redirect to login
          clearToken();
          window.location.href = "/login";
          return Promise.reject(error);
        }
        if (status === 403) {
          console.log("Forbidden");
          return Promise.reject(error);
        }
        if (status <= 504 && status >= 500) {
          console.log("Server error");
          return Promise.reject(error);
        }
        if (status >= 404 && status < 422) {
          console.log("Not found");
          return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("No response received");
      } else {
        console.log("Api error", error.toString());
      }
      console.log("Api default error", error.config);
      return Promise.reject(error);
    });
};

export const apiGet = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, "GET", "json");
};

export const apiPost = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, "POST", "json");
};

export const apiPut = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, "PUT", "json");
};

export const apiPatch = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, "PATCH", "json");
};

export const apiDelete = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, "DELETE", "json");
};
