import Cookies from 'js-cookie'

export const SET = "SET";
export const EMPTY = "EMPTY";

let accessToken = Cookies.get("accessToken"); 
if(!accessToken) accessToken = null;

let isAdmin = Cookies.get("isAdmin");
if(!isAdmin) isAdmin = false;

let name = Cookies.get("name"); 
if(!name) name = null;

let email = Cookies.get("email"); 
if(!email) email = null;

export const authReducer = (state={accessToken, isAdmin, name, email}, action) => {
  switch(action.type) {
    case SET: {
      if(action.data) {
        if(action.data.accessToken) {
          let accessToken = action.data.accessToken;
          state.accessToken = accessToken
          //set cookie (expires in 2 days)
          Cookies.set('accessToken', accessToken, { expires: 2 })
        }
        if(action.data.isAdmin===true) {
          let isAdmin = action.data.isAdmin;
          state.isAdmin = isAdmin;
          //set cookie (expires in 2 days)
          Cookies.set('isAdmin', isAdmin, { expires: 2 })
        }
        if(action.data.name) {
          let name = action.data.name;
          state.name = name;
          //set cookie (expires in 2 days)
          Cookies.set('name', name, { expires: 2 })
        }
        if(action.data.email) {
          let email = action.data.email;
          state.email = email;
          //set cookie (expires in 2 days)
          Cookies.set('email', email, { expires: 2 })
        }
      }
      return { ...state };
    }

    case EMPTY: {
      Cookies.remove('accessToken');
      Cookies.remove('isAdmin');
      Cookies.remove('name');
      Cookies.remove('email');
      return {accessToken: null, isAdmin: false, name: null, email: null};
    }

    default: {
      return state;
    }
      
  }
}