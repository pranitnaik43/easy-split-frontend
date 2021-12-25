import { Modal } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const EditPayment = ({ modalData, planId, members, showModal, setShowModal, getPayments, getMemberName, getCurrenyINRformat }) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const dataTemplate = {
    title: "",
    note: "",
    paidBy: [],
    splitAmong: []
  };

  const payerTemplate = {
    memberId: "",
    amount: 0
  };

  const [data, setData] = useState({ ...dataTemplate });
  const [payer, setPayer] = useState({ ...payerTemplate }); //Id of payer and amount paid
  const [heading, setHeading] = useState("");
  const inputRef = useRef();

  var config = {
    headers: {
      'Content-Type': 'application/json',
      'access-token': authState.accessToken
    }
  };

  useEffect(() => {
    try {
      if (modalData) {   //edit payment
        let { title, note, paidBy, splitAmong } = modalData
        setData({ title, note, paidBy, splitAmong });
        setHeading("Edit Payment");
      }
      else {    //add payment
        setData({ ...dataTemplate });
        setHeading("Add Payment");
      }
      setPayer({ ...payerTemplate });
    }
    catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  const isMemberAdded = (memberId) => {
    let member = data.paidBy.find(member => (member.memberId === memberId));
    if (member) return true;
    return false;
  }

  const canAddPayer = () => {
    // console.log(payer, payer.memberId !== "", payer.amount !== 0)
    if (payer.memberId !== payerTemplate.memberId && payer.amount !== payerTemplate.amount) {
      return true;
    }
    return false;
  }

  const payerModified = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "amount") {
      if (value < 0) value = 0;
    }

    setPayer({ ...payer, [name]: value })
  }

  const addPayer = () => {
    let tempData = { ...data };
    tempData.paidBy.push(payer);
    setData({ ...tempData });
    setPayer({ ...payerTemplate });   //clear Payer input fields
  }

  const removePayer = (memberId) => {
    let tempData = { ...data };
    tempData.paidBy = tempData.paidBy.filter(payer => (payer.memberId !== memberId));
    setData({ ...tempData });
  }

  const handleChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    let tempData = {...data};
    
    switch(name) {
      case "title": 
        tempData.title = value;
        break;
      case "note":
        tempData.note = value;
        break;
      case "splitAmong":
        if(target.checked) {
          if(!tempData.splitAmong.includes(value)) {
            tempData.splitAmong.push(value);
          }
        }
        else {
          tempData.splitAmong = tempData.splitAmong.filter(memberId => (memberId!==value))
        }
        break;
      default: 
        break;
    }
    setData({...tempData});
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalData) {   //edit payment
      config.method = "PUT";
      config.url = process.env.REACT_APP_SERVER_URL + '/plans/' + planId + "/payments/" + modalData._id;
    }
    else {    //add payment
      config.method = "POST";
      config.url = process.env.REACT_APP_SERVER_URL + '/plans/' + planId + "/payments/";
    }
    config.data = {...data};

    axios(config).then(response => {
      if (response.data) {
        if (response.data.error) {
          toast.error(response.data.error.message, { autoClose: 5000 });
        } else if (response.data.success) {
          toast.success(response.data.success.message, { autoClose: 5000 });
          setData({ ...dataTemplate });
          setShowModal(false); 
          getPayments();
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const closeModal = () => {
    setShowModal(false);
    setPayer({ ...payerTemplate });
    setData({ ...dataTemplate });
  }

  return (
    <>
    {/* {console.log(data)} */}
      <Modal show={showModal} tabIndex="-1" onEntered={() => inputRef.current.focus()} centered>
        <Modal.Header>
          <h5 className="modal-title">{heading}</h5>
          <i className="bi bi-x-lg" role="button" onClick={closeModal}></i>
        </Modal.Header> 
        <form onSubmit={handleSubmit}>
          <Modal.Body className="overflow-auto" style={{maxHeight: "60vh"}}>
            {/* title- what the patment is for */}
            <div className="form-floating mb-2">
              <input name="title" type="text" className="form-control" placeholder="title" ref={inputRef} value={data.title} onChange={handleChange} autoFocus={true} />
              <label htmlFor="title">Title <span className="text-danger">*</span></label>
            </div>

            {/* an optional note */}
            <div className="form-floating mb-2">
              <input name="note" type="text" className="form-control" placeholder="Optional Note" value={data.note} onChange={handleChange} />
              <label htmlFor="note">Note</label>
            </div>

            {/* list of payers and input field to add payer */}
            <div className="mb-2">
              <fieldset className="border p-3 pt-0">
                <legend className="float-none w-auto fs-6">Paid By <span className="text-danger">*</span> </legend>
                {/* input field to add payer */}
                <div>
                  <div className="input-group">
                    {/* dropdown for list of members */}
                    <select name="memberId" className="form-select" value={payer.memberId} onChange={payerModified}>
                      <option value="">Select member</option>
                      {
                        members.map(member => (
                          <option key={member.id} value={member.id} disabled={isMemberAdded(member.id)}>{member.name}</option>
                        ))
                      }
                    </select>
                    {/* input field for amount paid by selected member */}
                    <input name="amount" type="number" className="form-control" placeholder="Amount (INR)" value={payer.amount} onChange={payerModified} />
                    <button className="btn btn-outline-secondary" type="button" onClick={addPayer} disabled={!canAddPayer()}>Add</button>
                  </div>
                </div>
                {/* list of payers */}
                <div>
                  {
                    [...data.paidBy].reverse().map(payer => (
                      <div className="row bg-secondary text-white rounded px-2 py-1 m-1" key={payer.memberId}>
                        <div className="col">{getMemberName(payer.memberId)}</div>
                        <div className="col">{getCurrenyINRformat(payer.amount)}</div>
                        <div className="col-1 ms-auto">
                          <i className="bi bi-x" role="button" onClick={() => { removePayer(payer.memberId) }}></i>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </fieldset>
            </div>

            {/* Split Among */}
            <div className="mb-2">
              <fieldset className="border p-3 pt-0">
                <legend className="float-none w-auto fs-6">Split among <span className="text-danger">*</span> </legend>
                {/* list of members with checkboxes */}
                <div>
                  {
                    members.map(member => (
                      <div className="form-check form-check-inline mx-3" key={member.id}>
                        <input name="splitAmong" className="form-check-input" type="checkbox" value={member.id} checked={data.splitAmong.includes(member.id)} id={`memberCheck-${member.id}`} onChange={ handleChange }/>
                        <label className="form-check-label" htmlFor={`memberCheck-${member.id}`}>{member.name}</label>
                      </div>
                    ))
                  }
                </div>
              </fieldset>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default EditPayment;