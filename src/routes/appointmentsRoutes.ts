import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, getAllArtist } from "../controllers/appointmentControllers";
import { admin } from "../middleware/admin";


const routerAppointments = Router();

routerAppointments.post('/createAppointment',auth, createAppointment)
routerAppointments.get('/getAllArtist',auth, admin, getAllArtist)
// routerAppointments.put('/update',auth, updateAppointment)
// routerAppointments.delete('/delete',auth, deleteAppointment)

export {routerAppointments}