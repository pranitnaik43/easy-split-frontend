import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const Debt = ({ members, planId, payments, getMemberName, getCurrenyINRformat }) => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  const [debts, setDebts] = useState([]);

  let memberIdToIndex = {};
  members.forEach((member, index) => { memberIdToIndex[member.id] = index });

  const removeCylclesDFS = async (arr, sourceIndex) => {
    let numOfMembers = members.length;

    while (true) {
      if (sourceIndex >= numOfMembers || sourceIndex < 0) {
        console.log("invalid");
        return arr;
      }

      let explored = new Array(numOfMembers).fill(0); //0-unvisited; 1-explored

      let stack = [sourceIndex];
      let path = [];
      let isCycle = false;
      console.log("start", sourceIndex)

      while (stack.length > 0) {
        // console.log(stack, path);
        if (path.length > 0 && stack[stack.length - 1] === path[path.length - 1]) {
          let p = path.pop();
          stack.pop();
          explored[p] = 1
          continue;
        }
        let p = stack[stack.length - 1];
        if (explored[p]) {
          stack.pop();
        }
        path.push(p);
        // console.log(stack, path, p)
        for (let q = 0; q < numOfMembers; q++) {
          let value = arr[p][q];
          if (value !== 0) {
            if (q === sourceIndex) {
              isCycle = true;
              break;
            }
            if (path.includes(q)) continue;  //skip 'q' because it is already visited
            if (explored[q]) continue;
            stack.push(q);
          }
        }
        // console.log(isCycle);
        if (isCycle) break;

      }

      if (isCycle) {
        let pathLength = path.length;
        // console.log(path);
        let minval = Number.POSITIVE_INFINITY;
        //get min value in path
        for (let i = 0; i < pathLength; i++) {
          let value = arr[path[i]][path[(i + 1) % pathLength]];
          if (value < minval) { minval = value; }
        }
        // console.log("deduct min value", minval);
        for (let i = 0; i < pathLength; i++) {
          arr[path[i]][path[(i + 1) % pathLength]] -= minval;
        }
      } else {
        sourceIndex += 1;
      }
    }
  }

  const calcDebt = async () => {
    if (!payments || payments.length <= 0) {
      return;
    }
    let debtArray = Array(members.length).fill().map(() => Array(members.length).fill(0));

    //loop over payments to create the debts array
    payments.forEach((payment) => {
      if (payment.splitAmong.length > 0) {
        payment.paidBy.forEach((payer) => {
          let amount = payer.amount / payment.splitAmong.length;
          amount = Math.ceil(amount * 100) / 100; //round up to two decimal places
          payment.splitAmong.forEach((memberId) => {
            if (memberId !== payer.memberId) {
              debtArray[memberIdToIndex[memberId]][memberIdToIndex[payer.memberId]] += amount;
            }
          });
        });
      }
    });

    debtArray = await removeCylclesDFS(debtArray, 0);
    setDebts(debtArray);
    console.log(debtArray);
  }

  const getSum = (total, num) => {
    return total + num;
  }

  useEffect(() => {
    calcDebt();
    // eslint-disable-next-line
  }, [payments]);

  return (
    <>
      <div className='mt-4'>
        <div className=''>
          {
            (debts.length > 0) ? (
              <div className="row d-flex justify-content-center text-dark">
                <div className='col-12 col-md-6'>
                  {
                    members.filter(member => (  // get only those members who are being owed money
                        debts[memberIdToIndex[member.id]].reduce(getSum)!==0
                      )
                    ).map(member => (
                        <div key={member.id}>
                          {console.log(member.id)}
                          <div className="card my-3">
                            <div className="card-header">
                              <h4>{member.name}</h4>
                            </div>
                            <ul className="list-group list-group-flush">
                              {
                                members.filter(member2 => (  // get only those members who owe money
                                  debts[memberIdToIndex[member.id]][memberIdToIndex[member2.id]]!==0
                                )
                              ).map(member2 => (
                                  // (debts[memberIdToIndex[member.id]][memberIdToIndex[member2.id]]) ? (
                                    <li className="list-group-item" key={member2.id}><i className="bi bi-arrow-right me-2"></i>owes <em>{getCurrenyINRformat(debts[memberIdToIndex[member.id]][memberIdToIndex[member2.id]])}</em> to <strong>{member2.name}</strong></li>
                                  // ) : (<></>)
                                ))
                              }

                            </ul>
                          </div>
                        </div>
                    ))
                  }
                </div>
              </div>
            ) : (<p className='text-white text-center'>No debts yet</p>)
          }
        </div>
      </div>
    </>
  );
}

export default Debt;