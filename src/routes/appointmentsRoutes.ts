import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAllArtist, getAllMyAppointments, getallAppointmentsAllUsers, updateAppointment } from "../controllers/appointmentControllers";
import { admin } from "../middleware/admin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";


const routerAppointments = Router();


routerAppointments.get('/getAllArtist',auth, admin, getAllArtist)
routerAppointments.get('/getAllMyAppointments',auth, getAllMyAppointments)
routerAppointments.get('/getallAppointmentsAllUsers', auth, isSuperAdmin, getallAppointmentsAllUsers)
routerAppointments.post('/createAppointment',auth, createAppointment)
routerAppointments.delete('/deleteAppointment',auth, deleteAppointment)
routerAppointments.put('/updateAppointment',auth, updateAppointment)

export {routerAppointments}