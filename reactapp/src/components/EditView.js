import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Dialog from './Dialog';
import { useLocation } from "react-router-dom";



function EditView(props) {
    let history = useHistory();
    const location = useLocation();
    let contact = location.state.editContact;
    let activeUser = location.state.activeUser;
    const [contactData, setContactData] = useState({
        title: contact.title,
        gender: contact.gender,
        firstname: contact.firstname,
        lastname: contact.lastname,
        street: contact.street,
        house: contact.house,
        postcode: contact.postcode,
        city: contact.city,
        country: contact.country,
        email: contact.email,
        other: contact.other,
        private: contact.private,
    })

    let geoCoords = [];
    const handleSubmit = (e) => {
        let payload;
        e.preventDefault();
        let call = "https://api.tomtom.com/search/2/geocode/" + contactData.street + "%20" + contactData.house + "%20" + contactData.city + ".json?limit=1?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
        const request = new Request(call);
        fetch(request)
            .then(response => response.json())
            .then(json => {
                json.results.forEach(result => {
                    if (result.type == "Point Address") {
                        geoCoords = [parseFloat(result.position.lat), parseFloat(result.position.lon)]
                    };
                });
            }).then(() => {
                if (geoCoords.length > 0) {
                    payload = {
                        ...contactData,
                        geoCoord: geoCoords,
                        owner: contact.owner
                    }
                    axios
                        .put("http://localhost:80/adviz/contacts/" + contact._id, payload)
                        .then(res => {
                            if (res.status == 204) {
                                axios.post('http://localhost:80/adviz/allContacts', activeUser).then(response => {
                                    history.push('/mainView', { activeUser: activeUser, allContacts: response.data.contacts });
                                })
                            }
                        });
                }
                else {
                    alert('Keine vernünftige Adresse angegeben')
                }
            });


    }


    const deleteContact = (e) => {
        e.preventDefault();
        axios.delete("http://localhost:80/adviz/contacts/" + contact._id)
        .then(res => {
            if (res.status == 204) {
                axios.post('http://localhost:80/adviz/allContacts', activeUser).then(response => {
                    history.push('/mainView', { activeUser: activeUser, allContacts: response.data.contacts });
                });
            }
        });
    }




    return (
        <div className="page" id="delete_update_screen">
        <form id='form_dialog' className="form_dialog" onSubmit={handleSubmit}>
            <Dialog activeUser={activeUser} contactData={contactData} setContactData={setContactData} handleSubmit={handleSubmit} />
            <div id="bar" className="bar">
                <button type="submit" className="button" id="update_button" value="update" name="update_button">Bearbeiten</button>
                <button className="button" id="delete_button" value="delete" name="delete_button"
                    onClick={deleteContact}>Löschen</button>
            </div>
            </form>
        </div>
    );
}


export default EditView;