import {usersMainController} from "./../app";
import express from "express";

export const usersMainRoutes = express.Router();

usersMainRoutes.get("/");
//user info
usersMainRoutes.get("/userinfo", usersMainController.getUserInfo);
//default address
usersMainRoutes.get("/address", usersMainController.getAddress);
//create
usersMainRoutes.post("/createorder", usersMainController.createOrder);
//pay
usersMainRoutes.get("/payorder", usersMainController.payOrder);
// change status from not pay yet to pending
usersMainRoutes.put("/confirm", usersMainController.confirmOrder);
//show all orders that not complete
usersMainRoutes.get("/orderstatus", usersMainController.orderStatus);
//each order details 查看你的司機資訊及位置
usersMainRoutes.get("/orderstatus/:oid", usersMainController.orderStatusDetails);
usersMainRoutes.get("/history", usersMainController.historyOrders);
usersMainRoutes.get("/history/:oid", usersMainController.historyOrderDetails);
usersMainRoutes.post(
  "/aiCreateOrder",
  usersMainController.aiCreateOrderController
);