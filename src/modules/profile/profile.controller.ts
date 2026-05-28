import type { Request, Response } from "express";
import { pool } from "../../db";
import { profileService } from "./profile.service";

const getProfile = async(req: Request, res: Response) => {
    const {id} = req.params

    try {
        const result = await profileService.getSingleProfileFromDB(id as string)


        if (result.rowCount === 0) {
            res.status(404).json({
            status: false,
            message: "profile not found!",
            data: {}
        })
        }

        res.status(200).json({
            status: true,
            message: "Profile retrieved success!",
            data: result.rows[0]
        })
    } catch (error:any) {
        res.status(500).json({
            status: false,
            message: "Failed to find profile!",
            error: error.message
        })
    }
    
    
}


export const profileController = {
    getProfile,
}