import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { customAlphabet } from 'nanoid';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure();

const CreatePlan = ({history}) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const nanoid = customAlphabet('1234567890abcdef', 24)

  const handleChange = (e) => {
    let value = e.target.value;
    if(!value) {
      setError("Name cannot be empty");
    }
    else {
      setError("");
    }
    setName(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var config = {
      method: 'post',
      url: process.env.REACT_APP_SERVER_URL+"/plans",
      headers: { 
        'Content-Type': 'application/json',
        'access-token': authState.accessToken
      },
      data : { name, members: [{id: nanoid(), name: authState.name}] }
    };
    axios(config).then(response => {
      console.log(response);
      if(response.data.success) {
        toast.success("Plan created successfully", {autoClose: 3000});
        history.push("/home");
      } else if(response.data.error){
        toast.error("Error:"+ response.data.error.message, {autoClose: 5000});
      }
    }).catch(function (error) {
      // toast.error("Error:"+ error, {autoClose: 5000});
      console.log("Error creating plan: ",error);
    });
  }
  return ( 
    <>
      <div className="row my-4 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 bg-dark bg-opacity-50 px-5 py-4">
          <h1 className="text-center text-primary">Create Plan</h1>
          <form>
            <div className="mt-3">
              <label htmlFor="name" className="text-warning">Name</label>
              <input name="name" type="text" className="form-control" onChange={handleChange} value={name}/>
              <span className="text-danger">{error}</span>
            </div>
            <button type="submit" className="btn btn-primary mt-3" onClick={ handleSubmit } disabled={name===""}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
 
export default CreatePlan;