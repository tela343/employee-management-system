import logger from '../config/winston'
import morgan from  'morgan'
import jwt, { decode } from 'jsonwebtoken'
require('dotenv').config();

const Morgan =()=>{
 morgan("combined",{ stream: logger.stream.write });
} 

const Logger = (req)=>{
 const loggedInUser = req.headers.authorization;
 const today = new Date()
 const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
 
 if(loggedInUser){
   try{
    const decoded = jwt.verify(loggedInUser, process.env.JWT_KEY);
   logger.info(`Method: [ ${req.method} ]  - Route: [ ${req.originalUrl} ]  - done by: [ ${decoded.name} ] - with email: [ ${decoded.email} ] - @ [ ${time} ] `);
   }catch(err){
    return err.name
   }
 }else{
  const reqData = req.body;
  logger.info(`Method: [ ${req.method} ]  - Route: [ ${req.originalUrl}] - done by: [ ${reqData.email} ] - with email: [ ${reqData.email} ] - @ [ ${time} ] `);
 }
 
 
}



module.exports={Logger, Morgan}