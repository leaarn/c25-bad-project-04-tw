// Testing target: DriversMainController
// Mock target : Dependency of DriversMainController

import { DriversMainController } from "../controllers/DriversMainController";
import { DriversMainService } from "../services/DriversMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "./utils";

describe("UsersMainController TestsCases", () => {
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
            pick_up_district: "Western",
            deliver_district: "Eastern",
        },
      ])
    );

    driversMainService.payOrder = jest.fn(() =>
      Promise.resolve([
        {
          pick_up_date_time: "2023-03-01 11:03:00",
          pick_up_address: "sgf sv vv rgerg 南區",
          deliver_address: "rge rgerg rgreg rgerg 東區",
          animals_name: ["dog", "cat"],
          animals_amount: [1, 4],
          remarks: "grgerger",
          distance_km: 20,
          id: 25,
          distance_total_price: 200,
          animals_total_price: "200",
          total_price: "400",
        },
      ])
    );

    driversMainService.confirmOrder = jest.fn();

    driversMainController = new DriversMainController(driversMainService);

    req = getRequest();
    res = getResponse();
  });

  it("get driver info success", async () => {
    await driversMainController.getDriverInfo(req, res);

    expect(driversMainService.getDriverInfo).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ first_name: "Julia" }]);
  });

  it("get default address success", async () => {
    await driversMainController.getDistricts(req, res);

    expect(driversMainService.getDistricts).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        default_district: "Eastern",
        default_room: "Room 109",
        default_floor: "1/F",
        default_building: "Cityplaza",
        default_street: "18 Tai Koo Shing Rd",
      },
    ]);
  });

  it("get create order success", async () => {
    (req.body as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        animals_amount: ["1", "4"],
        animals_id: ["2", "1"],
        deliver_building: "rgreg",
        deliver_district: "東區",
        deliver_floor: "rgerg",
        deliver_room: "rge",
        deliver_street: "rgerg",
        pick_up_building: "vv",
        pick_up_date: "2023-03-01",
        pick_up_district: "南區",
        pick_up_floor: "sv",
        pick_up_room: "sgf",
        pick_up_street: "rgerg",
        pick_up_time: "11:03",
        receiver_contact: "12345678",
        receiver_name: "sgerge",
        remarks: "grgerger",
      })
    );
    await usersMainController.createOrder(req, res);

    expect(usersMainService.createOrder).toBeCalledWith(
      ["1", "4"],
      ["2", "1"],
      "rgreg",
      "東區",
      "rgerg",
      "rge",
      "rgerg",
      "vv",
      "2023-03-01",
      "南區",
      "sv",
      "sgf",
      "rgerg",
      "11:03",
      "12345678",
      "sgerge",
      "grgerger"
    );
    expect(usersMainService.createOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ message: "create order success" }]);
  });

  it("get order to pay details success", async () => {
    await usersMainController.payOrder(req, res);

    expect(usersMainService.payOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        pick_up_date_time: "2023-03-01 11:03:00",
        pick_up_address: "sgf sv vv rgerg 南區",
        deliver_address: "rge rgerg rgreg rgerg 東區",
        animals_name: ["dog", "cat"],
        animals_amount: [1, 4],
        remarks: "grgerger",
        distance_km: 20,
        id: 25,
        distance_total_price: 200,
        animals_total_price: "200",
        total_price: "400",
      },
    ]);
  });
});
