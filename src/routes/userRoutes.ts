import { Router } from "express";
import { register } from "../controllers/userControllers";

const routerUsers = Router ();
routerUsers.post('/register', register)

export {routerUsers}