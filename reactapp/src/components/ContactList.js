import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

 
function ContactList(props) {
  const activeUser=  useSelector(state => state.activeUser);
  const contacts = props;
  const history = useHistory();

    console.log('contactlist:',contacts);
 
    const onClickEditView = (e) => {
      e.preventDefault();
      console.log('name...',e.target.attributes.name.value);
      let editContact = contacts.contacts.find((contact)=> contact._id === e.target.attributes.name.value);
      console.log('lsite .... ', editContact);
     if (activeUser.admin || editContact.owner === activeUser.name){
        history.push('/editView',editContact);
     }
      else{
        {alert('Keine Berechtigung')}
      }
  }



//https://reactjs.org/docs/lists-and-keys.html
      let listItems = contacts.contacts.map((contact) =>
      <li name={contact._id} key={contact._id} onClick={onClickEditView}>
        {contact.firstname +' ' +contact.lastname}
      </li>
    );    
    
  
    return (
      <ul>{listItems}</ul>
    );
  }
  

export default ContactList;