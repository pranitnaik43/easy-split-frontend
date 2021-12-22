import axios from 'axios';
import React, { useState } from 'react';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure() 

const Signup = ({history}) => {
  const dataTemplate = {
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  } 

  const [data, setData] = useState({...dataTemplate});
  const [errors, setErrors] = useState({...dataTemplate});

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
      url: process.env.REACT_APP_SERVER_URL+"/auth/signup",
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    console.log(config);
    axios(config).then(response => {
      // console.log(response);
      if(response.data.success) {
        toast.success("Registeration Successful", {autoClose: 5000});
        history.push("/login");
      } else if(response.data.error){
        toast.error("Registeration Failed:"+ response.data.error.message, {autoClose: 5000});
      }
    }).catch(function (error) {
      toast.error("Registeration Failed:"+ error, {autoClose: 5000});
      // console.log(error);
    });
  }
  return ( 
    <>
      <div className="row my-5 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 bg-dark bg-opacity-50 px-5 py-4">
          <h1 className="text-center text-primary">Register</h1>
          <form>
            <div className="mt-3">
              <label htmlFor="first_name"  className="text-warning">First Name</label>
              <input name="first_name" type="text" className="form-control" onChange={handleChange}/>
              <span className="text-danger">{errors.first_name}</span>
            </div>
            <div className="mt-3">
              <label htmlFor="last_name"  className="text-warning">Last Name</label>
              <input name="last_name" type="text" className="form-control" onChange={handleChange}/>
              <span className="text-danger">{errors.last_name}</span>
            </div>
            <div className="mt-3">
              <label htmlFor="email"  className="text-warning">Email address</label>
              <input name="email" type="email" className="form-control" onChange={handleChange}/>
              <span className="text-danger">{errors.email}</span>
            </div>
            <div className="mt-3">
              <label htmlFor="password"  className="text-warning">Password</label>
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
 
export default Signup;