import connectdb from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config(
    {
        path:"./.env" // file name is give wrt to root folder ...NOT SURE .... NEed to confirm
    }
)
// also There in a new built in feature in node v20 of having dotenv package in itself. NO Need To Install DOTENV Externally if use node v20 or above xyz

connectdb()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("App is listeng at port NUmber:", process.env.PORT)
    })
})
.catch((error)=>{
    console.log("Express Error :",error)
    process.exit(1)
})
