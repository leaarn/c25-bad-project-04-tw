import { Knex } from "knex";
import { DriversController } from "../../controllers/DriversController";
import { DriversService } from "../../services/DriversService";
import { getRequest, getResponse } from "../utils";
import { driversLogin} from "../../model"
import express from "express";
let req: express.Request;
let res: express.Response;


describe("test auth controller", () => {
  beforeEach(() => {
    req = getRequest();
    res = getResponse();
  });

 test("login success", async () => {
   // arrangement
   const driversService = new DriversService({} as Knex);
   const foundDriver: driversLogin = {
     id: 1,
     first_name: "Julia",
     email: "abc@gmail.com",
     password: "123abc",
   };
   driversService.login = jest.fn(
     async (driversEmail: string, password: string) => {
       return foundDriver;
     }
   );
   const testSubject = new DriversController(driversService);
   req.body = { driversEmail: "abc@gmail.com", password: "123abc" };
   // act
   await testSubject.loginControl(req, res);
   // assert
   expect(driversService.login).toBeCalledTimes(1);
   expect(driversService.login).toBeCalledWith("abc@gmail.com", "123abc");
   expect(res.status).toBeCalledWith(200);
   expect(res.json).toBeCalledWith({
     message: "login success",
   });
   expect(req.session.driverIsLoggedIn).toBe(true);
   expect(req.session.drivers_id).toBe(foundDriver.id);
 });

});
