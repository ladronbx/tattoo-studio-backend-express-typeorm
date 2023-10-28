import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { Role } from "../models/Role";

// const register = async (req: Request, res: Response) => {

//     try {
//         const registerBody = req.body;
//         const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//         const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;


//         if (registerBody.full_name.length > 50) {
//             return res.json({
//                 success: true,
//                 mensaje: 'The name provided is too long. Please use a maximum of 50 characters.'
//             });
//         }

//         if (typeof (registerBody.full_name) !== "string") {
//             return res.json({
//                 success: true,
//                 mensaje: 'Name incorrect, you can put only strings, try again'
//             });
//         }

//         if (typeof (registerBody.email) !== "string") {
//             return res.json({
//                 success: true,
//                 mensaje: 'Invalid email format. Please use only strings and try again.'
//             });
//         }

//         if (registerBody.email.length > 100) {
//             return res.json({
//                 success: true,
//                 mensaje: 'The name provided is too long. Please use a maximum of 100 characters.'
//             });
//         }

//         if (!emailRegex.test(req.body.email)) {
//             return res.json({
//                 success: true,
//                 mensaje: 'Invalid email format. Please try again.'
//             });
//         }

//         if (typeof (registerBody.password) !== "string") {
//             return res.json({
//                 success: true,
//                 mensaje: 'Invalid password format. Please use only text characters and try again.'
//             });
//         }

//         if (registerBody.password.length > 100) {
//             return res.json({
//                 success: true,
//                 mensaje: 'Password length exceeds limit. Please use a maximum of 100 characters.'
//             });
//         }

//         if (!passwordRegex.test(req.body.password)) {
//             return res.json({
//                 success: true,
//                 mensaje: 'The password does not meet the requirements. Please try again.'
//             });
//         }

//         if (typeof (registerBody.phone_number) !== "number") {
//             return res.json({
//                 success: true,
//                 mensaje: 'Phone number format is incorrect. Please use only numbers and try again'
//             });
//         }

//         if (registerBody.phone_number.length > 20) {
//             return res.json({
//                 success: true,
//                 mensaje: 'The phone number provided is too long. Please use a maximum of 20 characters.'
//             });
//         }

//         const encrytedPassword = await bcrypt.hash(registerBody.password, 10)

//         const newUser = await User.create({
//             full_name: registerBody.full_name,
//             email: registerBody.email,
//             password: encrytedPassword,
//             phone_number: registerBody.phone_number
//         }).save()

//         const newRole_User = await Role.create({
//             user_id: newUser.id,
//         }).save()

//         return res.json({
//             success: true,
//             message: "User registered succesfully",
//             data: {
//                 full_name: newUser.full_name,
//                 email: newUser.email,
//                 phone_number: newUser.phone_number
//             }
//         })

//     } catch (error) {
//         return res.json({
//             success: false,
//             message: "User can't be registered, try again",
//             error
//         })
//     }
// }


// const login = async (req: Request, res: Response) => {

//     try {
//         const email = req.body.email;
//         const password = req.body.password;

//         const loginByEmail = await User.findOne({
//             where: { email },
//             relations: ["userRoles"]
//         });

//         if (!loginByEmail) {
//             return res.json({
//                 success: true,
//                 message: "user or password incorrect"
//             })
//         }

//         if (!bcrypt.compareSync(password, loginByEmail.password)) {
//             return res.json({
//                 success: true,
//                 message: "user or password incorrect"
//             })
//         }

//         const roles = loginByEmail.roles.map(role => role.role);

//         const token = jwt.sign({
//             id: loginByEmail.id,
//             email: loginByEmail.email,
//             role: roles
//         }, "secreto", {
//             expiresIn: "5h"
//         })

//         return res.json({
//             success: true,
//             message: "user logged succesfully",
//             token: token
//         })

//     } catch (error) {
//         return res.json({
//             success: false,
//             message: "user can't by logged",
//             error
//         })
//     }
// }

// export { register, login } 