import {UsersMainService} from "../services/UsersMainService"
import type { Request, Response } from "express";
import { logger } from "../utils/logger";

export class UsersController {
    constructor(private usersMainService: UsersMainService) {}

    //user info
    getUserInfo = async (req: Request, res: Response) =>{
        try{
            const  userInfo = await this.usersMainService.getUserInfo();
            res.status(200).json(userInfo)
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }

    //get default address

    getAddress = async (req: Request, res: Response) =>{
        try{
            const  address = await this.usersMainService.getAddress();
            res.status(200).json(address)
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }
    //create order

    // createOrder = async (req: Request, res: Response) =>{
    //     try{
    //         const  address = await this.usersMainService.createOrder();
    //         res.status(200).json({ message: "create order success" });
    //     }catch(err:any){
    //         logger.error(err.message);
    //         res.status(500).json({ message: "internal server error" });
    //     }
    // }

    //pay
    payOrder = async (req: Request, res: Response) =>{
        try{
            const  orderToPay = await this.usersMainService.payOrder();
            res.status(200).json(orderToPay)
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }

    // change status from not pay yet to pending
    confirmOrder = async (req: Request, res: Response) =>{
        try{
            await this.usersMainService.confirmOrder();
            res.status(200).json({ message: "paid" })
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }

    //show all orders that not complete
    orderStatus = async (req: Request, res: Response) =>{
        try{
            const allOrderStatus = await this.usersMainService.orderStatus();
            res.status(200).json(allOrderStatus);
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }

    orderStatusDetails = async (req: Request, res: Response) =>{
        try{
            const orderId = +req.params.oid;
            
            if (isNaN(orderId)) {
                res.status(400).json({ message: "invalid memo id" });
                return;
              }
        

            const allOrderStatus = await this.usersMainService.orderStatus();
            res.status(200).json(allOrderStatus);
        }catch(err:any){
            logger.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }
    }


}