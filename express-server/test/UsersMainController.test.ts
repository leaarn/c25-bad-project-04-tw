// Testing target: UsersMainController
// Mock target : Dependency of UsersMainController

import { UsersMainController } from "../controllers/usersMainController";
import { UsersMainService } from "../services/UsersMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "./utils";

describe("UsersMainController TestsCases", () => {
  let usersMainService: UsersMainService;
  let usersMainController: UsersMainController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    usersMainService = new UsersMainService({} as Knex);
    usersMainService.getUserInfo = jest.fn(() =>
      Promise.resolve([{ first_name: "Julia" }])
    );

    usersMainService.getAddress = jest.fn(() =>
      Promise.resolve([
        {
          default_district: "Eastern",
          default_room: "Room 109",
          default_floor: "1/F",
          default_building: "Cityplaza",
          default_street: "18 Tai Koo Shing Rd",
        },
      ])
    );

    usersMainService.payOrder = jest.fn(() =>
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

    usersMainService.confirmOrder = jest.fn();

    usersMainController = new UsersMainController(usersMainService);

    req = getRequest();
    res = getResponse();
  });

  it("get userInfo success", async () => {
    await usersMainController.getUserInfo(req, res);

    expect(usersMainService.getUserInfo).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ first_name: "Julia" }]);
  });

  it("get default address success", async () => {
    await usersMainController.getAddress(req, res);

    expect(usersMainService.getAddress).toBeCalledTimes(1);
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
        remarks: "grgerger"
      })
    );
    await usersMainController.createOrder(req, res);

    expect(usersMainService.createOrder).toBeCalledWith(["1", "4"],["2", "1"],"rgreg","東區","rgerg","rge","rgerg","vv","2023-03-01","南區","sv","sgf","rgerg","11:03","12345678","sgerge","grgerger")
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
