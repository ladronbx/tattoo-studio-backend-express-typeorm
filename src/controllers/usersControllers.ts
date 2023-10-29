import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

        if (body.full_name.length > 50) {
            return res.json({
                success: true,
                message: 'Name is too long. Please use a name with a maximum of 50 characters.'
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

        //Objeto que almacena la info del user que se utilizará para generar el token
        const userDataForToken = {id: userFoundByEmail.id,email: userFoundByEmail.email,role: roleName}


        //primer argumento : info a codificar ---- segundo : firma ----- tercero : time expires
        const token = jwt.sign({
            userDataForToken
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

export { register, login } 