import { dbClient } from "../app";
import { driversLogin } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import crypto from "crypto";
import express from "express";

export const driversAuthRoutes = express.Router();

driversAuthRoutes.post("/driverLogin", login);
driversAuthRoutes.get("/driversLogin/google", loginGoogle);

async function login(req:express.Request, res:express.Response){
    const driversEmail: string = req.body.driversEmail;
    const password: string = req.body.driversEmail;
    if (!driversEmail || !password){
        res.status(400).json({ message: "missing username or password!" });
        return;
    }

    const queryResult = await dbClient.query<driversLogin> (
        /*SQL*/ `SELECT id, email, password FROM drivers WHERE email = $1 `,
        [driversEmail]
    );

    const foundDriver = queryResult.rows[0];
   
    if (!foundDriver) {
        res.status(400).json({ message:"invalid username "});
        return;
    }

    if (!(await checkPassword(password, foundDriver.password))){
        res.status(400).json({ message: "invalid password " });
        return;
    }

    req.session.driverIsLoggedIn = true;
    res.json({ message: "login success" });
}

async function loginGoogle(req: express.Request, res: express.Response) {
    
}

)