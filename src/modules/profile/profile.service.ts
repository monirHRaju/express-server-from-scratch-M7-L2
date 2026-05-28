import { pool } from "../../db";

const getSingleProfileFromDB = async(id:string) => {
    
    const result = await pool.query(`
        SELECT * FROM profile WHERE id=$1
        `, [id])
    return result
    
}


export const profileService = {
    getSingleProfileFromDB,
    
}