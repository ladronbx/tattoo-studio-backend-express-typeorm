import { Appointment } from "../models/Appointment";

const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email) {
        return "you must insert an email"
    }

    if (typeof (email) !== "string") {
        return 'Incorrect email, it should only contain strings'
    };

    if (email.length > 100) {
        return 'Email is too long, please try a shorter one. Maximum 100 characters'
    };

    if (!emailRegex.test(email)) {
        return 'Incorrect email format. Please try again'
    };
};

const validateDate = (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
        return "you must insert a date"
    }

    if (typeof (date) !== "string") {
        return "date incorrect, you can put only strings, try again"
    };

    if (!dateRegex.test(date)) {
        return "date incorrect, The date format should be YYYY-MM-DD, try again"
    };
};

const validateShift = (shift: string) => {
    if (!shift) {
        return "you must insert a shift"
    }

    if (typeof (shift) !== "string") {
        return "shift incorrect, you can put only strings, try again"
    };

    if (shift !== "morning" && shift !== "afternoon") {
        return "shift incorrect, you only can put morning or afternoon, try again"
    };
};

const validateString = (string: string, lenght: number) => {
    if (!string) {
        return `you must insert ${string}`
    }

    if (typeof (string) !== "string") {
        return `you must insert a string`
    }

    if (string.length == 0) {
        return `${string} too short, try to insert a larger one, max ${lenght} characters`
    };

    if (string.length > lenght) {
        return `${string} too long, try to insert a shorter one, max ${lenght} characters`
    }
};

const validatePhoto = (string: string, length: number) => {
    if (string != undefined) {

        if (!string) {
            return "you must insert an name " + string
        }

        if (typeof (string) !== "string") {
            return `you must insert a strings`
        };

        if (string.length == 0) {
            return `${string} too short, try to insert a larger one, max  ${length} characters`
        };

        if (string.length > length) {
            return `${string} too long, try to insert a shorter one, max ${length} characters`
        }
    }
};

const validateNumber = (number: number, lenght: number) => {

    if (!number) {
        return `you must insert a number`
    }

    if (typeof (number) !== "number") {
        return `you must insert a number`
    }

    const stringNumber = number.toString()
    if (stringNumber.length > lenght) {
        return `number too long, try to insert a shorter one, max ${lenght} characters`
    }
};

const validatePassword = (password: string) => {

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

    if (!password) {
        return {
            success: true,
            mensaje: 'you must insert a password'
        };
    }

    if (typeof (password) !== "string") {
        return {
            success: true,
            mensaje: 'password incorrect, you can put only strings, try again'
        };
    }

    if (password.length > 100) {
        return {
            success: true,
            mensaje: 'password too long, try to insert a shorter name, max 100 characters'
        };
    }

    if (!passwordRegex.test(password)) {
        return {
            success: true,
            mensaje: 'password incorrect, try again'
        };
    }
};

const validateAvailableDate = async (date: string, emailWorker: string, shift: string) => {

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate() + 1;

    const todayFormatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if (todayFormatDate > date) {
        return {
            isValid: false,
            message: "this day is prior to the current day, try again."
        };
    }

    const findAppointmentWorker = await Appointment.find({
        where: {
            date,
            shift,
        },
        relations: ["artist"],
    })

    let isValid = true;

    findAppointmentWorker.forEach(appointment => {
        if (appointment.artist.role_id !== 2 ||
            appointment.date === date && appointment.shift === shift &&
            appointment.artist.email === emailWorker) {
            isValid = false;
        }
    });

    if (!isValid) {
        return {
            isValid: false,
            message: "this appointment it's not available, try again"
        };
    }

    return { isValid: true };
};

export {
    validateDate, validateString, validateShift, validateEmail,
    validateNumber, validatePassword, validateAvailableDate, validatePhoto
}