import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { userLogOut } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";


function MainView(props) {
    const [Contact, setUserLoginData] = useState({
        username: "",
        password: ""
    })
    let history = useHistory();

    const dispatch = useDispatch();


    const handleLogOut = (e) => {
        e.preventDefault();
        dispatch(userLogOut());
        console.log('logout');
        history.push('/');
    }

    const showAddDialog = (e) => {
        e.preventDefault();
    }

    const showAllContacts = (e) => {
        e.preventDefault();
    }

    const showMyContacts = (e) => {
        e.preventDefault();
    }


    return (
        <div className="page" id="admin_view">
            <div className="grid-container">
                <div className="header">
                    <a id="greeting"> Hello... </a>
                    <button type="submit" className="button" id="logout_button" value="logout" name="logout_button"
                        onClick={handleLogOut}>LogOut</button>
                </div>
                <div className="menu">
                    <div id="list">
                        <ul id="contact_list" name="contact_list">
                        </ul>
                    </div>
                </div>
                <div className="main">
                    <div id="map">
                    </div>
                </div>
                <div className="footer">
                    <div id="menu">
                        <button id="button_showmine" className="button" onClick={showMyContacts}>
                            Zeige meine
              </button>
                        <button id="button_showall" className="button" onClick={showAllContacts}>
                            Zeige alle
              </button>
                        <button id="button_addnew" className="button" onClick={showAddDialog}>
                            Neu
              </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MainView;