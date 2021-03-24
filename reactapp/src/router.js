import React from "react";
import Login from "./components/Login";
import MainView from "./components/MainView";
import EditView from "./components/EditView";

const routes = {
  "/login": () => <Login />,
  "/mainView":()=> <MainView/>,
  "/editView":()=> <EditView/>
};

export default routes;