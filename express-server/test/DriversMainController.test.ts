// Testing target: DriversMainController
// Mock target : Dependency of DriversMainController

import { DriversMainController } from "../controllers/DriversMainController";
import { DriversMainService } from "../services/DriversMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "./utils";

describe.skip("DriversMainController TestsCases", () => {
  let driversMainService: DriversMainService;
  let driversMainController: DriversMainController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    driversMainService = new DriversMainService({} as Knex);
    driversMainService.getDriverInfo = jest.fn(() =>
      Promise.resolve([{ first_name: "Julia" }])
    );

    driversMainService.getDistricts = jest.fn(() =>
      Promise.resolve([
        {
            pick_up_district: "北區",
            deliver_district: "南區",
        },
      ])
    );

    driversMainService.getAllOrders = jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          pick_up_district: "北區",
          deliver_district: "南區",
          pick_up_date: "2023-03-01",
          pick_up_time: "11:03:00",
          animals_name: ["dog", "cat"],
          animals_amount: [1, 4],
          orders_status: "訂單待接中",
        },
      ])
    );

    driversMainService.getAcceptOrders = jest.fn();
    driversMainService.getDriverEarns = jest.fn();
    driversMainService.getOrdersHistory = jest.fn();
    driversMainService.getSingleHistory = jest.fn();
    driversMainService.getOngoingOrders = jest.fn();
    driversMainService.getDriverDelivering = jest.fn();
    driversMainService.confirmAcceptOrder = jest.fn();
    driversMainService.message = jest.fn();

    driversMainController = new DriversMainController(driversMainService);

    req = getRequest();
    res = getResponse();
  });

  it("get driver info success", async () => {
    await driversMainController.getDriverInfo(req, res);

    expect(driversMainService.getDriverInfo).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ first_name: "Julia" }]);
  });

  it("get district success", async () => {
    await driversMainController.getDistricts(req, res);

    expect(driversMainService.getDistricts).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        pick_up_district: "北區",
        deliver_district: "南區",
      },
    ]);
  });

  it("get all orders success", async () => {
    await driversMainController.getAllOrders(req, res);

    expect(driversMainService.getAllOrders).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 1,
        pick_up_district: "北區",
        deliver_district: "南區",
        pick_up_date: "2023-03-01",
        pick_up_time: "11:03:00",
        animals_name: ["dog", "cat"],
        animals_amount: [1, 4],
        orders_status: "訂單待接中",
      },
    ]);
  });

  it("get accept order",async () => {
    await driversMainController.getAcceptOrders(req, res);
  })
});
