import { Router } from "express";
import { register } from "../controllers/usersControllers";

const router = Router();

router.post('/register', register)

export {router}