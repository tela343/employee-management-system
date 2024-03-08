import express from 'express'
import dotenv from 'dotenv'
import router from './routes'
import bodyParser from 'body-parser';
import cors from 'cors';
import utilsLogger from './utils/logger'


dotenv.config()

const app=express()
const PORT=process.env.SERVER_PORT || 4000
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use((req,res,next)=>{
 utilsLogger.Logger(req)
 next()
})
app.use(router);


app.listen(PORT, ()=>console.log(`app listening on port ${PORT}`))

module.exports = app
