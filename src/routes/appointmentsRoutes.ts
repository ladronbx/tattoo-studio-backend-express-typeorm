import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment } from "../controllers/appointmentControllers";


const routerAppointments = Router();

routerAppointments.post('/createAppointment',auth, createAppointment)
// routerAppointments.get('/getAlls',auth, getAppointmentsUser)
// routerAppointments.put('/update',auth, updateAppointment)
// routerAppointments.delete('/delete',auth, deleteAppointment)

export {routerAppointments}