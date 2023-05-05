import { usersController } from "../app";
// import { usersLogin } from "../model";
// import { checkPassword, hashPassword } from "../utils/hash";
// import crypto from "crypto";
// import { createUsers } from "../model";
import express from "express";
// import { logger } from "../utils/logger";
// import { body, validationResult } from "express-validator";

export const usersRoutes = express.Router();

usersRoutes.post("/", usersController.loginControl);
usersRoutes.get("/usersGoogle", usersController.loginUserControl);
usersRoutes.get("/driversGoogle", usersController.loginDriverControl);
usersRoutes.get("/google", usersController.loginGoogleControl);
usersRoutes.post(
  "/createaccount",
  // body("password")
  //   .isStrongPassword({
  //     minLength: 6,
  //     minLowercase: 0,
  //     minUppercase: 0,
  //     minSymbols: 0,
  //   })
  //   .withMessage("Length>6,No Symbol"),
  usersController.createAccountControl
);

// async function loginGoogleControl(req: express.Request, res: express.Response) {
//   try {
//     const accessToken = req.session?.["grant"].response.access_token;

//     const fetchRes = await fetch(
//       "https://www.googleapis.com/oauth2/v2/userinfo",
//       {
//         method: "get",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const result = await fetchRes.json();

//     if (req.session.loginType === "user") {
//       const foundUser = await dbClient.query(
//         /*SQL*/ `SELECT id, first_name, email FROM users WHERE email = $1 `,
//         [result.email]
//       );

//       if (!foundUser.rows[0]) {
//         logger.error("no such user,create one ");

//         const tempPass = crypto.randomBytes(20).toString("hex");
//         const hashedPassword = await hashPassword(tempPass);
//         await dbClient.query(
//           `insert into "users" (email,password) values ($1,$2)`,
//           [result.email, hashedPassword]
//         );
//       }
//       req.session.users_id = foundUser.rows[0].id;
//     }

//     if (req.session.loginType === "driver") {
//       const queryResult = await dbClient.query(
//         /*SQL*/ `SELECT id, first_name, email FROM drivers WHERE email = $1 `,
//         [result.email]
//       );

//       console.log(queryResult.rows);
//       if (!queryResult.rows[0]) {
//         logger.error("no such driver,create one ");

//         const tempPass = crypto.randomBytes(20).toString("hex");
//         const hashedPassword = await hashPassword(tempPass);
//         await dbClient.query(
//           `insert into "drivers" (email,password) values ($1,$2)`,
//           [result.email, hashedPassword]
//         );
//       }
//       req.session.drivers_id = queryResult.rows[0].id;
//     }

//     if (req.session.loginType === "user") {
//       req.session.userIsLoggedIn = true;
//     } else if (req.session.loginType === "driver") {
//       req.session.driverIsLoggedIn = true;
//     } else {
//       res.status(400).send("Incorrect login type");
//       return;
//     }

//     if (req.session.loginType === "user") {
//       res.redirect("/usersMain.html");
//     } else {
//       res.redirect("/driversMain.html");
//     }
//   } catch (err: any) {
//     logger.error(err.message);
//     res.status(500).json({ message: "internal Google server error" });
//   }
// }

// async function createAccountControl(
//   req: express.Request,
//   res: express.Response
// ) {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(400).json({ message: "Please fill in all the boxes!" });
//       return;
//     }

//     const lastName: string = req.body.lastName;
//     const firstName: string = req.body.firstName;
//     const title: string = req.body.title;
//     const email: string = req.body.email;
//     const password: string = req.body.password;
//     const contactNum: Number = req.body.contactNum;
//     const defaultDistrict: string = req.body.defaultDistrict;
//     const defaultRoom: string = req.body.defaultRoom;
//     const defaultFloor: string = req.body.defaultFloor;
//     const defaultBuilding: string = req.body.defaultBuilding;
//     const defaultStreet: string = req.body.defaultStreet;

//     if (!email || !password) {
//       res.status(400).json({ message: "please input the correct information" });
//       return;
//     }

//     const queryResult = await dbClient.query<createUsers>(
//       /*SQL*/ `SELECT id, email FROM users WHERE email = $1 `,
//       [email]
//     );

//     if (queryResult.rows[0]) {
//       res.status(400).json({ message: "existing users!" });
//       return;
//     }
//     const hashedPassword = await hashPassword(password);
//     await dbClient.query(
//       `insert into "users" (last_name, first_name, title, email, password, contact_num, default_district, default_room, default_floor, default_building, default_street) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
//       [
//         lastName,
//         firstName,
//         title,
//         email,
//         hashedPassword,
//         contactNum,
//         defaultDistrict,
//         defaultRoom,
//         defaultFloor,
//         defaultBuilding,
//         defaultStreet,
//       ]
//     );
//     req.session.userIsLoggedIn = true;
//     res.status(200).json({ message: "successful!" });
//   } catch (err: any) {
//     logger.error(err.message);
//     res.status(500).json({ message: "internal server error" });
//   }
// }
