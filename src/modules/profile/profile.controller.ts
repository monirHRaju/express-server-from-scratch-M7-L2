import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const getAllProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getAllProfileFromDB();

    if (result.rowCount === 0) {
      res.status(404).json({
        status: false,
        message: "profile not found!",
        data: {},
      });
    }

    res.status(200).json({
      status: true,
      message: "Profiles retrieved success!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: "Failed to find profile!",
      error: error.message,
    });
  }
};
// const getProfile = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const result = await profileService.getSingleProfileFromDB(id as string);

//     if (result.rowCount === 0) {
//       res.status(404).json({
//         status: false,
//         message: "profile not found!",
//         data: {},
//       });
//     }

//     res.status(200).json({
//       status: true,
//       message: "Profile retrieved success!",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       status: false,
//       message: "Failed to find profile!",
//       error: error.message,
//     });
//   }
// };

const createProfile = async (req: Request, res: Response) => {
  // const {user_id, bio, address, phone, gender} = req.body
  const result = await profileService.createProfileToDB(req.body);

  //   console.log(result)

  try {
    if (result.rowCount === 0) {
      res.status(500).json({
        status: false,
        message: "Failed! No User Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: "Failed! No User Found",
      error: error.message,
    });
  }
};

export const profileController = {
  getProfile,
  getAllProfile,
  createProfile,
};
