import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { Portfolio } from "../models/Portfolio";
import { Appointment_portfolio } from "../models/Appointment_portfolio";

const createAppointment = async (req: Request, res: Response) => {

    try {
        const id = req.token.id
        const { date, shift, email, name } = req.body

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if ((!date) || (typeof (date) !== "string") || (!dateRegex.test(date)))  {
            return "Remember you must insert a date, and the date format should be YYYY-MM-DD, try again"
        }

        if ((!shift) || (typeof (shift) !== "string") || (shift !== "morning" && shift !== "afternoon")) {
            return "Remember you must insert a shift, and you only can put morning or afternoon, try again"
        }

        if ((typeof email !== "string") || (email.length > 100) || (!emailRegex.test(email))) {
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }

        const foundArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });


        if ((foundArtistByEmail?.is_active !== true) || (foundArtistByEmail?.role.role_name != "admin") || (id == foundArtistByEmail.id)){
            return res.json({
                success: true,
                message: "Sorry, this user isn't a artist, or not exist. And remember you can't create a appointment with yourself"
            })
        }

        const getPurchase = await Portfolio.findOneBy({
            name
        })

        if (!getPurchase) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        const createNewAppointment = await Appointment.create({
            date,
            shift,
            artist_id: foundArtistByEmail?.id,
            client_id: id
        }).save()

        await Appointment_portfolio.create({
            appointment_id: createNewAppointment.id,
            portfolio_id: getPurchase?.id
        }).save()

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: {
                date: createNewAppointment.date,
                shift: createNewAppointment.shift,
                email: email,
                artist: foundArtistByEmail?.full_name,
                id: createNewAppointment.id,
                name: getPurchase?.name,
                price: getPurchase?.price,
                category: getPurchase?.category,
                created_at: createNewAppointment.created_at,
                updated_at: createNewAppointment.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be created, try again",
            error
        })
    }
}

const getAllAppointmentArtist = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsWorker = await Appointment.findBy({
            artist_id: id
        })

        const appointmentsUserForShows = await Promise.all(appointmentsWorker.map(async (obj) => {
            const { status, artist_id, id, ...rest } = obj;

            const artist = await User.findOneBy({
                id: artist_id
            });

            if (artist) {
                const email = artist.email;
                const is_active = artist.is_active;
                return { ...rest, email, is_active };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointments can't be getted, try again",
            error
        })
    }
}

const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = req.body.id;
        const clientTokenId = req.token.id;


        if (!appointmentId) {
            return res.json({
                success: true,
                message: "Please provide the ID of the appointment to be deleted.",
            });
        }

        if (typeof appointmentId !== "number") {
            return res.json({
                success: true,
                message: "The provided ID is not in the correct format. Please enter a numerical value for the appointment ID."
            });
        }

        const userAppointments = await Appointment.findBy({
            client_id: clientTokenId,
        });

        const userAppointmentsIds = userAppointments.map((appointment) =>
            appointment.id
        );

        if (!userAppointmentsIds.includes(appointmentId)) {
            return res.json("The appointment with the provided ID does not exist or cannot be deleted.");
        }

        const deletedAppointment = await Appointment.delete({
            id: appointmentId
        });

        return res.json({
            success: true,
            message: "The appointment has been successfully deleted.",
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "An error occurred while trying to delete the appointment. Please try again later.",
            error
        });
    }
}

const getAllMyAppointments = async (req: Request, res: Response) => {

    try {
        const clientTokenId = req.token.id;

        const userAppointments = await Appointment.findBy({
            client_id: clientTokenId
        });

        const formattedAppointments = await Promise.all(userAppointments.map(async (appointment) => {
            const { status, artist_id, client_id, ...appointmentDetails } = appointment;

            const artistDetails = await User.findOneBy({
                id: artist_id
            });

            if (artistDetails) {
                const full_name = artistDetails.full_name
                const artistEmail = artistDetails.email;
                const artistIsActive = artistDetails.is_active;
                return { full_name, artistEmail, artistIsActive };
            } else {
                return null;
            }
        }));

        return res.json({
            success: true,
            message: "Here is a list of all your appointments",
            data: formattedAppointments
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "There was an issue retrieving your appointments, please try again",
            error
        });
    }
}

const updateAppointment = async (req: Request, res: Response) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const client_id = req.token.id
        const body = req.body
        const appointmentId = body.id
        const date = body.date
        const shift = body.shift
        const email = body.email

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                message: 'Email incorrect, you can only enter strings. Please try again.'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                message: 'Email too long, please insert a shorter name, maximum 100 characters.'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                message: 'Email format incorrect, try again'
            });
        }

        const findArtistByEmail = await User.findOneBy({
            email
        })

        if (findArtistByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "Artist doesn't exist"
            })
        }

        const WorkerID = findArtistByEmail?.id

        if (!appointmentId) {
            return res.json({
                success: true,
                message: "You must enter an ID.",
            })
        }

        if (typeof (appointmentId) !== "number") {
            return res.json({
                success: true,
                message: "ID incorrect, you can only use numbers, please try again."
            });
        }

        if (!date) {
            return res.json({
                success: true,
                message: "Date not provided",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                message: "Incorrect date format. Date must be a string"
            });
        }

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                message: "Incorrect date, the format should be YYYY-MM-DD."
            });
        }

        if (!shift) {
            return res.json({
                success: true,
                message: "Time not provided",
            })
        }

        if (typeof (shift) !== "string") {
            return res.json({
                success: true,
                message: "Time must be a string."
            });
        }

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const appointmentsId = await appointmentsClient.map((object) =>
            object.id
        )

        if (!appointmentsId.includes(appointmentId)) {
            return res.json(
                {
                    success: true,
                    message: "Appointment not updated successfully, incorrect ID."
                }
            )
        }

        await Appointment.update(
            {
                id: appointmentId
            },
            {
                date: date,
                shift: shift,
                artist_id: WorkerID
            }
        )

        const dataAppointmentUpdated = await Appointment.findOneBy({
            id: appointmentId
        })

        return res.json({
            success: true,
            message: "The appointment was successfully created.",
            data: {
                date,
                shift,
                email,
                id: appointmentId,
                created_at: dataAppointmentUpdated?.created_at,
                updated_at: dataAppointmentUpdated?.updated_at
            }
        })

    } catch (error) {
        return res.json(
            {
                success: false,
                message: "Updating the appointment is currently not possible. Please try again.",
                error
            }
        )
    }
}

// obtener todas las citas unicamente con el rol super admin 
const getallAppointmentsAllUsers = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.find()

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, artist_id, client_id, ...rest } = obj;

            const user = await User.findOneBy({
                id: client_id
            });

            if (user) {
                const email = user.email;
                const is_active = user.is_active;
                const full_name = user.full_name;
                return { email, is_active, full_name, ...rest, };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

export { createAppointment, getAllAppointmentArtist, deleteAppointment, getAllMyAppointments, updateAppointment, getallAppointmentsAllUsers }