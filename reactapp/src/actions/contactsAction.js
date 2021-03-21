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