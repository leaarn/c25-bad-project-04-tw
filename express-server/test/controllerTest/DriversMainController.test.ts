// Testing target: DriversMainController
// Mock target : Dependency of DriversMainController

import { DriversMainController } from "../../controllers/DriversMainController";
import { DriversMainService } from "../../services/DriversMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "../utils";

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
          id: 6,
          pick_up_district: "北區",
          deliver_district: "深水埗區 ",
          pick_up_date: "2023-03-29T16:00:00.000Z",
          pick_up_time: "12:00:00",
          animals_name: ["貓"],
          animals_amount: [5],
          orders_status: "訂單待接中",
        },
      ])
    );

    driversMainService.getAcceptOrders = jest.fn(() =>
      Promise.resolve(
        {rows:[{
          id: 1,
          user_full_name: "Miss Julia Wong",
          contact_num: 51170071,
          receiver_contact: 51170071,
          pick_up_date_time: "2023-03-29 10:00:00",
          pick_up_address: "Room 109 1/F Cityplaza 18 Tai Koo Shing Rd 東區 ",
          deliver_address: "Room 210 2/F Times Square 1 Matheson St 灣仔區",
          animals_name: ["鴨"],
          animals_amount: [1],
          remarks: "my dog is very cute",
          orders_status: "訂單待接中",
        }]}
      )
    );

    driversMainService.getDriverEarns = jest.fn(() =>
      Promise.resolve({rows:[
        {
          distance_km: 20,
          distance_total_price: 200,
          animals_name: ["鴨"],
          animals_amount: [1],
          animals_total_price: "30",
          total_price: "230",
          platform_fee: "46.0",
          driver_earns: "184.0",
        },
      ]})
    );

    driversMainService.getOrdersHistory = jest.fn(() =>
      Promise.resolve({rows:[
        {
          id: 5,
          reference_code: "bf54a164-46ee-45ec-a776-6e690994b191",
          orders_status: "已完成",
          animals_name: ["海洋生物"],
          animals_amount: [1],
        },
      ]})
    );
    driversMainService.getSingleHistory = jest.fn(() =>
      Promise.resolve({rows:[
        {
          id: 4,
          reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
          orders_status: "已完成",
          pick_up_date_time: "2023-03-30 11:00:00",
          pick_up_address: "Flat 11D 11/F Nina Mall No.8 Yeung Uk Rd 荃灣區",
          deliver_address:
            "Room 209 2/F Maritime Square 33 Tsing King Rd 葵青區",
          animals_name: ["狗"],
          animals_amount: [4],
          remarks: "thx driver",
        },
      ]})
    );
    driversMainService.getOngoingOrders = jest.fn(() =>
      Promise.resolve({rows:[
        {
          id: 7,
          reference_code: "6eac846d-763d-4552-8fbc-54464015d109",
          user_full_name: "Miss Julia Wong",
          contact_num: 51170071,
          pick_up_date_time: "2023-03-31 13:00:00",
          pick_up_address: "Room 6C 6/F Sol City 1 Ma Wang Rd 元朗區",
          deliver_address:
            "Room 13A 13/F Yee Nga Court Block A Yee Lai House On Po Rd 大埔區",
          animals_name: ["雞"],
          animals_amount: [1],
          remarks: "Help to carry upstairs",
          orders_status: "司機已接單",
        },
      ]})
    );
    driversMainService.updateDriverDelivering = jest.fn();
    driversMainService.confirmAcceptOrder = jest.fn();

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
    // expect(driversMainService.getAllOrders).toBeCalledWith(1);
    expect(res.json).toBeCalledWith([
      {
        id: 6,
        pick_up_district: "北區",
        deliver_district: "深水埗區 ",
        pick_up_date: "2023-03-29T16:00:00.000Z",
        pick_up_time: "12:00:00",
        animals_name: ["貓"],
        animals_amount: [5],
        orders_status: "訂單待接中",
      },
    ]);
  });

  it("get accept order success", async () => {
    req.params.oid = (1).toString();
    await driversMainController.getAcceptOrders(req, res);
    expect(driversMainService.getAcceptOrders).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 1,
        user_full_name: "Miss Julia Wong",
        contact_num: 51170071,
        receiver_contact: 51170071,
        pick_up_date_time: "2023-03-29 10:00:00",
        pick_up_address: "Room 109 1/F Cityplaza 18 Tai Koo Shing Rd 東區 ",
        deliver_address: "Room 210 2/F Times Square 1 Matheson St 灣仔區",
        animals_name: ["鴨"],
        animals_amount: [1],
        remarks: "my dog is very cute",
        orders_status: "訂單待接中",
      },
    ]);
  });

  it("get driver earns success", async () => {
    req.params.oid = (1).toString();
    await driversMainController.getDriverEarns(req, res);

    expect(driversMainService.getDriverEarns).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        distance_km: 20,
        distance_total_price: 200,
        animals_name: ["鴨"],
        animals_amount: [1],
        animals_total_price: "30",
        total_price: "230",
        platform_fee: "46.0",
        driver_earns: "184.0",
      },
    ]);
  });

  it("get order history success", async () => {
    await driversMainController.getOrdersHistory(req, res);

    expect(driversMainService.getOrdersHistory).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 5,
        reference_code: "bf54a164-46ee-45ec-a776-6e690994b191",
        orders_status: "已完成",
        animals_name: ["海洋生物"],
        animals_amount: [1],
      },
    ]);
  });

  it("get single history success", async () => {
    req.params.oid = (1).toString();
    await driversMainController.getSingleHistory(req, res);

    expect(driversMainService.getSingleHistory).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 4,
        reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
        orders_status: "已完成",
        pick_up_date_time: "2023-03-30 11:00:00",
        pick_up_address: "Flat 11D 11/F Nina Mall No.8 Yeung Uk Rd 荃灣區",
        deliver_address: "Room 209 2/F Maritime Square 33 Tsing King Rd 葵青區",
        animals_name: ["狗"],
        animals_amount: [4],
        remarks: "thx driver",
      },
    ]);
  });

  it("get ongoing orders success", async () => {
    await driversMainController.getOngoingOrders(req, res);

    expect(driversMainService.getOngoingOrders).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 7,
        reference_code: "6eac846d-763d-4552-8fbc-54464015d109",
        user_full_name: "Miss Julia Wong",
        contact_num: 51170071,
        pick_up_date_time: "2023-03-31 13:00:00",
        pick_up_address: "Room 6C 6/F Sol City 1 Ma Wang Rd 元朗區",
        deliver_address:
          "Room 13A 13/F Yee Nga Court Block A Yee Lai House On Po Rd 大埔區",
        animals_name: ["雞"],
        animals_amount: [1],
        remarks: "Help to carry upstairs",
        orders_status: "司機已接單",
      },
    ]);
  });

  it("change to driver delivering status success", async () => {
    req.params.oid = (1).toString();
    req.session.drivers_id = 1;

    await driversMainController.updateDriverDelivering(req, res);

    expect(driversMainService.updateDriverDelivering).toBeCalledWith(1, 1);

    expect(driversMainService.updateDriverDelivering).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "status changed to driver delivering" });
  });

  it("confirm order success", async () => {
    req.params.oid = (1).toString();
    req.session.drivers_id = 1;

    await driversMainController.confirmAcceptOrder(req, res);

    expect(driversMainService.confirmAcceptOrder).toBeCalledWith(1, 1);

    expect(driversMainService.confirmAcceptOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "order accepted" });
  });
});
