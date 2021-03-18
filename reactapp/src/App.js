//https://blog.logrocket.com/how-react-hooks-can-replace-react-router/
import React from "react";
import { useRoutes, A } from "hookrouter";
import "./styles.css";
import routes from "./router";
import LogIn from "./components/Login";



function App() {
  const routeResult = useRoutes(routes);
  return (
    <div className="App">
      {routeResult ||<LogIn/> }
    </div>
  );
}
export default App;
