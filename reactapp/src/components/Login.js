//https://gist.github.com/codeclassifiers/83659bb2a05234e81161aaa2f8339fa8#file-usestateexample-js
import React, { useState } from 'react';
import { connect } from 'redux';
import axios from 'axios';


function Login(props) {
  const [userLoginData, setUserLoginData] = useState({
    username: "",
    password: ""
  })


  const handleChange = (e) => {
    const { id, value } = e.target
    setUserLoginData(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmitClick = (e) => {
    console.log("Click");
    if(userLoginData.username.length && userLoginData.password.length)
    {sendUserLoginDataToServer()}
  }

   const sendUserLoginDataToServer = () => {
    const payload = {
      "username": userLoginData.username,
      "password": userLoginData.password
    };

    axios.post('/adviz/login', payload)
      .then(function (response) {
        if (response.status === 200) {
          setUserLoginData(prevState => ({
            ...prevState,
          }))
          //activeUser = new User(payload.user.userid, null, [], payload.user.admin);
          props.showError(null)
        } else {
          props.showError("Some error ocurred");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } 



  return (
    <div className="page" id="login_view">
    <form onSubmit={handleSubmitClick}>
      <h1>Login</h1>
      <label>
        Username:
              <input type="text" username={userLoginData.username} onChange={handleChange} required/>
      </label>
      <label>
        Passwort:
              <input type="text" password={userLoginData.password} onChange={handleChange} required/>
      </label>
      <button onClick={() => handleSubmitClick()} > LogIn</button>

    </form>
    </div>
  );
}



export default Login;