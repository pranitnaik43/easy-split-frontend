import { useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { customAlphabet } from 'nanoid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const Members = ({ planId, members, addMemberToPlan }) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const [memberName, setMemberName] = useState("");

  const nanoid = customAlphabet('1234567890abcdef', 24)

  var config = {
    method: 'POST',
    url: process.env.REACT_APP_SERVER_URL + '/plans/' + planId + '/add-member',
    headers: {
      'Content-Type': 'application/json',
      'access-token': authState.accessToken
    }
  };

  const addMember = (e) => {
    e.preventDefault();
    let member = {
      id: nanoid(),
      name: memberName
    };
    config.data = {...member}
    // console.log(config)
    axios(config).then(response => {
      if(response.data.success) {
        toast.success("Member added successfully", {autoClose: 3000});
        addMemberToPlan(member);
        setMemberName("");
      } else if(response.data.error) {
        toast.error("Error:"+ response.data.error.message, {autoClose: 5000});
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <>
      <div className='d-flex flex-column'>
        <form onSubmit={(e) => { addMember(e)}}>
          {/* input field for adding member */}
          <div className="input-group mt-5 w-75 mx-auto">
            <input type="text" className="form-control" placeholder="Member's Name" value={memberName} onChange={(e) => { setMemberName(e.target.value) }}/>
            <button className="btn btn-primary" type="button" disabled={memberName===""} onClick={(e) => { addMember(e) }}>Add</button>
          </div>
        </form>

        <div className='border-top border-white my-3'></div>  {/* divider */}
        <div className='mt-3'>
          {
            (members && Array.isArray(members) && members.length > 0) ? (
            <div className="row d-flex justify-content-center text-white">
              <div className='col-12 col-md-6'>
              <h5>Members:</h5>
              <ul>
                {
                  members.map((member, index) => (
                    <li key={index}>{member.name}</li>
                  ))
                }
              </ul>
              </div>
              </div>
            ) : (<p className='text-white text-center'>There are no added members</p>)
          }
        </div>
      </div>

    </>
  );
}

export default Members;