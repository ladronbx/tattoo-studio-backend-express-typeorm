import { Router } from "express";
import { register, login, profile, getAllUsers, updateUser, getArtists, createArtist } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const routerUsers = Router();

routerUsers.get('/profile', auth, profile)
routerUsers.get('/artists', auth, getArtists)  //obtener artistas registrados
routerUsers.get('/all/users',auth ,isSuperAdmin ,getAllUsers) // Obtengo todos los usuarios pero con los campos seleccionados. EXCLUYENDO PASSWORD
routerUsers.post('/register', register)
routerUsers.post('/login', login)
routerUsers.post('/createArtist', createArtist)
routerUsers.put('/update/user', auth, updateUser)

export {routerUsers}