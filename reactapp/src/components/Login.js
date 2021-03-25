//https://gist.github.com/codeclassifiers/83659bb2a05234e81161aaa2f8339fa8#file-usestateexample-js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";


function Login(props) {
  const history = useHistory();
  const [userLoginData, setUserLoginData] = useState({
    username: "",
    password: ""
  })

  const handleChange = (e) => {
    setUserLoginData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      "username": userLoginData.username,
      "password": userLoginData.password
    };
    if (userLoginData.username && userLoginData.password) {
      console.log(userLoginData);

      axios.post("http://localhost:80/adviz/login", payload)
        .then(res => {
          if (res.status == 200) {
            const activeUser = {
              name: res.data.user.userid, admin: res.data.user.admin ,
            };
                axios.post('http://localhost:80/adviz/allContacts', activeUser).then(response => {
                history.push('/mainView', {activeUser:activeUser, allContacts: response.data.contacts});
              })
                  .catch(error => {
                      console.log(error)
                  })
          }
          else if (res.status == 401) {
              alert('Benutzername oder Passwort inkorrekt');
          }
      })
    }
   
  }

  return (
    <div className="page" id="login_view">
      <form onSubmit={handleSubmitClick}>
        <h1>Login</h1>
        <label>
          Username:
              <input type="text" name='username' value={userLoginData.username} onChange={handleChange} required />
        </label>
        <label>
          Passwort:
              <input type="text" name='password' value={userLoginData.password} onChange={handleChange} required />
        </label>
        <button type='submit'> LogIn</button>

      </form>
    </div>
  );
}


export default Login;