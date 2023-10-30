import { Router } from "express";
import { register, login, profile, getAllUsers, updateUser, getArtists } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";


const routerUsers = Router();

routerUsers.post('/register', register)
routerUsers.post('/login', login)
routerUsers.get('/profile', auth, profile)
routerUsers.get('/all/users',auth ,isSuperAdmin ,getAllUsers)
routerUsers.put('/update/user', auth, updateUser)
routerUsers.get('/artists', auth, getArtists)


export {routerUsers}