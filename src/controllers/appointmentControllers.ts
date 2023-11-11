import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { Portfolio } from "../models/Portfolio";
import { Appointment_portfolio } from "../models/Appointment_portfolio";

const createAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.token.id;
        const { date, shift, email, id: idPortfolio } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate() + 1;
        const todayFormatDate = new Date(year, month - 1, day);
        const appointmentDate = new Date(date);

        if (appointmentDate < todayFormatDate) {
            console.log("2");
            return res.json({
                success: true,
                message: "This day is prior to the current day, try again."
            });
        }

        if (!date || typeof date !== "string" || !dateRegex.test(date)) {
            return res.json({
                success: true,
                message: "Remember you must insert a date, and the date format should be YYYY-MM-DD, try again"
            });
        }

        if (!shift || typeof shift !== "string" || (shift !== "morning" && shift !== "afternoon")) {
            return res.json({
                success: true,
                message: "Remember you must insert a shift, and you only can put morning or afternoon, try again"
            });
        }

        if (typeof email !== "string" || email.length > 100 || !emailRegex.test(email)) {
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }

        const foundArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (!foundArtistByEmail || !foundArtistByEmail.is_active || foundArtistByEmail.role.role_name !== "admin" || id === foundArtistByEmail.id) {
            return res.json({
                success: true,
                message: "Sorry, this user isn't an artist, or does not exist. And remember you can't create an appointment with yourself"
            });
        }

        const getService = await Portfolio.findOneBy({ id: idPortfolio });

        if (!getService) {
            return res.json({
                success: true,
                message: "The name of the item purchase doesn't exist",
            });
        }
        
        const existingAppointment = await Appointment.findOne({
            where: {
                date,
                shift,
                artist_id: foundArtistByEmail.id,
            },
        });

        if (existingAppointment) {
            return res.json({
                success: true,
                message: "This appointment is not available, try again",
            });
        }
        const createNewAppointment = await Appointment.create({
            date,
            shift,
            artist_id: foundArtistByEmail.id,
            client_id: id
        }).save();

        await Appointment_portfolio.create({
            appointment_id: createNewAppointment.id,
            portfolio_id: getService.id
        }).save();

        const dataAppointment = {
            date: createNewAppointment.date,
            shift: createNewAppointment.shift,
            email,
            artist: foundArtistByEmail.full_name,
            id: createNewAppointment.id,
            service: getService.name,
            price: getService.price,
            category: getService.category,
            created_at: createNewAppointment.created_at,
            updated_at: createNewAppointment.updated_at
        };

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: { dataAppointment }
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be created, try again",
            error
        });
    }
};

const myCalendarAsArtist = async (req: Request, res: Response) => {
    try {
        const id = req.token.id;

        const appointmentsForShows = await Appointment.find({
            where: { artist_id: id },
            select: ["id", "date", "shift", "client_id", "status"],
        });

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsForShows
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

const getAllAppointmentsCalendar = async (req: Request, res: Response) => {
    try {
        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const appointmentsUser = await Appointment.find({
            skip: skip,
            take: pageSize
        })

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUser
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

const getAllAppointmentsCalendarDetails = async (req: Request, res: Response) => {
    try {

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const appointmentsUser = await Appointment.find({
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUser
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

const getAllMyAppointments = async (req: Request, res: Response) => {
    try {
        const idToken = req.token.id

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's must a number."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's must a number."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const getAllMyAppointment = await Appointment.find({
            where: { client_id: idToken },
            relations: ["appointmentPortfolios", "artist"],
            skip: skip,
            take: pageSize
        })

        const appointmentsUser = await Promise.all(
            getAllMyAppointment.map(async (obj) => {
                const { status, artist_id, client_id, appointmentPortfolios, artist, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)
                const categoryPortfolio = obj.appointmentPortfolios.map((obj) => obj.category)
                const getArtist = obj.artist

                if (getArtist && (categoryPortfolio.length !== 0) && (purchase.length !== 0)) {
                    const full_name = getArtist.full_name
                    const email = getArtist.email;
                    const is_active = getArtist.is_active;
                    const name = purchase[0]
                    const category = categoryPortfolio[0]
                    return { full_name, email, name, category, is_active, ...rest };
                }
                else {
                    return null
                }
            })
        );

        return res.json({
            success: true,
            message: "Here is a list of all your appointments.",
            data: appointmentsUser
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
        const id = req.token.id;
        const { date, shift, email, name } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate() + 1;
        const todayFormatDate = new Date(year, month - 1, day);
        const appointmentDate = new Date(date);

        if (appointmentDate < todayFormatDate) {
            console.log("2");
            return res.json({
                success: true,
                message: "This day is prior to the current day, try again."
            });
        }

        if (!date || typeof date !== "string" || !dateRegex.test(date)) {
            return res.json({
                success: true,
                message: "Remember you must insert a date, and the date format should be YYYY-MM-DD, try again"
            });
        }

        if (!shift || typeof shift !== "string" || (shift !== "morning" && shift !== "afternoon")) {
            return res.json({
                success: true,
                message: "Remember you must insert a shift, and you only can put morning or afternoon, try again"
            });
        }

        if (typeof email !== "string" || email.length > 100 || !emailRegex.test(email)) {
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }

        const foundArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (!foundArtistByEmail || !foundArtistByEmail.is_active || foundArtistByEmail.role.role_name !== "admin" || id === foundArtistByEmail.id) {
            return res.json({
                success: true,
                message: "Sorry, this user isn't an artist, or does not exist. And remember you can't create an appointment with yourself"
            });
        }

        const getService = await Portfolio.findOneBy({ name });

        if (!getService) {
            return res.json({
                success: true,
                message: "The name of the item purchase doesn't exist",
            });
        }

        const existingAppointment = await Appointment.findOne({
            where: {
                date,
                shift,
                artist_id: foundArtistByEmail.id,
            },
        });

        if (existingAppointment) {
            return res.json({
                success: true,
                message: "This appointment is not available, try again",
            });
        }

        await Appointment.update({
            id: id
        }, {
            date,
            shift,
            artist_id: foundArtistByEmail.id,
        })

        await Appointment_portfolio.update({
            appointment_id: id
        }, {
            portfolio_id: getService?.id
        })

        const appointmentUpdated = await Appointment.findOneBy({
            id: id
        })

        return res.json({
            success: true,
            message: "Appointment updated succesfully",
            data: {
                date,
                shift,
                Worker: foundArtistByEmail.full_name,
                email,
                id: id,
                name,
                category: getService?.category,
                created_at: appointmentUpdated?.created_at,
                updated_at: appointmentUpdated?.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be updated, try again",
            error
        });
    }
};

export { createAppointment, myCalendarAsArtist, deleteAppointment, getAllMyAppointments, updateAppointment, getAllAppointmentsCalendar, getAllAppointmentsCalendarDetails }