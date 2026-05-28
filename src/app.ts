import express, { response, type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRouter } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";


const app: Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}))



initDB()

app.get('/', (req: Request, res: Response) => {
  
//   res.send('Express Server')
  res.status(200).json({
    "message" : "Server working"
  })
})

app.use('/api/users', userRouter)
app.use('/api/profiles', profileRoute)



export default app