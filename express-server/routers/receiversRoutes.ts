import { receiversController } from "../app";

import express from "express";

export const receiverRoutes = express.Router();
receiverRoutes.post("/token", receiversController.checkTokenControl);

