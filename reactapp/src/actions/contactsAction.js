export const addContact = (contactData) =>{
  
    return{
        type:'ADD_CONTACT',
        contactData
    }
}

export const deleteContact = (contactID) =>{
    return{
        type:'DELETE_CONTACT',
        contactID
    }
}
export const saveAllContacts = (allContacts) =>{
    console.log('action...', allContacts);
   let  data= allContacts;
    return{
        type:'SAVE_ALL_CONTACTS',
        data
    }
}