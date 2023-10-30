import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAllArtist, getAllMyAppointments } from "../controllers/appointmentControllers";
import { admin } from "../middleware/admin";


const routerAppointments = Router();


routerAppointments.get('/getAllArtist',auth, admin, getAllArtist)
routerAppointments.get('/getAllMyAppointments',auth, getAllMyAppointments)
routerAppointments.post('/createAppointment',auth, createAppointment)
routerAppointments.delete('/deleteAppointment',auth, deleteAppointment)

// routerAppointments.put('/update',auth, updateAppointment)

export {routerAppointments}