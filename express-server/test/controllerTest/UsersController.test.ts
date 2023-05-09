import { Knex } from "knex";
import { UsersController } from "../../controllers/UsersController";
import { UsersService } from "../../services/UsersService";
import {usersLogin } from "../../model";
// import { driversLogin } from "../model";
// import { getRequest, getResponse } from "./utils";
// import type { Request, Response } from "express";
import express from "express";

describe.skip("test auth controller", () => {
  let req: express.Request;
  let res: express.Response;
  let usersService: UsersService;
  // let usersController: UsersController;

  beforeEach(() => {
    usersService = new UsersService({} as Knex);
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

  test("login success", async () => {
    // arrangement
    const foundUser: usersLogin = {
      id: 1,
      first_name: "Julia",
      email: "abc@gmail.com",
      password: "123abc",
    };
    usersService.login = jest.fn(
      async (usersEmail: string, password: string) => {
        return foundUser;
      }
    );
    const testSubject = new UsersController(usersService);
    req.body = { usersEmail: "abc@gmail.com", password: "123abc" };
    // act
    await testSubject.loginControl(req, res);
    // assert
    expect(usersService.login).toBeCalledTimes(1);
    expect(usersService.login).toBeCalledWith("abc@gmail.com", "123abc");
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      message: "login success!",
    });
    expect(req.session.userIsLoggedIn).toBe(true);
    expect(req.session.users_id).toBe(foundUser.id);
  });

  // test("createAccount", async () => {
  //   req.body = {
  //     lastName: "Julia",
  //     firstName: "Wong",
  //     title: "Miss",
  //     email: "abc@gmail.com",
  //     password: "abc12",
  //     contactNum: "123123",
  //     defaultDistrict: "東區",
  //     defaultRoom: "123123",
  //     defaultFloor: "123123",
  //     defaultBuilding: "123123",
  //     defaultStreet: "123123",
  //   };req.session.users_id = 1;

  //   await usersController.createAccountControl(req, res);

  //   expect(usersService.createAccount).toBeCalledWith(
  //     "Julia",
  //     "Wong",
  //     "Miss",
  //     "abc@gmail.com",
  //     "abc12",
  //     "123123",
  //     "東區",
  //     "123123",
  //     "123123",
  //     "123123",
  //     "123123"
  //   );
  //   expect(usersService.createAccount).toBeCalledTimes(1);
  //   expect(res.json).toBeCalledWith([{ message: "successful" }]);
  // });
});
