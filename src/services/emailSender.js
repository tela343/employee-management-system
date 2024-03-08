import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
/*
*Send email to client
*@mailData
*@mailType
*/
const mailSender = async(mail, type)=>{
 
 const transporter = nodemailer.createTransport({
  port: 465,
  host: `smtp.${process.env.MAIL_DOMAIN}`,
     auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_EMAIL_PWD,
       },
  secure: true
 })

 

 const mailData = {
  from:process.env.SENDER_EMAIL,
  to: mail.receiver_mail,
  subject:'',
  text:'',
  html:''
 };


 //format mail data based on mail type

 let verify_link = `${process.env.APP_BASE_URL}employee/verify/${mail.token}`
 let reset_link = `${process.env.APP_BASE_URL}employee/${mail.token}/resetPassword`
 
 if(type=='comfirm'){
  mailData['subject']='Comfirm you Registration';
  mailData['text']=`Hi! ${mail.receiver_name}`
  mailData['html']= `<b>Hi! ${mail.receiver_name}</b> <p>Cheers have a good one</p> <div> <a href=${verify_link}>Verify</a> </div>` 
 }else if(type=='reset'){
  mailData['subject']='Reset password';
  mailData['text']=`reset account password`
  mailData['html']= `<b>Hi! ${mail.receiver_name}</b> <p>Cheers have a good one</p> <div> <a href=${reset_link}>Reset</a> </div>`
 }else{
  mailData['subject']='Conglaturations';
  mailData['text']=`You have been added to awesomity compaby`
  mailData['html']= `<b>Hi! ${mail.receiver_name}</b> <p>Cheers have a good one</p> <div> <a href=${verify_link}>Verify</a> </div>`
 }

 //send email
 let response = await transporter.sendMail(mailData)

 if(response){
    return {status:true, message:response}
 }else{
    return {status:false, message:response}
 }
 
}
module.exports = {mailSender}