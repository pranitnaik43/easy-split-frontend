import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "./store";
import Nav from './Components/Nav';
import Home from './Components/Home';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import CreatePlan from './Components/CreatePlan';
import Plan from './Components/Plan';

function App() {
  return (
    <BrowserRouter>
        <Provider store={store}>
          <h1 className="logo m-2">EasySplit</h1>
          <Nav />
          <div className="container-fluid">
            <Switch>
              <Route exact path="/home" component={Home}></Route>
              <Route exact path="/create-plan" component={CreatePlan}></Route>
              <Route exact path="/plan/:id" component={Plan}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/" exact>
                <Redirect to="/home" />
              </Route>
            </Switch>
          </div>
        </Provider>
      </BrowserRouter>
  );
}

export default App;
