import React from "react";
import Login from "./components/Login";
import MainView from "./components/MainView";

const routes = {
  "/login": () => <Login />,
  "/mainview":()=> <MainView/>,
};

export default routes;