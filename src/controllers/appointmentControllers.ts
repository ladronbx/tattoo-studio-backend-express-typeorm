import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { Portfolio } from "../models/Portfolio";
import { Appointment_portfolio } from "../models/Appointment_portfolio";

//Crea una cita validando que la fecha no sea anterior a la de hoy, y que el artista esté disponible. 
const createAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.token.id;
        const { date, shift, email, name } = req.body;
        // dateRegex y emailRegex definen patrones para validar la fecha y el correo electrónico
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        // Obtiene el día actual.
        const today = new Date();
        // Obtiene el año actual de la fecha actual, utilizando el método getFullYear() del objeto Date.
        const year = today.getFullYear();
        // Obtiene el mes actual de la fecha actual. Es importante notar que el método getMonth() devuelve los meses del 0 al 11, por lo que se le suma 1 para obtener el número del mes en el rango de 1 a 12
        const month = today.getMonth() + 1;
        const day = today.getDate() + 1;
        const todayFormatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        //Valida si la fecha para la cita es anterior a la actual
        if (todayFormatDate > date) {
            return {
                isValid: false,
                message: "This day is prior to the current day, try again."
            };
        }

        // Verifica si la fecha proporcionada es válida según el formato
        if (!date || typeof date !== "string" || !dateRegex.test(date)) {
            return "Remember you must insert a date, and the date format should be YYYY-MM-DD, try again";
        }
        // Verifica si se ha proporcionado un turno válido ('morning' o 'afternoon').
        if (!shift || typeof shift !== "string" || (shift !== "morning" && shift !== "afternoon")) {
            return "Remember you must insert a shift, and you only can put morning or afternoon, try again";
        }

        // Verifica si el correo electrónico proporcionado es válido según un patrón predefinido
        if (typeof email !== "string" || email.length > 100 || !emailRegex.test(email)) {
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }

        //Buscar al artista para ver si existe, si está activo, si tiene el role que corresponde y si no está cogiendo hora con él mismo. 
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

        //Buscamos el nombre del servio tattoo/piercing para ver si coincide. Porque si no coincide no existe. 
        const getService = await Portfolio.findOneBy({ name });

        if (!getService) {
            return res.json({
                success: true,
                message: "The name of the item purchase doesn't exist",
            });
        }

        //Verificar que no exista una cita en la tabla Appointment con esa fecha y ese turno para ese artista.
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
            name: getService.name,
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

//Me trae todas las citas logeandome como artista
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

//Elimina la cita por id
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

// obtener todas las citas unicamente con el rol super admin 
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

// obtener todas las citas unicamente con el rol super admin en detalle (incluyendo detalles)
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

// Trae todos los datos necesarios del cliente que lo solicita
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

        // Formatear la fecha actual
        const todayFormatDate = new Date(year, month - 1, day);

        // Formatear la fecha de la cita
        const appointmentDate = new Date(date);

        console.log("1");

        // Validar si la fecha de la cita es anterior a la actual
        if (appointmentDate < todayFormatDate) {
            console.log("2");
            return res.json({
                success: true,
                message: "This day is prior to the current day, try again."
            });
        }

        console.log("3");

        // Verifica si la fecha proporcionada es válida según el formato
        if (!date || typeof date !== "string" || !dateRegex.test(date)) {
            return res.json({
                success: true,
                message: "Remember you must insert a date, and the date format should be YYYY-MM-DD, try again"
            });
        }
        console.log("4")
        // Verifica si se ha proporcionado un turno válido ('morning' o 'afternoon').
        if (!shift || typeof shift !== "string" || (shift !== "morning" && shift !== "afternoon")) {
            return res.json({
                success: true,
                message:"Remember you must insert a shift, and you only can put morning or afternoon, try again"
            });
        }
        console.log("5")

        // Verifica si el correo electrónico proporcionado es válido según un patrón predefinido
        if (typeof email !== "string" || email.length > 100 || !emailRegex.test(email)) {
            return res.json({
                success: true,
                message: 'Invalid or too long email'
            });
        }
        console.log("6")

        //Buscar al artista para ver si existe, si está activo, si tiene el role que corresponde y si no está cogiendo hora con él mismo. 
        const foundArtistByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });
        console.log("7")

        if (!foundArtistByEmail || !foundArtistByEmail.is_active || foundArtistByEmail.role.role_name !== "admin" || id === foundArtistByEmail.id) {
            return res.json({
                success: true,
                message: "Sorry, this user isn't an artist, or does not exist. And remember you can't create an appointment with yourself"
            });
        }

        //Buscamos el nombre del servio tattoo/piercing para ver si coincide. Porque si no coincide no existe. 
        const getService = await Portfolio.findOneBy({ name });

        if (!getService) {
            return res.json({
                success: true,
                message: "The name of the item purchase doesn't exist",
            });
        }

        //Verificar que no exista una cita en la tabla Appointment con esa fecha y ese turno para ese artista.
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
            message: "Appointment created succesfully",
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
            message: "Appointment can't be created, try again",
            error
        });
    }
};

export { createAppointment, myCalendarAsArtist, deleteAppointment, getAllMyAppointments, updateAppointment, getAllAppointmentsCalendar, getAllAppointmentsCalendarDetails }