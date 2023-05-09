// import { Knex } from "knex";
import { DriversController } from "../controllers/DriversController";
import { DriversService } from "../services/DriversService";
import { getRequest, getResponse } from "./utils";
// import type { Request, Response } from "express";
import express from "express";
let req: express.Request;
let res: express.Response;
let driversService: DriversService;
let driversController: DriversController;

describe.skip("test auth controller", () => {
  beforeEach(() => {
    req = getRequest();
    res = getResponse();
  });

//   test("login", async () => {
//     const driversService = new DriversService({} as Knex);
//     driversService.login = jest.fn(
//       async (usersEmail: "test", password: "test") => {
//         //  return true;
//       }
//     );
//     const testSubject = new DriversController(driversService);
//     // req.body = { usersEmail: "test", password: "test" };
//     await testSubject.loginControl(req, res);

//     expect(driversService.login).toBeCalledTimes(1);
//     expect(driversService.login).toBeCalledWith("test", "test");
//     expect(res.json).toBeCalledWith("login success!");
//   });


  test("createAccount", async () => {
    (req.body as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        last_name: "Julia",
        first_name: "iWong",
        title: "Miss",
        email: "abd@gmail.com",
        password: "123abc",
        contact_num: "12345",
        car_license_num: "12345",
        car_type: "van",
      })
    );
    await driversController.createAccountControl(req, res);

    expect(driversService.createAccount).toBeCalledWith(
        "Julia",
        "iWong",
        "Miss",
        "abd@gmail.com",
        "123abc",
        "12345",
        "12345",
        "van",
    );
    expect(driversService.createAccount).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ message: "successful" }]);
  });
});
