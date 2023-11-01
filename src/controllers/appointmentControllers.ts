import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { Portfolio } from "../models/Portfolio";
import { Appointment_portfolio } from "../models/Appointment_portfolio";

const createAppointment = async (req: Request, res: Response) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const date = req.body.date;
        const shift = req.body.shift;
        const email = req.body.email;
        const purchase = req.body.name;
        const idToken = req.token.id;

        // Validar si el email está proporcionado y su formato es correcto
        if (!email || typeof email !== "string" || email.length > 100 || email.length === 0 || !emailRegex.test(email)) {
            return res.json({
                success: true,
                message: "Email format incorrect. Please provide a valid email.",
            });
        }

        const findArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"],
        });

        // Validar la existencia del artista y sus permisos
        if (!findArtistByEmail || !findArtistByEmail.is_active || findArtistByEmail.role.role_name !== "admin") {
            return res.json({
                success: true,
                message: "The artist does not exist or lacks admin permissions.",
            });
        }

        // Evitar que un usuario cree una cita consigo mismo
        if (idToken === findArtistByEmail.id) {
            return res.json({
                success: true,
                message: "Sorry, you can't create an appointment with yourself.",
            });
        }

        // Validar la fecha y su formato
        if (!date || typeof date !== "string" || !dateRegex.test(date)) {
            return res.json({
                success: true,
                message: "Incorrect date format. Date must be in YYYY-MM-DD format.",
            });
        }


        // Crear la cita
        const createAppointment = await Appointment.create({
            date,
            shift,
            artist_id: findArtistByEmail.id,
            client_id: idToken,
        }).save();

        // Encuentra el elemento de compra por su nombre
        const portfolio = await Portfolio.findOne({
            where: { name: purchase }
        });

        // Crea una nueva entrada en la tabla de unión 'Appointment_portfolio' asociando la cita con el elemento de compra
        await Appointment_portfolio.create({
            appointment_id: createAppointment.id,
            portfolio_id: portfolio?.id
        }).save();

        const appointmentCreated = {
            date: createAppointment.date,
            shift: createAppointment.shift,
            email,
            id: createAppointment.id,
            purchase: portfolio?.name,
            price: portfolio?.price,
            created_at: createAppointment.created_at,
            updated_at: createAppointment.updated_at,
        };

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: { appointmentCreated },
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be created, try again",
            error,
        });
    }
};

// const createAppointment = async (req: Request, res: Response) => {


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