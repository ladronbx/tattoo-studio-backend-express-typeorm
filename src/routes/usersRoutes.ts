import { Router } from "express";
import { register, login, profile } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";

const routerUsers = Router();

routerUsers.post('/register', register)
routerUsers.post('/login', login)
routerUsers.get('/profile', auth, profile)
// routerUsers.put('/update', auth, updateUser)
// routerUsers.get('/all',auth ,isSuperAdmin ,getAllUsers)

export {routerUsers}