import { ReceiversService } from "../services/ReceiversService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";

export class ReceiversController {
  constructor(private receiversService: ReceiversService) {}

  checkTokenControl = async (req: Request, res: Response) => {
    const token: string = req.body.token;

    const foundToken = await this.receiversService.checkToken(token);

    if (!token) {
      res.status(400).json({ message: "missing token!" });
      return;
    }

    if (!foundToken) {
      res.status(400).json({ message: "invalid token! " });
      return;
      } else {res.status(200).json({ message: "successful!" });}

    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
