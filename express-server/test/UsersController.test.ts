import { Knex } from "knex";
import { UsersController } from "../controllers/UsersController";
import { UsersService } from "../services/UsersService";
import { getRequest, getResponse } from "./utils";
// import type { Request, Response } from "express";
import express from "express";
let req: express.Request;
let res: express.Response;

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

  test("login", async () => {
    const usersService = new UsersService({} as Knex);
    usersService.login = jest.fn(async () =>
      Promise.resolve([
        {
          email: "string",
          id: 1,
          first_name: "aaa",
          password: "string",
        },
      ])
    );
    const testSubject = new UsersController(usersService);
    req.body = { usersEmail: "test", password: "test" };
    await testSubject.loginControl(req, res);

    expect(usersService.login).toBeCalledTimes(1);
    expect(usersService.login).toBeCalledWith("test", "test");
    expect(res.json).toBeCalledWith("login success!");
  });
});
