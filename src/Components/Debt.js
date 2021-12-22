import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const Debt = () => {
  // auth state from redux store
  const authState = useSelector((state) => state);

  return (
    <>
      
    </>
  );
}

export default Debt;