import { Router } from "express";
import { login, register } from "../controllers/userControllers";
import { auth } from "../middleware/auth";

const routerUsers = Router ();
routerUsers.post('/register', register)
routerUsers.post('/login', auth, login)

export {routerUsers}