import { Router } from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controllers/userControllers";

const routerUser = Router ();

routerUser.get('/user', getUser);
routerUser.put('/', updateUser);
routerUser.post('/', createUser);
routerUser.delete('/', deleteUser);

export {routerUser}