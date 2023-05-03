// import {userMainController} from "./../app";
import express from "express";

export const usersMainRoutes = express.Router();

usersMainRoutes.get("/");
//user info
usersMainRoutes.get("/userinfo", userMainController.getUserInfo);
//default address
usersMainRoutes.get("/address", userMainController.getAddress);
//create
usersMainRoutes.post("/createorder", userMainController.createOrder);
//pay
usersMainRoutes.get("/payorder", userMainController.payOrder);
// change status from not pay yet to pending
usersMainRoutes.put("/confirm", userMainController.confirmOrder);
//show all orders that not complete
usersMainRoutes.get("/orderstatus", userMainController.orderStatus);
//each order details 查看你的司機資訊及位置
usersMainRoutes.get("/orderstatus/:oid", userMainController.orderStatusDetails);
usersMainRoutes.get("/history", userMainController.historyOrders);
usersMainRoutes.get("/history/:oid", userMainController.historyOrderDetails);