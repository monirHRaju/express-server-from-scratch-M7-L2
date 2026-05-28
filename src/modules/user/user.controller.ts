import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // const { name, email, password, age, is_active } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body)
    // console.log(result)

    res.status(201).json({
      message: "created",
      rowCount: result.rowCount,
      insertedId: result.rows[0].id,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB()

    res.status(400).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed retrieving users",
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }
    res.status(400).json({
      success: true,
      message: "user retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed retrieving user",
      error: error,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  // console.log(id, name, password, age, is_active)
  try {
    const result = await pool.query(
      `
      UPDATE users 
      SET name=COALESCE($1, name), password=COALESCE($2, password), age=COALESCE($3, age), is_active=COALESCE($4, is_active)
      WHERE id=$5
      RETURNING *
      `,
      [name, password, age, is_active, id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(201).json({
      success: true,
      message: "user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(201).json({
      success: false,
      message: "failed user update",
      error: error,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = pool.query(
      `
      DELETE FROM users 
      WHERE id=$1
      `,
      [id],
    );

    if ((await result).rowCount === 0) {
      res.status(500).json({
        success: false,
        message: "failed, NO USER FOUND",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "error user delete",
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
