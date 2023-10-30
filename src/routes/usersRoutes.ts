import { Router } from "express";
import { register, login, profile, getAllUsers, updateUser, getArtists, createArtist, deleteUsersByAdmin } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isAdmin } from "../middleware/isAdmin";

const routerUsers = Router();

routerUsers.get('/profile', auth, profile)
routerUsers.get('/artists', auth, getArtists)  //obtener artistas registrados
routerUsers.get('/all/users',auth ,isSuperAdmin ,getAllUsers) // Obtengo todos los usuarios pero con los campos seleccionados. EXCLUYENDO PASSWORD
routerUsers.post('/register', register)
routerUsers.post('/login', login)
routerUsers.post('/createArtist', createArtist)
routerUsers.put('/update/user', auth, updateUser)
routerUsers.delete('/delete/user', auth, isAdmin, deleteUsersByAdmin)


export {routerUsers}