import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Dialog from './Dialog';
import { useLocation } from "react-router-dom";



function AddNewContactView(props) {
console.log ('sieht man was ?');
    let history = useHistory();
    const location = useLocation();
    let activeUser = location.state.activeUser;
    const [contactData, setContactData] = useState({
        title: '',
        gender: '',
        firstname: '',
        lastname: '',
        street: '',
        house: '',
        postcode: '',
        city: '',
        country: '',
        email: '',
        other: '',
        private: true,
        owner: activeUser.name
    })
   function Selection(props) {
        if (props!= true) {
            console.log ('false')
            return null;
        }
        return (
            <select id="users" name="owner" value= {contactData.owner} onChange={handleChange}>
                <option value="Normalo">Normalo</option>
                <option value="Admina">Admina</option>
            </select>
        );
    } 
    
        

    const handleChange = (e) => {
        setContactData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


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
                        console.log(geoCoords, 'erstes');
                    };
                });
            }).then(() => {
                if (geoCoords.length > 0) {
                    payload = {
                        ...contactData,
                        geoCoord: geoCoords,
                    }
                    console.log(payload);
                    axios
                        .post("http://localhost:80/adviz/contacts",payload)
                        .then(res => {
                            if (res.status == 201) {
                                console.log('added');
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


    return (
        <div className="page" id="addNew_screen">
            <form id='form_dialog' className="form_dialog" onSubmit={handleSubmit}>
                <Dialog activeUser={activeUser} contactData={contactData} setContactData={setContactData} />
                <div id="bar" className="bar">
                <Selection admin={activeUser.admin} />
                    <button type='submit' className="button" >Hinzufügen</button>
                </div>
            </form>
        </div>
    );
}


export default AddNewContactView;