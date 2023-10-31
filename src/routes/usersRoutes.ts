import { Router } from "express";
import { register, login, profile, updateUser, getArtists, createArtist, getAllUsers, deleteUsersByAdmin } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isAdmin } from "../middleware/isAdmin";

const userRouter = Router();

userRouter.post('/register', register)//
userRouter.post('/login', login) //
userRouter.get('/profile', auth, profile)//
userRouter.put('/profile/update', auth, updateUser)// X
userRouter.get('super/get/all/users',auth ,isSuperAdmin ,getAllUsers)
userRouter.delete('super/delete/user', auth, isSuperAdmin, deleteUsersByAdmin)

userRouter.get('/artists', auth, getArtists)  //obtiene artistas registrados

userRouter.post('/createArtist', createArtist)




export {userRouter}