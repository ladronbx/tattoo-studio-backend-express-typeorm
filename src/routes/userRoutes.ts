import { Router } from "express";
import { createUser, deleteUser, getUser, updateUser, register } from "../controllers/userControllers";

const routerUsers = Router ();

routerUsers.get('/user', getUser);
routerUsers.put('/', updateUser);
//agrego registro
routerUsers.post('/register', register);
routerUsers.delete('/', deleteUser);

export {routerUsers}