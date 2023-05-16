// Testing target: UsersMainController
// Mock target : Dependency of UsersMainController

import { UsersMainController } from "../../controllers/usersMainController";
import { UsersMainService } from "../../services/UsersMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "../utils";
import { randomToken} from "../../controllers/utils";
import * as RandomDistance from '../../controllers/random'

jest.mock("../../controllers/utils");

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
    usersMainService.createOrder = jest.fn();
    usersMainService.aiCreateOrder = jest.fn();

    usersMainService.payOrderDetails = jest.fn(() =>
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
    usersMainService.orderStatus = jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          created_at: "2023-03-29 09:30:00",
          pick_up_address: "Room 109 1/F Cityplaza 18 Tai Koo Shing Rd 東區 ",
          deliver_address: "Room 210 2/F Times Square 1 Matheson St 灣仔區",
          pick_up_date_time: "2023-03-29 10:00:00",
          animals_name: ["鴨"],
          animals_amount: [1],
          remarks: "my dog is very cute",
          orders_status: "訂單待接中",
          reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
          drivers_id: null,
        },
      ])
    );
    usersMainService.orderStatusDetails = jest.fn(() =>
      Promise.resolve([
        {
          full_name: "Miss Yannes Chow",
          contact_num: 51170071,
          car_license_num: "YC 1234",
        },
      ])
    );
    usersMainService.historyOrders = jest.fn(() =>
      Promise.resolve([
        {
          id: 4,
          reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
          orders_status: "已完成",
          animals_name: ["狗"],
          animals_amount: [4],
        },
      ])
    );
    usersMainService.historyOrderDetails = jest.fn(() =>
      Promise.resolve([
        {
          id: 4,
          reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
          created_at: "2023-03-30 09:30:00",
          orders_status: "已完成",
          pick_up_address: "Flat 11D 11/F Nina Mall No.8 Yeung Uk Rd 荃灣區",
          deliver_address:
            "Room 209 2/F Maritime Square 33 Tsing King Rd 葵青區",
          pick_up_date_time: "2023-03-30 11:00:00",
          animals_name: ["狗"],
          animals_amount: [4],
          remarks: "thx driver",
        },
      ])
    );

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

  //create order
  it("get create order success", async () => {
    req.body = {
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
      token: "Z58A39",
    };
    req.session.users_id = 1;


    const spy_1 = jest.spyOn(RandomDistance,'randomDistance');
    // usersMainController.randomDistance = jest.fn(() => {
    //   return 75;
    // });

    // (randomDistance as jest.Mock).mockReturnValue(75)
    (randomToken as jest.Mock).mockReturnValue("Z58A39");
    // usersMainController.randomToken = jest.fn(() => {
    //   return "Z58A39";
    // });

    await usersMainController.createOrder(req, res);

    let check = spy_1.mock.results[0]
    console.log("spy on random distance fucntion to get the value",check.value)
    
    expect(usersMainService.createOrder).toBeCalledWith({
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
      distance_km: check.value,
      token: "Z58A39",
      users_id: 1,
    });
    expect(usersMainService.createOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "create order success" });
  });

  //payorder details
  it("get order to pay details success", async () => {
    req.session.users_id = 1;

    await usersMainController.payOrderDetails(req, res);

    expect(usersMainService.payOrderDetails).toBeCalledWith(1);
    expect(usersMainService.payOrderDetails).toBeCalledTimes(1);
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

  //confirmOrder

  it("confirmOrder success", async () => {
    req.body = {
      orderId: 1,
    };
    req.session.users_id = 1;

    await usersMainController.confirmOrder(req, res);

    expect(usersMainService.confirmOrder).toBeCalledWith(1, 1);

    expect(usersMainService.confirmOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "paid" });
  });

  //not complete status
  it("show order status success", async () => {
    req.session.users_id = 1;

    await usersMainController.orderStatus(req, res);

    expect(usersMainService.orderStatus).toBeCalledWith(1);
    expect(usersMainService.orderStatus).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 1,
        created_at: "2023-03-29 09:30:00",
        pick_up_address: "Room 109 1/F Cityplaza 18 Tai Koo Shing Rd 東區 ",
        deliver_address: "Room 210 2/F Times Square 1 Matheson St 灣仔區",
        pick_up_date_time: "2023-03-29 10:00:00",
        animals_name: ["鴨"],
        animals_amount: [1],
        remarks: "my dog is very cute",
        orders_status: "訂單待接中",
        reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
        drivers_id: null,
      },
    ]);
  });
  //not complete order details
  it("show order details success", async () => {
    req.session.users_id = 1;
    req.params.oid = (7).toString();

    await usersMainController.orderStatusDetails(req, res);

    expect(usersMainService.orderStatusDetails).toBeCalledWith(1, 7);
    expect(usersMainService.orderStatusDetails).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        full_name: "Miss Yannes Chow",
        contact_num: 51170071,
        car_license_num: "YC 1234",
      },
    ]);
  });
  //ongoing order oid not a number
  it("oid not a number", async () => {
    req.session.users_id = 1;
    req.params.oid = "aaa";

    await usersMainController.orderStatusDetails(req, res);

    expect(usersMainService.orderStatusDetails).toBeCalledTimes(0);
    expect(res.json).toBeCalledWith({ message: "invalid order id" });
  });
  //not complete status
  it("show historyOrders status success", async () => {
    req.session.users_id = 1;

    await usersMainController.historyOrders(req, res);

    expect(usersMainService.historyOrders).toBeCalledWith(1);
    expect(usersMainService.historyOrders).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 4,
        reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
        orders_status: "已完成",
        animals_name: ["狗"],
        animals_amount: [4],
      },
    ]);
  });
  //not complete order details
  it("show historyOrderDetails success", async () => {
    req.session.users_id = 1;
    req.params.oid = (7).toString();

    await usersMainController.historyOrderDetails(req, res);

    expect(usersMainService.historyOrderDetails).toBeCalledWith(1, 7);
    expect(usersMainService.historyOrderDetails).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([
      {
        id: 4,
        reference_code: "917542c7-7c2e-4a2d-a256-199b17e7261b",
        created_at: "2023-03-30 09:30:00",
        orders_status: "已完成",
        pick_up_address: "Flat 11D 11/F Nina Mall No.8 Yeung Uk Rd 荃灣區",
        deliver_address: "Room 209 2/F Maritime Square 33 Tsing King Rd 葵青區",
        pick_up_date_time: "2023-03-30 11:00:00",
        animals_name: ["狗"],
        animals_amount: [4],
        remarks: "thx driver",
      },
    ]);
  });

  //history order oid not a number
  it("oid not a number", async () => {
    req.session.users_id = 1;
    req.params.oid = "aaa";

    await usersMainController.historyOrderDetails(req, res);

    expect(usersMainService.historyOrderDetails).toBeCalledTimes(0);
    expect(res.json).toBeCalledWith({ message: "invalid order id" });
  });


  // Julia

  it("get create ai order success", async () => {
    req.body = {
      animals_amount: [1, 4],
      animals_id: [2, 1],
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
      AI_rating: [4],
      is_AI: "true",
    };
    req.session.users_id = 1;

    // usersMainController.randomDistance = jest.fn(() => {
    //   return 75;
    // });

    // (randomDistance as jest.Mock).mockReturnValue(75)
    (randomToken as jest.Mock).mockReturnValue("Z58A39");
    // usersMainController.randomToken = jest.fn(() => {
    //   return "Z58A39";
    // });

    const spy_2 = jest.spyOn(RandomDistance,'randomDistance');

    await usersMainController.aiCreateOrderController(req, res);

   
    let check = spy_2.mock.results[0]
    console.log("spy on random distance fucntion to get the value",check.value)
    
    expect(usersMainService.aiCreateOrder).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "create order success" });
  });

  
  //Julia
});
