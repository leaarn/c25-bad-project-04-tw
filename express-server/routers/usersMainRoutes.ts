import { usersMainController } from "./../app";
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
usersMainRoutes.get("/payorder", usersMainController.payOrderDetails);
// change status from not pay yet to pending
usersMainRoutes.put("/confirm", usersMainController.confirmOrder);
//show all orders that not complete
usersMainRoutes.get("/orderstatus", usersMainController.orderStatus);
//each order details 查看你的司機資訊及位置
usersMainRoutes.get(
  "/orderstatus/:oid",
  usersMainController.orderStatusDetails
);
usersMainRoutes.get("/history", usersMainController.historyOrders);
usersMainRoutes.get("/history/:oid", usersMainController.historyOrderDetails);
usersMainRoutes.post(
  "/aiCreateOrder",
  usersMainController.aiCreateOrderController
);
usersMainRoutes.post("/uploads", usersMainController.uploadImage);
usersMainRoutes.post("/airesults", aiResults);

async function aiResults (req: express.Request, res: express.Response) {
  const { data } = req.body;
  const output = Array.from(data)
  try { 
    const resp = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({data: output}),
    });
    const result = await resp.json()
    res.status(200).json(result);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).json({ msg: "internal server error" });
  }
}