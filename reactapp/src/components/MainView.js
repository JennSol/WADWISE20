import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { userLogOut } from '../actions/userActions';

import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ContactList from './ContactList';




function MainView(props) {
    const dispatch = useDispatch();
    const activeUser = useSelector(state => state.activeUser);
   const allContacts = useSelector(state=> state.allContacts);
    console.log('main', allContacts);
    console.log('main', activeUser.name);
      useEffect(() => {
     

        // Safe to add dispatch to the dependencies array
    });
    let history = useHistory();
  



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
                    <a id="greeting"> Hallo {activeUser.name} </a>
                    <button type="submit" className="button" id="logout_button" value="logout" name="logout_button"
                        onClick={handleLogOut}>LogOut</button>
                </div>
                <div className="menu">
                    <div id="list">
                        <ContactList contacts={allContacts} />,
                    </div>
                </div>
                <div className="main">
                    <div id="map">
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[51.505, -0.09]}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer>
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