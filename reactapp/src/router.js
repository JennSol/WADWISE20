import React from "react";
import Login from "./components/Login";
import MainView from "./components/MainView";
import EditView from "./components/EditView";
import AddNewContactView from "./components/AddNewContactView";

const routes = {
  "/login": () => <Login />,
  "/mainView":()=> <MainView/>,
  "/editView":()=> <EditView/>,
  "/addNewContactView":()=> <AddNewContactView/>
};

export default routes;