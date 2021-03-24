export const userLogin = (userName, admin) =>{
    let data = {
        name: userName,
        admin: admin

     }
    return{
        type:'USER_LOGIN',
        data
    }
}
export const userLogOut = () =>{
    return{
        type:'USER_LOGOUT',
    }
}