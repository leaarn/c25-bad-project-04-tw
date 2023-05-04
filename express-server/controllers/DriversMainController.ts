import { DriversMainService } from "../services/DriversMainService";
import type { Request, Response } from "express";
import { logger } from "../utils/logger";

export class DriversMainController {
  constructor(private driversMainService: DriversMainService) {}

  getDriverInfo = async (req: Request, res: Response) => {
    try {
      const driverID = req.session.drivers_id!;
      const driverInfo = await this.driversMainService.getDriverInfo(driverID);
      res.status(200).json(driverInfo);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getDistricts = async (req: Request, res: Response) => {
    try {
      const districts = await this.driversMainService.getDistricts();
      res.status(200).json(districts);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const allOrders = await this.driversMainService.getAllOrders();
      res.status(200).json(allOrders.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getAcceptOrders = async (req: Request, res: Response) => {
    try {
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const acceptOrders = await this.driversMainService.getAcceptOrders(
        ordersId
      );
      res.status(200).json(acceptOrders.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getDriverEarns = async (req: Request, res: Response) => {
    try {
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const driverEarns = await this.driversMainService.getDriverEarns(
        ordersId
      );
      res.status(200).json(driverEarns.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getOrdersHistory = async (req: Request, res: Response) => {
    try {
      const driversID = req.session.drivers_id!;
      const ordersHistory = await this.driversMainService.getOrdersHistory(
        driversID
      );
      res.status(200).json(ordersHistory.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getSingleHistory = async (req: Request, res: Response) => {
    try {
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const singleHistory = await this.driversMainService.getSingleHistory(
        ordersId
      );
      res.status(200).json(singleHistory.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getOngoingOrders = async (req: Request, res: Response) => {
    try {
      const driversID = req.session.drivers_id!;
      const ongoingOrders = await this.driversMainService.getOngoingOrders(
        driversID
      );
      res.status(200).json(ongoingOrders.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getDriverDelivering = async (req: Request, res: Response) => {
    try {
      const driversID = req.session.drivers_id!;
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const driverDelivering =
        await this.driversMainService.getDriverDelivering(ordersId, driversID);
      res.status(200).json(driverDelivering.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  confirmAcceptOrder = async (req: Request, res: Response) => {
    try {
      const driversID = req.session.drivers_id!;
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const cfmAcceptOrder = await this.driversMainService.confirmAcceptOrder(
        driversID,
        ordersId
      );
      res.status(200).json(cfmAcceptOrder.rows);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  message = async (req: Request, res: Response) => {
    try {
      const ordersId = +req.params.oid;
      if (isNaN(ordersId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }
      const msgResult = await this.driversMainService.message(ordersId);
      res.status(200).json(msgResult);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
