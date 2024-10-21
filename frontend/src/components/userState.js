import axios from "axios";
import { getUserToken } from "../../Functions/Auth/getToken";

// All varibales
const Url = require("../../backendURL");
const accountId = localStorage.getItem("userId");

/*---------------------  Account ---------------------*/

/*************************************
 * User login
 ***********************************/

export const userLogin = async (data) => {
  try {
    const res = await axios.post(`${Url}user/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      const path = localStorage.getItem("lastLoc");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("isLoggedIn", true);
      window.location.replace(path === null ? "/profile" : path);
      if (path) {
        localStorage.removeItem("lastLoc");
      }
    }
  } catch (err) {
    throw err.response.data.err;
  }
};

/*************************************
 * forget password first step
 ***********************************/

export const forgetPasswordPostEmail = async (email) => {
  try {
    const res = await axios.post(`${Url}user/passwordReset`, {
      email: email,
    });
    if (res.status === 200) {
      return true;
    } else {
      console.log("error on reset Password");
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/*************************************
 * forget password second step
 ***********************************/

export const createNewPasswordForForgotten = async (
  password,
  paramAccountId,
  paramToken,
) => {
  try {
    const res = await axios.post(
      `${Url}user/passwordReset/${paramAccountId}/${paramToken}`,
      { newPassword: password },
    );
    if (res.status === 200) {
      return true;
    } else {
      console.log("error on reset Password");
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/*************************************
 * get Account By Id
 ***********************************/

export const getAccountById = async () => {
  try {
    const token = await getCustomerToken();
    const response = await axios.get(`${Url}user/${accountId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 200) {
      const data = await response.data.doc;
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

/*************************************
 * Edit Account Information
 ***********************************/

export const editAccountInfo = async (data) => {
  console.log("Edit account info", data);
  try {
    const token = await getUserToken("/customer/user");
    const res = await axios.patch(`${Url}user/edit/${accountId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.msg;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

/*************************************
 * Edit Password
 ***********************************/

export const editPassword = async (oldPassword, newPassword) => {
  try {
    const token = await getCustomerToken("/customer/user");
    await axios.patch(
      `${Url}user/edit-password/${accountId}`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error.response.data.err;
  }
};

/*************************************
 * Delete Account
 ***********************************/

export const deleteAccount = async () => {
  try {
    const token = await getCustomerToken("/customer/user");
    const res = await axios.patch(
      `${Url}user/delete/${accountId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("delete", res);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
};

export const customerSignOut = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.assign("/customer/login");
};
