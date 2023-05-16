import { UsersMainService } from "../services/UsersMainService";
import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { randomToken} from "./utils";
import { randomDistance } from "./random";
import axios from "axios";

// export function randomToken() {
//   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let token = "";

//   for (let i = 0; i < 2; i++) {
//     const tokenGenerator =
//       alphabet[Math.floor(Math.random() * alphabet.length)] +
//       Math.floor(Math.random() * 99);
//     token += tokenGenerator;
//   }
//   return token
// }
import formidable from "formidable";
import { form, formParsePromise } from "../formidable";

export class UsersMainController {
  constructor(private usersMainService: UsersMainService) {}

  // randomDistance = () => {
  //   return Math.round(Math.random() * (100 - 1) + 1);
  // };

  // randomToken = () =>{
  //   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //   let token = "";

  //   for (let i = 0; i < 2; i++) {
  //     const tokenGenerator =
  //       alphabet[Math.floor(Math.random() * alphabet.length)] +
  //       Math.floor(Math.random() * 99);
  //     token += tokenGenerator;
  //   }
  //   return token
  // }
  //user info
  getUserInfo = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const userInfo = await this.usersMainService.getUserInfo(usersId);
      console.log("here is user info", userInfo);
      res.status(200).json(userInfo);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //get default address

  getAddress = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const address = await this.usersMainService.getAddress(usersId);
      console.log("here is user adress", address);
      res.status(200).json(address);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
  //create order

  createOrder = async (req: Request, res: Response) => {
    try {
      const pick_up_date = req.body.pick_up_date;
      const pick_up_time = req.body.pick_up_time;
      const pick_up_district = req.body.pick_up_district;
      console.log("hereis pick up dist", pick_up_district);
      const pick_up_room = req.body.pick_up_room;
      const pick_up_floor = req.body.pick_up_floor;
      const pick_up_building = req.body.pick_up_building;
      const pick_up_street = req.body.pick_up_street;

      // const pick_up_coordinates =req.body.pick_up_coordinates
      const deliver_district = req.body.deliver_district;
      const deliver_room = req.body.deliver_room;
      const deliver_floor = req.body.deliver_floor;
      const deliver_building = req.body.deliver_building;
      const deliver_street = req.body.deliver_street;

      // const deliver_coordinates =req.body.deliver_coordinates
      //??
      const users_id = req.session.users_id!;
      const receiver_name = req.body.receiver_name;
      const receiver_contact = req.body.receiver_contact;
      const animals_id = req.body.animals_id;
      const animals_amount = req.body.animals_amount;
      const remarks = req.body.remarks;
      const distance_km = randomDistance();
      const token = randomToken();

      await this.usersMainService.createOrder({
        pick_up_date,
        pick_up_time,
        pick_up_district,
        pick_up_room,
        pick_up_floor,
        pick_up_building,
        pick_up_street,
        deliver_district,
        deliver_room,
        deliver_floor,
        deliver_building,
        deliver_street,
        users_id,
        distance_km,
        receiver_name,
        receiver_contact,
        token,
        remarks,
        animals_id,
        animals_amount,
      });
      res.status(200).json({ message: "create order success" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //pay
  payOrderDetails = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      console.log("here is user id", usersId);
      const orderToPay = await this.usersMainService.payOrderDetails(usersId);
      res.status(200).json(orderToPay);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  // change status from not pay yet to pending
  confirmOrder = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const orderId = req.body.orderId;
      await this.usersMainService.confirmOrder(usersId, orderId);
      res.status(200).json({ message: "paid" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //show all orders that not complete
  orderStatus = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const allOrderStatus = await this.usersMainService.orderStatus(usersId);
      res.status(200).json(allOrderStatus);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  orderStatusDetails = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const orderId = parseInt(req.params.oid);

      if (isNaN(orderId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }

      const result = await this.usersMainService.orderStatusDetails(
        usersId,
        orderId
      );
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  historyOrders = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const allCompleteOrders = await this.usersMainService.historyOrders(
        usersId
      );
      res.status(200).json(allCompleteOrders);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  historyOrderDetails = async (req: Request, res: Response) => {
    try {
      const usersId = req.session.users_id!;
      const orderId = +req.params.oid;

      if (isNaN(orderId)) {
        res.status(400).json({ message: "invalid order id" });
        return;
      }

      const completeOrderDetails =
        await this.usersMainService.historyOrderDetails(usersId, orderId);
      res.status(200).json(completeOrderDetails);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //Julia start
  aiCreateOrderController = async (req: Request, res: Response) => {
    try {
      const pick_up_date = req.body.pick_up_date;
      const pick_up_time = req.body.pick_up_time;
      const pick_up_district = req.body.pick_up_district;
      const pick_up_room = req.body.pick_up_room;
      const pick_up_floor = req.body.pick_up_floor;
      const pick_up_building = req.body.pick_up_building;
      const pick_up_street = req.body.pick_up_street;
      const AI_rating = req.body.rate;
      const is_AI = req.body.isAI;

      // const pick_up_coordinates =req.body.pick_up_coordinates
      const deliver_district = req.body.deliver_district;
      const deliver_room = req.body.deliver_room;
      const deliver_floor = req.body.deliver_floor;
      const deliver_building = req.body.deliver_building;
      const deliver_street = req.body.deliver_street;

      // const deliver_coordinates =req.body.deliver_coordinates
      //??
      const users_id = req.session.users_id!;
      const receiver_name = req.body.receiver_name;
      const receiver_contact = req.body.receiver_contact;
      const animals_id = req.body.anmId;
      const animals_amount = req.body.anmAmount;
      const remarks = req.body.remarks;
      const distance_km = randomDistance();
      const token = randomToken();

      await this.usersMainService.aiCreateOrder({
        pick_up_date,
        pick_up_time,
        pick_up_district,
        pick_up_room,
        pick_up_floor,
        pick_up_building,
        pick_up_street,
        deliver_district,
        deliver_room,
        deliver_floor,
        deliver_building,
        deliver_street,
        users_id,
        distance_km,
        receiver_name,
        receiver_contact,
        token,
        remarks,
        animals_id,
        animals_amount,
        AI_rating,
        is_AI,
      });
      res.status(200).json({ message: "create order success" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
  //Julia end
  // Yannes part
  uploadImage = async (req: Request, res: Response) => {
    try {
      const { files } = await formParsePromise(form, req);
      const uploadForm = files.image as formidable.File;
      const imageFilename = uploadForm.newFilename;

      const image = await this.usersMainService.uploadImage(imageFilename);

      const url = `http://127.0.0.1:8000/file?newFileName=${imageFilename}`;
      console.log("url: ", url);
      const aiResultResponse = await axios(url);
      console.log("file in db: ", image[0].image);
      const aiResultArr = aiResultResponse.data.data;
      console.log("aiResult: ", aiResultArr);
      console.log("typeOf", typeof aiResultArr);

      res.status(200).json(aiResultArr);
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
  // Yannes part
}
