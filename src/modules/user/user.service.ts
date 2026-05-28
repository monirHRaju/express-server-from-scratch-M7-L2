import bcrypt from 'bcrypt';
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const getAllUserFromDB = async() => {
    
    const result = await pool.query(`
        SELECT * FROM users
      `);

      return result
}

const createUserIntoDB = async(payload:IUser) => {
    const {name, email, password, age, is_active} = payload

    const hashedPassword = await bcrypt.hash(password, 10);
   
    const result = await pool.query(
      `
        INSERT INTO users(name, email, password, age, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
      [name, email, hashedPassword, age, is_active],
    );
    
    delete result.rows[0].password

    return result
}

const getSingleUserFromDB = async(id:string) => {
  
  const result = await pool.query(
      `
        SELECT * FROM users WHERE id=$1
      `,
      [id],
    );
    return result
}

const updateUserToDB = async(payload: IUser, id: string) => {
  const {name, password, age, is_active} = payload
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
      `
      UPDATE users 
      SET name=COALESCE($1, name), password=COALESCE($2, password), age=COALESCE($3, age), is_active=COALESCE($4, is_active)
      WHERE id=$5
      RETURNING *
      `,
      [name, hashedPassword, age, is_active, id],
    );
    return result;
  }

const deleteUserFromDB = async(id:string) => {
  const result = await pool.query(
      `
      DELETE FROM users 
      WHERE id=$1
      `,
      [id],
    );

    return result
}


export const userService = {
    getAllUserFromDB,
    createUserIntoDB,
    getSingleUserFromDB,
    updateUserToDB,
    deleteUserFromDB
}