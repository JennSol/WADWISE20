//https://gist.github.com/codeclassifiers/83659bb2a05234e81161aaa2f8339fa8#file-usestateexample-js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { userLogin } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";


function Login(props) {
  let history = useHistory();

  console.log(props);
  const [userLoginData, setUserLoginData] = useState({
    username: "",
    password: ""
  })

  
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { id, value } = e.target
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
    console.log("Click");
    if (userLoginData.username && userLoginData.password) {
      console.log(userLoginData);

        axios
        .post("http://localhost:80/adviz/login", payload)
        .then(res => {
          console.log('hmmm')
          if (res.status == 200) {
            console.log('Bitte')
                dispatch(userLogin( { name: res.data.user.userid, admin: res.data.user.admin }));
                console.log(res.data.user.userid);
            /*     setTimeout(()=>{
                  props.history.push('/mainView')
                },2000); */
                  history.push('/mainView');
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