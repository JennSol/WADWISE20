import React from 'react';
import { useHistory } from "react-router-dom";


function ContactList(props) {
  const activeUser = props.activeUser;
  const contacts = props.contacts;
  const history = useHistory();

  const onClickEditView = (e) => {
    e.preventDefault();
    let editContact = contacts.find((contact) => contact._id === e.target.attributes.name.value);
    if (activeUser.admina || editContact.owner === activeUser.name) {
      history.push('/editView', { editContact: editContact, activeUser: activeUser });
    }
    else {
      { alert('Keine Berechtigung') }
    }
  }

  //https://reactjs.org/docs/lists-and-keys.html
  let listItems = contacts.map((contact) =>
    <li name={contact._id} key={contact._id} onClick={onClickEditView}>
      {contact.firstname + ' ' + contact.lastname}
    </li>
  );


  return (
    <ul>{listItems}</ul>
  );
}


export default ContactList;