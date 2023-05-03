import { Request, Response } from "express";
export class AuthController {
  constructor() {}

  loginUser = async (req: Request, res: Response) => {
    try {
      req.session["loginType"] = "user";
      res.redirect("/connect/google");
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  };

  loginDriver = async (req: Request, res: Response) => {
    try {
      req.session["loginType"] = "driver";
      res.redirect("/connect/google");
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  };
}
