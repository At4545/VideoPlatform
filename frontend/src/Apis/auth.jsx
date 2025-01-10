import axios from "axios"
class Auth{

    async createAccount({userName,email,firstName,lastName,password,avatar,coverImage}){
        try {
            console.log(userName,email,firstName,lastName,password,avatar,coverImage)
             const user=await axios.post("/api/v1/users/register",{userName,email,fullName:firstName+" "+lastName,password,avatar:avatar[0],coverImage:coverImage[0]},{
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
                return user
             
           } catch (error) {
               console.log("auth-->register-->error--->",error)
               return error
           }
    }
    async login({userName,email,password}){
        try {
         return await axios.post("/api/v1/users/login",{userName,email,password}) 
        } catch (error) {
            console.log("auth-->Login-->error--->",error)
            return error
        }
    }
    async logout(){
        try {
          await axios.post("/api/v1/users/logout") 
          return true
            
        } catch (error) {
            console.log("auth-->Login-->error--->",error)
            return error
        }
    }
    async getCurrentUser(){
        try {

         return await axios.get("/api/v1/users/current-user") 

        } catch (error) {
            console.log("auth-->getcurretnuser-->error--->",error)
            return error
        }
    }
    async checkid({id}){
        try {
            console.log("id-->",id)
            const check= await axios.get(`/api/v1/users/check/${id}`)
            if(check){
                return Boolean(check.data.data)

            }
            
        
            

        } catch (error) {
            console.log("auth-->checkid-->error--->",error)
        }
    }

}

const AuthService= new Auth()

export default  AuthService
