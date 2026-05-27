import express, { response, type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";


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

app.get('/api/users', async (req: Request, res: Response)=> {
  try {
    const result = await pool.query(`
        SELECT * FROM users
      `)
      res.status(400).json({
        success : true,
        message : "users retrieved successfully",
        data    : result.rows 
      })
  } catch (error: any) {
    res.status(500).json({
        success : false,
        message : "Failed retrieving users",
        error   : error  
      })
  }
})

app.get('/api/users/:id', async (req: Request, res: Response)=> {
  
  const {id} = req.params

  try {
    const result = await pool.query(`
        SELECT * FROM users WHERE id=$1
      `, [id])
      
      if(result.rowCount === 0){
        res.status(404).json({
        success : false,
        message : "user not found",
        data    : {} 
      })
      }
      res.status(400).json({
        success : true,
        message : "user retrieved successfully",
        data    : result.rows[0] 
      })
  } catch (error: any) {
    res.status(500).json({
        success : false,
        message : "Failed retrieving user",
        error   : error  
      })
  }
})

app.put('/api/users/:id', async(req:Request, res:Response) => {
  const {id} = req.params
  const {name, password, age, is_active} = req.body;

  // console.log(id, name, password, age, is_active)
  try {
    const result = await pool.query(`
      UPDATE users 
      SET name=COALESCE($1, name), password=COALESCE($2, password), age=COALESCE($3, age), is_active=COALESCE($4, is_active)
      WHERE id=$5
      RETURNING *
      `, [name, password, age, is_active, id])

      if(result.rowCount === 0){
        res.status(404).json({
        success: false,
        message: "User not found",
        data: {}
      })
      }

      res.status(201).json({
        success: true,
        message: "user updated successfully",
        data: result.rows[0]
      })
  } catch (error: any) {
    res.status(201).json({
        success: false,
        message: "failed user update",
        error: error
      })
  }
})

app.delete('/api/users/:id', async(req: Request, res=response) => {
  const {id} = req.params
  try {
    const result = pool.query(`
      DELETE FROM users 
      WHERE id=$1
      `, [id])

      if((await result).rowCount === 0){
        res.status(500).json({
        success: false,
        message: "failed, NO USER FOUND",
        data: {}
      })
      }
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: {}
      })
  } catch (error:any) {
    res.status(500).json({
        success: false,
        message: "error user delete",
        error: error
      })
  }
})

app.post('/api/users', async (req: Request, res: Response)=> {
  const {name, email, password, age, is_active} = req.body;

  try {
      const result = await pool.query(
        `
        INSERT INTO users(name, email, password, age)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [name, email, password, age]
      )
    // console.log(result)
    
    res.status(201).json({
      message: "created",
      rowCount: result.rowCount,
      insertedId: result.rows[0].id,
      data : result.rows[0]
    })
  } catch (error:any) {
    res.status(500).json({
      message: error.message,
      error : error
    })
  }
  
})


export default app