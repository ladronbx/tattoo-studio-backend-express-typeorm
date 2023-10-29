import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

const createAppointment = async (req: Request, res: Response) => {

    try {
        const date = req.body.date
        const time = req.body.time
        const email = req.body.email
        const id = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'email incorrect, you can put only strings, try again'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'email format incorrect, try again'
            });
        }

        const emailArtist = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (emailArtist?.is_active !== true){
            return res.json({
                success: true,
                message: "this artist not exist"
            })
        }

        if (emailArtist?.role.role_name != "admin") {
            return res.json({
                success: true,
                message: "sorry, this user isn't a artist, try again"
            })
        }

        if (id == emailArtist.id) {
            return res.json({
                success: true,
                message: "sorry, you can't create a appointment with yourself"
            })
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert a date",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "date incorrect, you can put only strings, try again"
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "date incorrect, The date format should be YYYY-MM-DD, try again"
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "you must insert a time",
            })
        }

        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "time incorrect, you can put only strings, try again"
            });
        }

        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "time incorrect, The time format should be HH:MM:SS, try again"
            });
        }

        const createNewAppointment = await Appointment.create({
            date,
            time,
            artist_id: emailArtist.id,
            client_id: id
        }).save()

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date: createNewAppointment.date,
                time: createNewAppointment.time,
                email: email,
                id: createNewAppointment.id,
                created_at: createNewAppointment.created_at,
                updated_at: createNewAppointment.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "appointment can't be created, try again",
            error
        })
    }
}

export { createAppointment}