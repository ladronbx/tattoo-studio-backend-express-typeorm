import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controllers/appointmentsControllers";

const router = Router();

router.get('/',auth, getAppointment)
router.post('/create',auth, createAppointment)
router.put('/update',auth, updateAppointment)
router.delete('/delete',auth, deleteAppointment)

export {router}