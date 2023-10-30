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

        if (typeof body.full_name !== "string") {
            return res.json({
                success: true,
                message: 'Invalid name data type. Please provide a valid string for the name.'
            });
        }

        if (body.full_name.length === 0) {
            return res.json({
                success: true,
                message: 'Name cannot be empty. Please provide a name.'
            });
        }

        if (body.full_name.length > 30) {
            return res.json({
                success: true,
                message: 'Name is too long. Please use a name with a maximum of 30 characters.'
            });
        }

        if (typeof body.email !== "string") {
            return res.json({
                success: true,
                message: 'Invalid email data type. Please provide a valid string for the email.'
            });
        }

        if (body.email.length > 100) {
            return res.json({
                success: true,
                message: 'Email is too long. Please use an email with a maximum of 100 characters.'
            });
        }

        if (!emailRegex.test(body.email)) {
            return res.json({
                success: true,
                message: 'Invalid email format. Please provide a valid email address.'
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

        if (typeof body.phone_number !== "number") {
            return res.json({
                success: true,
                message: 'Invalid phone number data type. Please provide a valid numeric phone number.'
            });
        }

        if (body.phone_number.length > 20) {
            return res.json({
                success: true,
                message: 'Phone number is too long. Please use a phone number with a maximum of 20 digits.'
            });
        }

        const encrytedPass = await bcrypt.hash(body.password, 10)

        const newUser = await User.create({
            full_name: body.full_name,
            email: body.email,
            password: encrytedPass,
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
        // Encuentra al usuario mediante el correo electrónico y carga la relación del usuario con su rol asociado.
        const userFoundByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (userFoundByEmail?.is_active === false) {
            return res.json({
                success: true,
                message: "This user account is currently inactive"
            })
        }

        //evalua si es falsa, nula, indefinida o un valor que se evalúa como "falso".
        if (!userFoundByEmail) {
            return res.json({
                success: true,
                message: "Please log in using your email."
            })
        }

        if (!bcrypt.compareSync(password, userFoundByEmail.password)) {
            return res.json({
                success: true,
                message: "Invalid password. Please try again."
            })
        }

        //para extraer la propiedad role_name de la clase Role
        const roleName = userFoundByEmail.role.role_name;

        //primer argumento : info a codificar ---- segundo : firma ----- tercero : time expires
        //El primer argumento no funcionaba porque estaba en una constante. Así es la manera correcta de generar el token
        const token = jwt.sign({
            id: userFoundByEmail.id,
            email: userFoundByEmail.email,
            role: roleName
        }, "secret", {
            expiresIn: "4h"
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
        // Extraigo el email del token del usuario logeado.
        const email = req.token.email;

        console.log("Email:", email);

        // Busco un usuario donde el campo 'email' coincida con el correo electrónico extraído del token. 
        const userProfile = await User.findOne({
            where: { email }
        });

        console.log("UserProfile:", userProfile);

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

const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Obtengo todos los usuarios pero con los campos seleccionados. EXCLUYENDO PASSWORD
        const users = await User.find({
            select: ["id", "email", "full_name", "phone_number", "is_active", "role_id", "created_at", "updated_at"]
        });

        if (users.length === 0) {
            return res.json({
                success: true,
                message: "There are no registered users."
            });
        }

        return res.json({
            success: true,
            message: "Here you can see all the users.",
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

        const encrytedPassword = await bcrypt.hash(bodyUser.password, 10)

        const updateOneUser = await User.update({
            id
        }, {
            full_name: bodyUser.full_name,
            password: encrytedPassword,
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

        const encrytedPass = await bcrypt.hash(body.password, 10)

        const newUser = await User.create({
            full_name: body.full_name,
            email: body.email,
            password: encrytedPass,
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


const deleteUsersByAdmin = async (req: Request, res: Response) => {
    
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



export { register, login, profile, getAllUsers, updateUser, getArtists, createArtist, deleteUsersByAdmin };
