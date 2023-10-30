import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";


const createAppointment = async (req: Request, res: Response) => {

    try {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
        const date = req.body.date
        const time = req.body.time
        const email = req.body.email
        const idToken = req.token.id

        if (!email) {
            return res.json({
                success: true,
                message: "Email not provided.",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Email must be a string.'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Email is too long.'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'Incorrect email format. Please try again'
            });
        }

        const findArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });


        if (findArtistByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "The artist is not exist."
            })
        }

        if (findArtistByEmail?.role.role_name != "admin") {
            return res.json({
                success: true,
                message: "User does not have admin permissions."
            })
        }

        if (idToken == findArtistByEmail.id) {
            return res.json({
                success: true,
                message: "I'm sorry, you can't create an appointment with yourself."
            })
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
                mensaje: "Incorrect date format. Date must be a string"
            });
        }

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "Incorrect date, the format should be YYYY-MM-DD."
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "Time not provided",
            })
        }

        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "Time must be a string."
            });
        }

        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "Incorrect Time, the format should be HH:MM:SS."
            });
        }

        const createAppointment = await Appointment.create({
            date,
            time,
            artist_id: findArtistByEmail.id,
            client_id: idToken
        }).save()

        const appointmentCreated = {
            date: createAppointment.date,
            time: createAppointment.time,
            email: email,
            id: createAppointment.id,
            created_at: createAppointment.created_at,
            updated_at: createAppointment.updated_at
        }

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: { appointmentCreated }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be created, try again",
            error
        })
    }
}

const getAllArtist = async (req: Request, res: Response) => {

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

export { createAppointment, getAllArtist }