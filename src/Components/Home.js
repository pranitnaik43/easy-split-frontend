import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Home = ({ history }) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const [plans, setPlans] = useState([]);

  var config = {
    method: 'GET',
    url: process.env.REACT_APP_SERVER_URL + '/plans',
    headers: {
      'Content-Type': 'application/json',
      'access-token': authState.accessToken
    }
  };

  useEffect(() => {
    //get all plans
    axios(config).then(response => {
      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data && Array.isArray(response.data)) {
        setPlans(response.data);
      }
    }).catch(err => {
      console.log(err);
    })
    // eslint-disable-next-line
  }, [])

  return (
    <div className="container bg-white bg-opacity-25 rounded mt-3 p-3">
      <h2 className='text-center text-primary'>My Plans</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 m-5 d-flex justify-content-center">
        {
          (plans && plans.length > 0) ? (
            plans.map(plan => {
              return (
                <div className="col" key={plan._id}>
                  <div className="position-relative w-100">
                    {/* <div className="dropdown position-absolute p-1" style={{ top: "0.5rem", right: "0.5rem", zIndex: 1 }}>
                      <i className="bi bi-three-dots-vertical px-2 py-1 rounded-circle" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown"></i>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button className="dropdown-item" onClick={() => { }}>Edit</button>
                        <button className="dropdown-item" onClick={() => { }}>Delete</button>
                      </div>
                    </div> */}
                    <div role="button" className={"p-5 text-white d-flex justify-content-center w-100 position-relative rounded bg-primary bg-gradient shadow"} onClick={() => { history.push("/plan/" + plan._id) }}>
                      {plan.name}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center">List is empty. Add a new plan</p>
          )
        }
      </div>
    </div>
  );
}

export default Home;