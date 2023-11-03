import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, myCalendarAsArtist, getAllMyAppointments, getallAppointmentsAllUsers, updateAppointment } from "../controllers/appointmentControllers";
import { isAdmin } from "../middleware/isAdmin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";


const appointmentsRouter = Router();

appointmentsRouter.post('/create',auth, createAppointment)// X
appointmentsRouter.put('/update',auth, updateAppointment) // X
appointmentsRouter.get('/get-all-my-appointments',auth, getAllMyAppointments)

appointmentsRouter.get('/my-calendar-as-artist',auth, isAdmin, myCalendarAsArtist) 
// appointmentsRouter.get('appointment/getallAppointmentsAllUsers', auth, isSuperAdmin, getallAppointmentsAllUsers)

// appointmentsRouter.delete('appointment/deleteAppointment',auth, deleteAppointment)

export {appointmentsRouter}