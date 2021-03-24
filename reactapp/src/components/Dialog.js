import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";


function Dialog(props) {

    console.log(props)
    const handleChange = (e) => {
      
        console.log(props);

        props.setContactData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div className="page" id="delete_update_screen">
            <form id='form_dialog' className="form_dialog" onSubmit={props.handleSubmit}>
                <label > Titel
                <input type="text" id="title" name="title" value={props.contactData.title} onChange={handleChange} /> </label>
                <label> Geschlecht
                <select id="genders" name="genders" value={props.contactData.gender} onChange={handleChange}>
                    <option value="none">keine Angabe</option>
                    <option value="diverse">divers</option>
                    <option value="male">männlich</option>
                    <option value="female">weiblich</option>
                </select></label>
                <label >Vorname*
                <input type="text" id="prename" name="firstname" value={props.contactData.firstname} onChange={handleChange} required /></label>
                <label >Nachname*
                <input type="text" id="lastname" name="lastname" value={props.contactData.lastname} onChange={handleChange} required /></label>
                <label >Straße*
                <input type="text" id="street" name="street" value={props.contactData.street} onChange={handleChange} required /></label>
                <label >Hausnummer*
                <input type="text" id="house" name="house" value={props.contactData.house} onChange={handleChange} required /></label>
                <label >Postleitzahl*
                <input type="text" id="postcode" name="postcode" value={props.contactData.postcode} onChange={handleChange} required /></label>
                <label >Stadt*
                <input type="text" id="city" name="city" required value={props.contactData.city} onChange={handleChange} /></label>
                <label >Land*
                <input type="text" id="county" name="country" value={props.contactData.country} onChange={handleChange} required /></label>
                <label >Email
                <input type="text" id="email" name="email" value={props.contactData.email} onChange={handleChange} /></label>
                <label >Sonstiges
                <input type="text" id="other" name="other" value={props.contactData.other} onChange={handleChange} /></label>
                <div id="bar" className="bar">
                    <label> Privat
                    <input type="checkbox" id="privatebox" name="privateBox" checked  value={props.contactData.private} onChange={handleChange}/></label>
                </div>
            </form>
        </div>
    );
}


export default Dialog;