import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer } from 'react-leaflet';
import ContactList from './ContactList';
import Map from './Map';



function MainView(props) {
    const location = useLocation();
    let activeUser = location.state.activeUser;
    let allContacts = location.state.allContacts;
    let history = useHistory();
    const [markers, setMarkers] = useState({ 
         markers: []
    })
  
    const handleLogOut = (e) => {
        e.preventDefault();
        history.push('/');
    }

    const showAddDialog = (e) => {
        e.preventDefault();
        history.push('/add',{ activeUser: activeUser});

    }

    const showAllContacts = (e) => {
        e.preventDefault();
        axios.post('http://localhost:80/adviz/allContacts', activeUser).then(response => {
            history.push('/mainView', { activeUser: activeUser, allContacts: response.data.contacts });
        });
    }

    const showMyContacts = (e) => {
        e.preventDefault();
        axios.get('http://localhost:80/adviz/contacts?userId=' + activeUser.name).then(response => {
            history.push('/mainView', { activeUser: activeUser, allContacts: response.data.contacts });
        })
    }


    return (
        <div className="page" id="admin_view">
            <div className="grid-container">
                <div className="header">
                    <a id="greeting"> Hallo {activeUser.name} </a>
                    <button type="submit" className="button" id="logout_button" value="logout" name="logout_button"
                        onClick={handleLogOut}>LogOut</button>
                </div>
                <div className="menu">
                    <div id="list">
                        <ContactList contacts={allContacts} activeUser={activeUser} />
                    </div>
                </div>
                <div className="main">
                    <div id="map">
                       <Map contacts= {allContacts} />
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