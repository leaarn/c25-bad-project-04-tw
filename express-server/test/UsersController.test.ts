import { Knex } from "knex";
import { UsersController } from "../controllers/UsersController";
import { UsersService } from "../services/UsersService";
// import { getRequest, getResponse } from "./utils";
// import type { Request, Response } from "express";
import express from "express";
let req: express.Request;
let res: express.Response;
let usersService: UsersService;
let usersController: UsersController;

describe.only("test auth controller", () => {
  beforeEach(() => {
    req = {
      params: {},
      body: {},
      session: {},
    } as express.Request;

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as any as express.Response;
  });

  // test("login", async () => {
  //   const usersService = new UsersService({} as Knex);
  //   usersService.login = jest.fn(
  //     async (usersEmail: "test", password: "test") => {
  //        return true;
  //     }
  //   );

  //   const testSubject = new UsersController(usersService);
  //   // req.body = { usersEmail: "test", password: "test" };
  //   await testSubject.loginControl(req, res);

  //   expect(usersService.login).toBeCalledTimes(1);
  //   expect(usersService.login).toBeCalledWith("test", "test");
  //   expect(res.json).toBeCalledWith("login success!");
  // });

  test("loginGoogle", async () => {
    const usersService = new UsersService({} as Knex);
    usersService.loginGoogle = jest.fn(async () => {
      return true;
    });

    const testSubject = new UsersController(usersService);
    req.body = { usersEmail: "test", password: "test" };
    await testSubject.loginControl(req, res);

    expect(usersService.login).toBeCalledTimes(1);
    expect(usersService.login).toBeCalledWith("test", "test");
    // expect(res.json).toBeCalledWith("login success!");
  });

  test("createAccount", async () => {
    (req.body as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        last_name: "Julia",
        first_name: "Wong",
        title: "Miss",
        email: "abc@gmail.com",
        password: "abc12",
        contact_num: "123123",
        default_district: "東區",
        default_room: "123123",
        default_floor: "123123",
        default_building: "123123",
        default_street: "123123",
      })
    );
    await usersController.createAccountControl(req, res);

    expect(usersService.createAccount).toBeCalledWith(
      "Julia",
      "Wong",
      "Miss",
      "abc@gmail.com",
      "abc12",
      "123123",
      "東區",
      "123123",
      "123123",
      "123123",
      "123123"
    );
    expect(usersService.createAccount).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ message: "successful" }]);
  });
});
