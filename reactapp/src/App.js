//https://blog.logrocket.com/how-react-hooks-can-replace-react-router/
import React from "react";
import { useRoutes } from "hookrouter";
import "./styles.css";
import routes from "./router";
import LogIn from "./components/Login";
import MainView from './components/MainView';
import EditView from './components/EditView';
import AddNewContactView from "./components/AddNewContactView";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";




function App() {
  return (
  <Switch>
  <Route path="/" component={LogIn} exact />
  <Route path="/mainView" component={MainView} />
  <Route path="/editView" component={EditView} />
  <Route path="/add" component={AddNewContactView} />
</Switch>
  /* const routeResult = useRoutes(routes);
 
    <div className="App">
      {routeResult ||<LogIn/> }
    </div> */
  );
}
export default App;
