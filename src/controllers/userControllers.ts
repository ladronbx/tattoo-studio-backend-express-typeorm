import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const register = async (req: Request, res: Response) => {
    try {
        const registerBody = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{4,12}$/;

        if (!passwordRegex.test(registerBody.password)) {
            return res.json({ mensaje: 'Invalid password format' });
        }

        if (!emailRegex.test(registerBody.email)) {
            return res.json({ mensaje: 'Invalid email format' });
        }

        const encrytedPassword = await bcrypt.hash(registerBody.password, 10);

        const newUser = await User.create({
            full_name: registerBody.full_name,
            email: registerBody.email,
            password: encrytedPassword,
            phone_number: registerBody.phone_number
        }).save();

        return res.json({
            success: true,
            message: "User successfully registered",
            data: {
                full_name: registerBody.full_name,
                email: registerBody.email,
                phone_number: registerBody.phone_number
            }
        });
    } catch (error) {
        console.error("Error in registration:", error);
        return res.json({
            success: false,
            message: "Registration failed. Please try again later."
        });
    }
};


const getUser = (req: Request, res: Response) => {
    return res.send('GET USER')
}

const updateUser = (req: Request, res: Response) => {
    return res.send('UPDATE USER')
}

const createUser = (req: Request, res: Response) => {
    return res.send('CREATE USER')
}

const deleteUser = (req: Request, res: Response) => {
    return res.send('DELETE USER')
}

export {getUser, updateUser, createUser, deleteUser, register}