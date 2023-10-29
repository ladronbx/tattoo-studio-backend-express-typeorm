import { Router } from "express";
import { register, login, profile, getAllUsers } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const routerUsers = Router();

routerUsers.post('/register', register)
routerUsers.post('/login', login)
routerUsers.get('/profile', auth, profile)
routerUsers.get('/allusers',auth ,isSuperAdmin ,getAllUsers)
// routerUsers.put('/update', auth, updateUser)


export {routerUsers}