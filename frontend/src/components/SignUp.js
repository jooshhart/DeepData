import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { userLogin } from "./UserState";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const SignUp = () => {
  // Form States
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });
  const [errors, setErrors] = useState({
    username: "Username is required.",
    email: "Email is required.",
    password: "Password is required.",
    passwordCheck: "Password is required.",
  });
  const [valid, setValid] = useState(true);
  const [allErrors, setAllErrors] = useState(Object.values(errors));
  const [processing, setProcessing] = useState(false)

  const Url = require("../backendURL");
  const navigate = useNavigate()

  const showAlert = () => {
    toast.error("Failed to make your account, sorry please try again");
  };

  // change handler
  const handleChange = (key) => {
    return ({ target: { value } }) => {
      // Validation
      switch (key) {
        case "username":
          if (/^[a-zA-Z\s]*$/.test(value)) {
            setUserData((oldValues) => ({ ...oldValues, [key]: value }));
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "",
            }));
          } else {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "First Name can only contain letters and spaces.",
            }));
          }
          break;
        case "email":
          setUserData((oldValues) => ({ ...oldValues, [key]: value }));
          if (value === "") {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "Email is required.",
            }));
          } else if (validEmailRegex.test(value)) {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "",
            }));
          } else {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "Email is not valid",
            }));
          }
          break;
        case "password":
          setUserData((oldValues) => ({ ...oldValues, [key]: value }));
          if (value.length >= 8) {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "",
            }));
          }
          break;
        case "passwordCheck":
          setUserData((oldValues) => ({ ...oldValues, [key]: value }));
          if (value === userData.password) {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "",
            }));
          }
          break;
        default:
          break;
      }
    };
  };

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) =>
      val.length > 0 ? (valid = false) : (valid = true)
    );
    return valid;
  };

  const inputEmptyError = () => {
    toast.error("One of the fields is missing.");
  };

  const resetInput = () => {
    setUserData({
      username: "",
      email: "",
      password: "",
    });
    setErrors({
      username: "First Name is required..",
      email: "Email is required.",
      password: "Password is required.",
      passwordCheck: "Password is required.",
    });
  };

  const onSubmit = (e) => {
    console.log("called")
    e.preventDefault();
    setProcessing(true)

    if (
      userData.username.trim() === "" ||
      userData.email.trim() === ""
    ) {
      setProcessing(false)
      inputEmptyError();
      return;
    }

    if (userData.password.length < 8) {
      setProcessing(false)
      toast.error("Password must be at least 8 characters");
      setErrors((oldValues) => ({
        ...oldValues,
        password: "Password must be at least 8 characters",
      }));
      return;
    }

    if (userData.passwordCheck !== userData.password) {
      setProcessing(false)
      toast.error("Passwords must match.");
      setErrors((oldValues) => ({
        ...oldValues,
        passwordCheck: "Passwords must match.",
      }));
      return;
    }

    const data = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };
    if (validateForm(errors)) {
      setValid(true);
      axios
        .post(`${Url}user/add`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          toast.success("Your account is successfully created.");
          const loginData ={
            email: userData.email,
            password: userData.password
          }
          userLogin(loginData)
          resetInput();
        })
        .catch((err) => {
          setProcessing(false)
            // Handle server-side validation error here
            if (err.response.data.error) {
              toast.error(err.response.data.error.message);
            } else {
              toast.error("Enter a valid email address. \n Or this email address is already used");
            }
          }
        );
    } else {
      setProcessing(false)
      setValid(false);
    }
  };

  useEffect(() => {
    setAllErrors(Object.values(errors).filter((item) => item.length !== 0));
    setValid(true);
  }, [errors]);

  return (
      <section className='p-login__inputSection'>
      <Toaster />
      <form className="p-login__inputForm" onSubmit={onSubmit}>
        <h4>Sign up</h4>
        <hr />
        <div className='c-inputWrapper__vertical m-margin__top--24' style={{width:"80%"}}>
          <label className='c-input__label'>Username:</label>
          <input
            className="c-input"
            type={`text`}
            value={userData.username}
            onChange={handleChange("username")}
          />
        </div>
        <div className='c-inputWrapper__vertical' 
        style={{width:"80%"}}>
          <label className='c-input__label'>Email:</label>
          <input
            className="c-input"
            type={`email`}
            value={userData.email}
            onChange={handleChange("email")}
          />
        </div>
        <div className='c-inputWrapper__vertical' 
        style={{width:"80%"}}>
          <label className='c-input__label'>Password:</label>
          <input
            className="c-input"
            type={`password`}
            onChange={handleChange("password")}
          />
        </div>
        <div className='c-inputWrapper__vertical m-margin__bottom--24' 
        style={{width:"80%"}}>
          <label className='c-input__label'>Verify Password:</label>
          <input
          className="c-input"
            type={`password`}
            onChange={handleChange("passwordCheck")}
          />
        </div>

        <button 
        type="submit" 
        value="Submit"
        className="c-smallButton"
        style={{width:"80%"}}
        disabled={processing}
        >
          {processing ? "Processing...":"Create"} 
        </button>
          
        <p
        className='p-login__switch'
        >Do you already have an account? <span onClick={() => navigate("/Signin")}>Sign in now</span></p>
      </form>
      </section>
  );
};

export default SignUp;