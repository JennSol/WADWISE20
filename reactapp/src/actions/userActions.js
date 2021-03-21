export const userLogin = (userData) =>{
    return{
        type:'USER_LOGIN',
        userData
    }
}
export const userLogOut = (userData) =>{
    return{
        type:'USER_LOGOUT',
        userData
    }
}