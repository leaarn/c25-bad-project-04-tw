import { Knex } from "knex";
import { UsersController } from "../../controllers/UsersController";
import { UsersService } from "../../services/UsersService";
import {usersLogin } from "../../model";
import express from "express";

describe("test auth controller", () => {
  let req: express.Request;
  let res: express.Response;
  let usersService: UsersService;

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

});
