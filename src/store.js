import * as redux from "redux";

import { authReducer } from "./reducers/authReducer";

export const store = redux.createStore(authReducer);