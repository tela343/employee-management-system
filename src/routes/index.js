import {Router} from 'express'
import routes from './routes'

const router = Router()
const url =`/api/${process.env.API_VERSION}` 
router.get(`/`,(req,res)=>{res.send("welcome to awesomity employee management system")})
router.use(`${url}/`,routes)
export default router
