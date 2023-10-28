import { Router } from "express";
import { login, register } from "../controllers/userControllers";

const routerUsers = Router ();
routerUsers.post('/register', register)
routerUsers.post('/login', login)

export {routerUsers}