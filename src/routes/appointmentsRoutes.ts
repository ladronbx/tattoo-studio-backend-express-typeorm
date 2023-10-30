import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, getAllArtist } from "../controllers/appointmentControllers";
import { admin } from "../middleware/admin";


const routerAppointments = Router();

routerAppointments.post('/createAppointment',auth, createAppointment)
routerAppointments.get('/getAllArtist',auth, admin, getAllArtist)

// routerAppointments.delete('/deleteAppointment',auth, deleteAppointment)
// routerAppointments.put('/update',auth, updateAppointment)
export {routerAppointments}