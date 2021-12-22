import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Members from './Members';
toast.configure();

const Plan = ({ history }) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const [plan, setPlan] = useState(null);

  let params = useParams();

  let planId = params.id

  var config = {
    method: 'GET',
    url: process.env.REACT_APP_SERVER_URL + '/plans/' + planId,
    headers: {
      'Content-Type': 'application/json',
      'access-token': authState.accessToken
    }
  };

  useEffect(() => {
    // get all plans
    axios(config).then(response => {
      if (response.data.error) {
        toast.error("Error:" + response.data.error.message, { autoClose: 5000 });
        console.log(response.data.error);
      } else if (response.data) {
        setPlan(response.data);
      }
    }).catch(err => {
      console.log(err);
    })
    // eslint-disable-next-line
  }, [])

  const addMemberToPlan = (member) => {
    plan.members.push(member);
    setPlan({...plan});
  }

  return (
    <>
      <div className="container bg-dark bg-opacity-50 rounded mt-3 p-3 pb-5">
        {
          (plan) ? (
            <>
              <h2 className='text-primary mb-3'>{plan.name}</h2>
              <nav>
                <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                  <button className="nav-link active bg-dark bg-opacity-10 text-info" data-bs-toggle="tab" data-bs-target="#nav-members" role="tab">Members</button>
                  <button className="nav-link bg-dark bg-opacity-10 text-info" data-bs-toggle="tab" data-bs-target="#nav-payments" role="tab">Payments</button>
                  <button className="nav-link bg-dark bg-opacity-10 text-info" data-bs-toggle="tab" data-bs-target="#nav-debt" role="tab">Debts</button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-members" role="tabpanel">
                  <Members members={plan.members} planId={planId} addMemberToPlan={addMemberToPlan}/>
                </div>
                <div className="tab-pane fade" id="nav-payments" role="tabpanel">

                </div>
                <div className="tab-pane fade" id="nav-debt" role="tabpanel">

                </div>
              </div>
            </>
          ) : (<p className='bg-dark bg-opacity-50 text-white text-center'>No data found</p>)
        }
      </div>
    </>
  );
}

export default Plan;