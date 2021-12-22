import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { SET } from '../../reducers/authReducer'; 
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure();

const Login = ({history}) => {
  const dataTemplate = {
    email: "",
    password: ""
  } 

  const [data, setData] = useState({...dataTemplate});
  const [errors, setErrors] = useState({...dataTemplate});

  // redux for auth
  const dispatch = useDispatch();
  const setAuth = (data) => dispatch({ type: SET, data });

  const validatePassword = (password) => {
    let passErrors = [];
    if(password.length<6) {
      passErrors.push("Password should have atleast 6 characters.");
    }
    if (password.search(/[a-z]/i) < 0) {
      passErrors.push("Your password must contain at least one letter.");
    }
    if (password.search(/[0-9]/) < 0) {
      passErrors.push("Your password must contain at least one digit."); 
    }

    if(passErrors.length > 0)
      errors.password = passErrors.join(";");
    else
      errors.password = "";
    setErrors({ ...errors });
  }

  let capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    
    if(name==="password") {
      validatePassword(value);
    }
    else if(!value) {
      setErrors({...errors, [name]: capitalizeFirstLetter(name)+" cannot be empty"});
    }
    else {
      setErrors({...errors, [name]: ""});
    }
    setData({ ...data, [name]: value });
  }

  const canSubmit = () => {
    var flag = true;
    Object.keys(data).forEach(key => {
      if(data[key]==="")
        flag = false;
    });
    Object.keys(errors).forEach(key => {
      if(errors[key]!=="")
        flag = false;
    });
    return flag;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var config = {
      method: 'post',
      url: process.env.REACT_APP_SERVER_URL+"/auth/signin",
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config).then(response => {
      console.log(response);
      if(response.data.success) {
        let accessToken = response.data.success.accessToken;
        let isAdmin = false;

        if(accessToken) {
          if(response.data.success.isAdmin) {
            isAdmin = true;
          }
          setAuth({ accessToken, isAdmin, name: response.data.success.name, email: data.email });
          toast.success("Login Successful", {autoClose: 5000});
          
          history.push("/home");
        }
      } else if(response.data.error){
        toast.error("Login Failed:"+ response.data.error.message, {autoClose: 5000});
      }
    }).catch(function (error) {
      toast.error("Login Failed:"+ error, {autoClose: 5000});
      // console.log(error);
    });
  }
  return ( 
    <>
      <div className="row my-4 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 bg-dark bg-opacity-50 px-5 py-4">
          <h1 className="text-center text-primary">Login</h1>
          <form>
            <div className="mt-3">
              <label htmlFor="email" className="text-warning">Email address</label>
              <input name="email" type="email" className="form-control" onChange={handleChange}/>
              <span className="text-danger">{errors.email}</span>
            </div>
            <div className="mt-3">
              <label htmlFor="password" className="text-warning">Password</label>
              <input name="password" type="password" className="form-control" onChange={handleChange}/>
              {
                errors.password.split(";").map((error, index) => {
                  return <React.Fragment key={ index }><span className="text-danger">{ error }</span><br/></React.Fragment>
                })
              }
            </div>
            
            <button type="submit" className="btn btn-primary" onClick={ handleSubmit } disabled={!canSubmit()}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
 
export default Login;