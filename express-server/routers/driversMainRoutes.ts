import express from "express";
import { driverIsLoggedInApi } from "../utils/guard";
import { driversMainController } from "../app";

export const driversMainRoutes = express.Router();

driversMainRoutes.get(
  "/get-driver-info",
  driverIsLoggedInApi,
  driversMainController.getDriverInfo
);
driversMainRoutes.get(
  "/get-district",
  driverIsLoggedInApi,
  driversMainController.getDistricts
);
driversMainRoutes.get(
  "/get-orders",
  driverIsLoggedInApi,
  driversMainController.getAllOrders
);
driversMainRoutes.get(
  "/get-orders/:oid",
  driverIsLoggedInApi,
  driversMainController.getAcceptOrders
);
driversMainRoutes.get(
  "/driver-earns/:oid",
  driverIsLoggedInApi,
  driversMainController.getDriverEarns
);
driversMainRoutes.get(
  "/history/",
  driverIsLoggedInApi,
  driversMainController.getOrdersHistory
);
driversMainRoutes.get(
  "/history/:oid",
  driverIsLoggedInApi,
  driversMainController.getSingleHistory
);
driversMainRoutes.get(
  "/ongoing",
  driverIsLoggedInApi,
  driversMainController.getOngoingOrders
);
driversMainRoutes.put(
  "/cfm-orders/:oid",
  driverIsLoggedInApi,
  driversMainController.confirmAcceptOrder
);
driversMainRoutes.put(
  "/ongoing/:oid",
  driverIsLoggedInApi,
  driversMainController.updateDriverDelivering
);
driversMainRoutes.post(
  "/msg/:oid",
  driverIsLoggedInApi,
  driversMainController.message
);
