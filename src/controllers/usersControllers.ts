import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/Appointment";


const register = async (req: Request, res: Response) => {

    try {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;
        const body = req.body;

        if ( (typeof body.full_name !== "string") || (body.full_name.length === 0) || (body.full_name.length > 30)) {
            return res.json({
                success: true,
                message: 'Invalid or too long name'
            });
        }

        if ((typeof body.email !== "string") || (body.email.length > 100) || (!emailRegex.test(body.email)) ){
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }

        if (typeof body.password !== "string") {
            return res.json({
                success: true,
                message: 'Invalid password data type. Please provide a valid string for the password.'
            });
        }

        if (body.password.length > 100) {
            return res.json({
                success: true,
                message: 'Password is too long. Please use a password with a maximum of 100 characters.'
            });
        }

        if (!passwordRegex.test(body.password)) {
            return res.json({
                success: true,
                message: 'Invalid password format. Please use a password between 4 to 12 characters, including at least one uppercase letter, one digit, and one special character (!@#$%^&*).'
            });
        }

        if ((typeof body.phone_number !== "number")|| (body.phone_number.length > 20)) {
            return res.json({
                success: true,
                message: 'Invalid phone number data type or too long. Please provide a valid numeric phone number.'
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 8)

        const newUser = await User.create({
            full_name: body.full_name,
            email: body.email,
            password: hashedPassword,
            phone_number: body.phone_number
        }).save()

        return res.json({
            success: true,
            message: "User registered successfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User registration failed. Please try again.",
            error
        })
    }
}

const login = async (req: Request, res: Response) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const userFoundByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if ((userFoundByEmail?.is_active === false) || (!userFoundByEmail) ){
            return res.json({
                success: true,
                message: "Password or email incorrect. Please try again"
            })
        }

        if (!bcrypt.compareSync(password, userFoundByEmail.password)) {
            return res.json({
                success: true,
                message: "Password or email incorrect. Please try again"
            })
        }

        const roleName = userFoundByEmail.role.role_name;
        
        const token = jwt.sign({
            id: userFoundByEmail.id,
            email: userFoundByEmail.email,
            role: roleName
        }, process.env.JWT_SECRET, {
            expiresIn: "150h"
        })

        return res.json({
            success: true,
            message: "Login successful. Token generated.",
            token: token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during login.",
            error
        })
    }
}

const profile = async (req: Request, res: Response) => {
    try {
        const email = req.token.email;

        // Busco un usuario donde el campo 'email' coincida con el correo electrónico extraído del token. 
        const userProfile = await User.findOne({
            where: { email }
        });

        if (!userProfile) {
            return res.status(404).json({
                success: true,
                message: "User profile not found",
            });
        }

        return res.json({
            success: true,
            message: "User profile retrieved",
            data: {
                full_name: userProfile?.full_name,
                email: userProfile?.email,
                phone_number: userProfile?.phone_number,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve user profile",
            error
        });
    }
};

const getAllUsersBySuper = async (req: Request, res: Response) => {
    try {
        const pageSize = parseInt(req.query.pageSize as string) || 5;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * pageSize;

        const totalUsers = await User.count(); // Obtiene el total de usuarios

        const users = await User.find({
            select: ["id", "email", "full_name", "phone_number", "is_active", "role_id", "created_at", "updated_at"],
            skip: skip,
            take: pageSize,
        });

        if (users.length === 0) {
            return res.json({
                success: true,
                message: "No users found for this page."
            });
        }

        return res.json({
            success: true,
            message: "Users retrieved successfully.",
            currentPage: page,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to display the users. An error occurred.",
            error
        });
    }
};


const updateUser = async (req: Request, res: Response) => {

    try {
        const bodyUser = req.body
        const id = req.token.id

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (bodyUser.full_name) !== "string") {
            return res.json({
                success: true,
                message: 'Name is incorrect; only strings are allowed. Please try again.'
            });
        }

        if (bodyUser.full_name.length > 30) {
            return res.json({
                success: true,
                message: 'Name is too long. Please insert a shorter name, max. 30 characters.'
            });
        }

        if (typeof (bodyUser.password) !== "string") {
            return res.json({
                success: true,
                message: 'Password is incorrect; only strings are allowed. Please try again'
            });
        }

        if (bodyUser.password.length > 100) {
            return res.json({
                success: true,
                message: 'Password is too long. Please insert a shorter password (maximum 100 characters).'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                message: 'Password is incorrect. Please try again'
            });
        }

        if (typeof (bodyUser.phone_number) !== "number") {
            return res.json({
                success: true,
                message: 'Phone number is incorrect; only numbers are allowed. Please try again'
            });
        }

        if (bodyUser.phone_number.length > 20) {
            return res.json({
                success: true,
                message: 'Phone number is too long. Please insert a shorter number (maximum 20 characters).'
            });
        }

        const hashedPasswordword = await bcrypt.hash(bodyUser.password, 10)

        const updateOneUser = await User.update({
            id
        }, {
            full_name: bodyUser.full_name,
            password: hashedPasswordword,
            phone_number: bodyUser.phone_number
        })

        return res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                full_name: bodyUser.full_name,
                phone_number: bodyUser.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "User can't be registered, please try again.",
            error
        })
    }
}

//obtener artistas registrados
const getArtists = async (req: Request, res: Response) => {
    try {
        const artists = await User.find({
            where: {
                role_id: 2
            },
            select: ["email", "full_name", "phone_number"]
        });

        if (artists.length === 0) {
            return res.json({
                success: true,
                message: "There are no registered artist."
            });
        }

        return res.json({
            success: true,
            message: "Here you can see all the users.",
            data: artists
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to display the users. An error occurred.",
            error
        });
    }
};


const createArtist = async (req: Request, res: Response) => {
    try {

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;
        const body = req.body;

        if (typeof (body.full_name) !== "string") {
            return res.json({
                success: true,
                message: 'name incorrect, you can put only strings, try again'
            });
        }

        if (body.full_name.length < 1) {
            return res.json({
                success: true,
                message: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }
        if (body.full_name.length > 50) {
            return res.json({
                success: true,
                message: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }

        if (typeof (body.email) !== "string") {
            return res.json({
                success: true,
                message: 'email incorrect, you can put only strings, try again'
            });
        }

        if (body.email.length > 100) {
            return res.json({
                success: true,
                message: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(req.body.email)) {
            return res.json({
                success: true,
                message: 'email incorrect, try again'
            });
        }

        if (typeof (body.password) !== "string") {
            return res.json({
                success: true,
                message: 'password incorrect, you can put only strings, try again'
            });
        }

        if (body.password.length > 100) {
            return res.json({
                success: true,
                message: 'password too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                message: 'password incorrect, try again'
            });
        }

        if (typeof (body.phone_number) !== "number") {
            return res.json({
                success: true,
                message: 'phone_number incorrect, you can put only numbers, try again'
            });
        }

        if (body.phone_number.length > 20) {
            return res.json({
                success: true,
                message: 'phone_number too long, try to insert a shorter name, max 20 characters'
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)

        const newUser = await User.create({
            full_name: body.full_name,
            email: body.email,
            password: hashedPassword,
            phone_number: body.phone_number,
            role_id: body.role_id

        }).save()

        return res.json({
            success: true,
            message: "User registered succesfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user can't be registered, try again",
            error
        })
    }

}

const deleteUsersBySuper = async (req: Request, res: Response) => {

    try {
        const deleteById = req.body.id

        if (!deleteById) {
            return res.json({
                success: true,
                message: "You must insert an id",
            })
        }

        if (typeof (deleteById) !== "number") {
            return res.json({
                success: true,
                mensaje: "Id incorrect, you can put only numbers, try again"
            });
        }

        const deleteAppointmentById = await User.delete({
            id: deleteById
        })

        return res.json({
            success: true,
            message: "The user was successfully deleted.",
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to delete the user, please try again.",
            error
        })
    }

}

export { register, login, profile, getAllUsersBySuper, updateUser, getArtists, createArtist, deleteUsersBySuper };
