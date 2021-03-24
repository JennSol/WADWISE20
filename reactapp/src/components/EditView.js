import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Dialog from './Dialog';
import { useLocation } from "react-router-dom";
import { getGeoCoordsForContact } from './GeoCords';


function EditView(props) {
    const location = useLocation();
    let contact = location.state;
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
    const dispatch = useDispatch();

    let history = useHistory();

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
                            console.log(geoCoords,'erstes');
                        };
                    });
                }).then(()=>{
                    if (geoCoords.length >0){
                    payload = {
                        ...contactData,
                        geoCoord: geoCoords,
                        owner: contact.owner
                    }  
                    console.log(payload);
                axios
                    .put("http://localhost:80/adviz/contacts/"+ contact._id, payload)
                    .then(res => {
                        console.log('update')
                        if (res.status == 204) {
                            console.log('geklappt')
                            // dispatch(updateContact());
                        }
                    });}
                    else{
                        alert('Keine vernünftige Adresse angegeben')
                    }
                });

           
    }


    const deleteContact = (e) => {
        e.preventDefault();
    }




    return (
        <div className="page" id="edit_view">
            <Dialog contactData={contactData} setContactData={setContactData} handleSubmit={handleSubmit} />
            <div id="bar" className="bar">
                <button type="submit" className="button" id="update_button" value="update" name="update_button" onClick={handleSubmit}>Bearbeiten</button>
                <button className="button" id="delete_button" value="delete" name="delete_button"
                    onClick={deleteContact}>Löschen</button>
            </div>
        </div>
    );
}


export default EditView;