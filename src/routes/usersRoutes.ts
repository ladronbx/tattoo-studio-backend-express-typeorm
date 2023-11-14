import { Router } from "express";
import { register, login, profile, updateUser, getArtists, createArtist, getAllUsersBySuper, deleteUsersBySuper, getServices } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const userRouter = Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/profile', auth, profile)
userRouter.put('/profile/update', auth, updateUser)
userRouter.get('/super/get/all/users',auth ,isSuperAdmin ,getAllUsersBySuper)
userRouter.delete('/super/delete/user', auth, isSuperAdmin, deleteUsersBySuper)
userRouter.get('/artists', getArtists)
userRouter.post('/create/artist', createArtist)
userRouter.get('/services', getServices)

export {userRouter}