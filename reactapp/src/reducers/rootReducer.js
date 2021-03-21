
const initState = {
    data: {
        activeUser: { name: ' ', admin: false },
        allContacts: []
    }
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'USER_LOGIN': {
            console.log('redux ')
            return {
                ...state,
                activeUser: action.userData
            }
        }
        case 'USER_LOGOUT': {
            state = initState;
            return state;
        }

        case 'SAVE_ALL_CONTACTS': {
            return {
                ...state,
                allContacts: action.allContacts
            }
        }
        case 'ADD_CONTACT': {
            return {
                ...state,
                allContacts: [...state.allContacts, action.contact]
            }
        }
        case 'DELETE_CONTACT': {
            let newAllContacts = state.allContacts.filter(contact => {
                return action.id !== contact.id
            });
            return {
                ...state,
                allContacts: newAllContacts
            }
        }
        case 'UPDATE_CONTACT': {
            let newAllContacts = state.allContacts.find(contact => {
                return action.id !== contact.id
            });
            return {
                ...state,
                allContacts:[ ...newAllContacts,action.contact]
            }
        }
        default: {
            return state;
        }
    }
}

export default rootReducer