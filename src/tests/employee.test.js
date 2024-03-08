import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import {Employee} from '../db/models'
import jwt from 'jsonwebtoken'
use(chaiHttp);
let token=''
let user_id= ''
let Userz


const url=`/api/${process.env.API_VERSION}`

describe('employee tests', ()=>{
 describe('Auth tests',async()=>{
  before('clear db',async()=>{
   await Employee.truncate({ cascade: true });
  })
  const user ={
    name:"josh",
    phone:"250788823232",
    national_id:"1200022342299223",
    email:"johharrisy@gmail.com",
    dob:"02-23-1990",
    password:"okayfine",
    depId:1
  }
  it('should register a user', async()=>{
   const res = await request(app)
   .post(`${url}/employee/signup`)
   .send(user)

   expect(res).to.have.status(200)

  })

  it('should not register a user', async()=>{
   const res = await request(app)
   .post(`${url}/employee/signup`)
   .send(user)
   expect(res).to.have.status(400)

  })

 
 })

 describe('Auth tests',async()=>{
  before('clear db',async()=>{
   await Employee.truncate({ cascade: true });
  })
  const user ={
    name:"josh",
    phone:"250788823232",
    national_id:"1200022342299223",
    email:"johharrisy@gmail.com",
    dob:"02-23-1990",
    depId:1
  }
  it('should not register a user cz password is missing', async()=>{
   const res = await request(app)
   .post(`${url}/employee/signup`)
   .send(user)

   expect(res).to.have.status(400)

  })

  it('should not register a user cz password is missing', async()=>{
   const res = await request(app)
   .post(`${url}/employee/signup`)
   .send(user)
   expect(res).to.have.status(400)

  })

 
 })

 describe('Create employee tests',()=>{
   
  before('clear db',async()=>{
    
   await Employee.truncate({ cascade: true });
  //  /employee/login
  const user ={
    name:"josh",
    phone:"250788823232",
    national_id:"1200022342299223",
    email:"johharrisy@gmail.com",
    dob:"02-23-1990",
    password:"okayfine",
    depId:1
    
  }
  await request(app)
   .post(`${url}/employee/signup`)
   .send(user)
  })
  const user ={
   name:"josh",
   phone:"250788823232",
   national_id:"1200022342299223",
   email:"johharris@gmail.com",
   dob:"02-23-1990",
   status:"Active",
   position:"DESIGNER",
   depId:1
 }

 const loginUser={
   email:"johharrisy@gmail.com",
   password:'okayfine'

 }
 
 
 it('should login a manager', async()=>{
  const res = await request(app)
  .post(`${url}/employee/login`)
  .send(loginUser)
  token=res.body.token

  expect(res).to.have.status(200)

 })

 it('should not login a manager', async()=>{
    Userz={
    email:"johharrisy@gmail.com",
    password:'okayfi'
   }
  const res = await request(app)
  .post(`${url}/employee/login`)
  .send(Userz)

  expect(res).to.have.status(403)

 })

  it('should create a employee', async()=>{
   const res = await request(app)
   .post(`${url}/employee/add`)
   .set('authorization',token)
   .send(user)
   user_id=res.body.employee.id
   expect(res).to.have.status(201)

  })

  it('should suspend a employee', async()=>{
    const res = await request(app)
    .post(`${url}/employee/suspend/${user_id}`)
    .set('authorization',token)
    .send(user)
    expect(res).to.have.status(200)
 
   })

   it('should activate a employee', async()=>{
    const res = await request(app)
    .post(`${url}/employee/activate/${user_id}`)
    .set('authorization',token)
    .send(user)
    expect(res).to.have.status(200)
 
   })
   it('should not activate a employee', async()=>{
    const res = await request(app)
    .post(`${url}/employee/activate/${user_id}`)
    .send(user)
    expect(res).to.have.status(401)
   })

   it('should send resept password to an employee', async()=>{
    const res = await request(app)
    .post(`${url}/employee/resetPassword`)
    .send(user)
    expect(res).to.have.status(200)
   })

   it('should search an employee', async()=>{
    const res = await request(app)
    .get(`${url}/employee/search/${user.email.substring(0.4)}`)
    .set('authorization',token)

    expect(res).to.have.status(200)
 
   })

   
 })

 describe('send comfirmation email to employee tests',()=>{
  let employee=''
  before('clear db',async()=>{
   await Employee.truncate({ cascade: true });

  })
  const user ={
   name:"josh",
   phone:"250788823232",
   national_id:"1200022342299223",
   email:"johharrisy@gmail.com",
   dob:"02-23-1990",
   password:"okayfine",
   depId:1
 }
 
  it('should signup and verify a employee', async()=>{
   const res = await request(app)
   .post(`${url}/employee/signup`)
   .send(user)
   employee = res.body.employee
   expect(res).to.have.status(200)
  })
  
  it('should verify account', async()=>{
   const token = jwt.sign(JSON.parse(JSON.stringify(employee)), process.env.JWT_KEY, {expiresIn:'1h'});
   const res = await request(app)
   .get(`${url}/employee/verify/${token}`)
   .send(user)
 
   expect(res).to.have.status(200)

  })
  it('should reset password', async()=>{
    const token = jwt.sign(JSON.parse(JSON.stringify(employee)), process.env.JWT_KEY, {expiresIn:'1h'});
    const resPwd={
      password:'okayfine'
    }
    const res = await request(app)
    .post(`${url}/employee/${token}/resetPassword/newPassword`)
    .send(resPwd)
    expect(res).to.have.status(200)
   })

   it('should not reset password', async()=>{
    const token = jwt.sign(JSON.parse(JSON.stringify(employee)), process.env.JWT_KEY, {expiresIn:'1h'});
    const resPwd={
      password:''
    }
    const res = await request(app)
    .post(`${url}/employee/${token}/resetPassword/newPassword`)
    .send(resPwd)
    expect(res).to.have.status(400)
   })
   it('should delete employee', async()=>{
    const res = await request(app)
    .get(`${url}/employee/delete/${user_id}`)
    expect(res).to.have.status(401)
   })
   

  

 })

 describe('verify account', async()=>{
  let employee=''
  beforeEach('clear db',async()=>{
   await Employee.truncate({ cascade: true });
   
   const user ={
    name:"josh",
    phone:"250788823232",
    national_id:"1200022342299223",
    email:"johharrisy@gmail.com",
    dob:"02-23-1990",
    status:"Active",
    position:"Manager",
    password:"okayfine",
    isVerified:true,
    
  }
  employee = await Employee.create(user)

  })

  it('should not  verify user', async()=>{
   
   const token = jwt.sign(JSON.parse(JSON.stringify(employee)), process.env.JWT_KEY, {expiresIn:'1h'});
   const user ={
    name:"josh",
    phone:"250788823232",
    national_id:"1200022342299223",
    email:"johharrisy@gmail.com",
    dob:"02-23-1990",
    status:"Active",
    position:"Manager",
    password:"okayfine",
    depId:1
  }
   const res = await request(app)
   .get(`${url}/employee/verify/${token}`).redirects(0)
   .send(user)

   expect(res).to.have.status(301)
  })

  it('should delete employee', async()=>{
    
    const res = await request(app)
    .get(`${url}/employee/delete/${employee.id}`)
    .set('authorization',token)
    expect(res).to.have.status(200)
   })
 })
})