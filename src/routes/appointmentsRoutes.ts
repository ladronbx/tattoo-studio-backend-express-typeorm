import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, myCalendarAsArtist, getAllMyAppointments, getAllAppointmentsCalendar, updateAppointment, getAllAppointmentsCalendarDetails } from "../controllers/appointmentControllers";
import { isAdmin } from "../middleware/isAdmin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const appointmentsRouter = Router();

appointmentsRouter.post('/create',auth, createAppointment)
appointmentsRouter.get('/my-calendar-as-artist',auth, isAdmin, myCalendarAsArtist) 
appointmentsRouter.delete('/delete-my-appointment',auth, deleteAppointment)
appointmentsRouter.get('/all-appointments-calendar', auth, isSuperAdmin, getAllAppointmentsCalendar)
appointmentsRouter.get('/all-appointments-calendar-detail', auth, isSuperAdmin, getAllAppointmentsCalendarDetails)
appointmentsRouter.get('/get-all-my-appointments',auth, getAllMyAppointments)
appointmentsRouter.put('/update',auth, updateAppointment)

export {appointmentsRouter}