import mongoose from "mongoose";
import { db_name } from "../constant.js";

const connectdb = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`);
        // can console.log connection INstace to know the details of the database
        // For example : i want to know if i have connect this backend to right db : so connectionInstace hold these kind of informations:
        // console.log("DB Connects--> Connection_Instances:", connectionInstance)
        
    } catch (error) {
        console.log("Mongo Connection Failed:",error)
        throw error
    }
}

export default  connectdb
