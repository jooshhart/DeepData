import axios from "axios";
import { jwtDecode } from "jwt-decode";
const Url = require("../../backendURL");

// Check if token is expired
// true == expired
// false == not expired
const isTokenExpired = (token) => {
  if (token == "undefined" || token == NaN) {
    return true;
  }

  const expiration = jwtDecode(token).exp * 1000;
  return expiration < Date.now();
};

export const getUserToken = async (path = null) => {
  const jwt = localStorage.getItem("token");

  // CASE1: JWT is still activated and existing
  if (jwt && !isTokenExpired(jwt)) {
    // Make the API call with the original request
    return jwt;
  }

  // CASE2: JWT is expired but refresh JWT is activated and existing
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && !isTokenExpired(refreshToken)) {
    // Make an API call to refresh the JWT
    const refreshResponse = await axios.get(`${Url}accounts/login/refresh`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    if (refreshResponse.status == 200) {
      const activatedJWT = refreshResponse.data.token;
      localStorage.setItem("token", activatedJWT);
      return activatedJWT;
    } else {
      console.log("Refresh token could not generate new JWT token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      // console.log("Token",path)
      await localStorage.setItem("lastLoc", path);
      window.location.assign = "customer/login";
      throw new Error("Refresh token could not generate new JWT token");
    }
  } else {
    console.log("Refresh is expired");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    // await localStorage.setItem("lastLoc",path)
    window.location.assign = "/customer/login";
    throw new Error("Refresh token is expired");
  }
};
