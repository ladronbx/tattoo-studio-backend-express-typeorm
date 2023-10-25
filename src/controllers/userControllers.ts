import { Request, Response } from "express";

const getUser = (req: Request, res: Response) => {
    return res.send('GET USER')
}

const updateUser = (req: Request, res: Response) => {
    // const updateUserById = req.params.id
    // const updateUserBody = req.body;
    return res.send('UPDATE USER')
}

const createUser = (req: Request, res: Response) => {
    // const createUserBody = req.body;
    return res.send('CREATE USER')
}

const deleteUser = (req: Request, res: Response) => {
    // const updateUserById = req.params.id
    // const updateUserBody = req.body;
    return res.send('DELETE USER')
}
export {getUser, updateUser, createUser, deleteUser}