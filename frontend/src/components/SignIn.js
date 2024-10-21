import React, { useEffect, useState }  from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { userLogin } from './UserState';

const SignIn = () => {

  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "Email is required.",
    password: "Password is required.",
  });
  const [valid, setValid] = useState(true);
  const [allErrors, setAllErrors] = useState(Object.values(errors));
  const Url = require("../backendURL");
  const [isVisible, setIsVisible] = useState(false)

  const navigate = useNavigate()

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

  const headerText = "Sign in to DeepData"
  
  const signUpText = "Don't have an account?";

  const signUpLink = 'Sign up now';  

  /******************************
   * handling change when user input and validate input
   *****************************/
  const handleChange = (key) => {
    return ({ target: { value } }) => {
      // Validation
      switch (key) {
        case "email":
          if (validEmailRegex.test(value)) {
            setUserData((oldValues) => ({ ...oldValues, [key]: value }));
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "",
            }));
          } else {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "Email is not valid!",
            }));
          }
          break;
        case "password":
          if (value.length < 8) {
            setErrors((oldValues) => ({
              ...oldValues,
              [key]: "Password must be at least 8 characters!",
            }));
          } else {
            setUserData((oldValues) => ({ ...oldValues, [key]: value }));
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

  /******************************
   * <submit user input>
   * Validating user input information
   * When it succeed with status 200,
   * set localStorage information
   * And go back to "HomePage" or the last page 
   * where user was browsing
   *****************************/

  const onSubmit = async (e) => {
    try{
      e.preventDefault();
    if (validateForm(errors)) {
      setValid(true);
      await userLogin(userData)
    }
     else {
      setValid(false);
    }
    }catch(err){
      toast.error(err)
    }
    
  };

  /******************************
   * Error handling
   *****************************/

  const removeError = (index) => {
    const newError = allErrors.filter((_, i) => i !== index);
    setAllErrors(newError);
  };

  useEffect(() => {
    setAllErrors(Object.values(errors).filter((item) => item.length !== 0));
    setValid(true);
  }, [errors]);

  return (
    <section className='p-login__inputSection'>
      <Toaster />
      <form className="p-login__inputForm" onSubmit={onSubmit}>
      {/* <h1>Sign in to subitt</h1> */}
      <h4 style={{}}>{headerText}</h4>
      <hr />
      <div className='c-inputWrapper__vertical m-margin__top--24' style={{width:"80%"}}>
        <label className='c-input__label'>Email Address:</label>
        <input
          className="c-input" 
          type={`email`}
          onChange={handleChange("email")}
        />
      </div>
      <div className='c-inputWrapper__vertical m-margin__bottom--24' style={{width:"80%"}}>
        <label className='c-input__label'>Password:</label>
        <input
        className='c-input'
        type={isVisible?"text":"password"}
        onChange={handleChange("password")}
        />
        <span 
        style={{position:"absolute",right:8,bottom:33,cursor:"pointer"}}
        onClick={() =>setIsVisible(!isVisible)}
        >{isVisible ? visible : invisible}</span>
      </div>
  
        <button 
        className='c-smallButton'
        style={{width:"80%"}} type="submit">Sign In</button>
        <label 
          className='p-login__resetPassword'
          onClick={()=>navigate("resetPassword")}
        >
          Forgot your password?
        </label>
        <p className='p-login__switch'>
          {signUpText}{' '}
          <wbr />
          <span style={{}} onClick={() => navigate("/SignUp")}><b>{signUpLink}</b></span>
        </p>

      </form>
    </section>
  )
}

export default SignIn