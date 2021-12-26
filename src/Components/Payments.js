import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditPayment from './EditPayment';
toast.configure();

const Payments = ({ planId, members, payments, getPayments, deletePayment, getMemberName, getCurrenyINRformat }) => {

  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const addPayment = () => {
    setModalData(null);
    setShowModal(true);
  }

  const editPayment = (payment) => {
    setModalData({ ...payment });
    setShowModal(true);
  }

  return (
    <>
      {/* {console.log(payments)} */}
      <div className='mt-3'>
        <div className='d-flex'>
          <button className="btn btn-primary ms-auto" type="button" onClick={addPayment}>Add Payment</button>
        </div>

        <div className='border-top border-white my-3'></div>  {/* divider */}
        <div className='mt-3'>
          {
            (payments && Array.isArray(payments) && payments.length > 0) ? (
              <div className="row d-flex justify-content-center text-white">
                <div className='col-12 col-md-9'>
                  {
                    (payments.map(payment => (
                      <div className='bg-dark rounded position-relative px-5 py-3 my-2' key={payment._id}>
                        <div className="dropdown position-absolute p-1" style={{ top: "0.5rem", right: "0.5rem", zIndex: 1 }}>
                          <i className="bi bi-three-dots-vertical px-2 py-1 rounded-circle text-white" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown"></i>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" onClick={() => { editPayment(payment) }}>Edit</button>
                            <button className="dropdown-item" onClick={() => { deletePayment(payment._id) }}>Delete</button>
                          </div>
                        </div>
                        <h3>{payment.title}</h3>
                        {
                          (payment.note) ? (
                            <div className='row my-2'>
                              <div className='col-3'>Note: </div>
                              <div className='col-9'>{payment.note}</div>
                            </div>
                          ) : (<></>)
                        }
                        {
                          (!payment.settlement) ? (
                            <>
                              <>
                              {/* Paid By */}
                                {
                                  (payment.paidBy.length > 0) ? (
                                    <div className='row my-2' key={1}>
                                      <div className='col-3'>Paid By: </div>
                                      <div className='col-9'>{payment.paidBy.map(payer => `${(getMemberName(payer.memberId))} (${getCurrenyINRformat(payer.amount)})`).join("; ")}</div>
                                    </div>
                                  ) : (<></>)
                                }
                              </>
                              <>
                              {/* Split among */}
                                {
                                  (payment.splitAmong.length > 0) ? (
                                    <div className='row my-2' key={2}>
                                      <div className='col-3'>Split Among: </div>
                                      <div className='col-9'>{payment.splitAmong.map(memberId => `${(getMemberName(memberId))}`).join("; ")}</div>
                                    </div>
                                  ) : (<></>)
                                }
                              </>
                            </>
                          ) : (<></>)
                        }

                      </div>
                    )))
                  }
                </div>
              </div>
            ) : (<p className='text-white text-center'>No payments added yet</p>)
          }
        </div>
      </div>
      {
        (showModal) ? (<EditPayment modalData={modalData} planId={planId} members={members} showModal={showModal} setShowModal={setShowModal} getPayments={getPayments} getMemberName={getMemberName} getCurrenyINRformat={getCurrenyINRformat} />) : (<></>)
      }
    </>
  );
}

export default Payments;