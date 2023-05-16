import { ReceiversController } from "../../controllers/ReceiversController";
import { ReceiversService } from "../../services/ReceiversService";
import { getRequest, getResponse } from "../utils";
import express from "express";
import { Knex } from "knex";
let req: express.Request;
let res: express.Response;
let receiversService: ReceiversService;
// let receiversController: ReceiversController;

describe("test receivers controller", () => {
  beforeEach(() => {
    req = getRequest();
    res = getResponse();
    receiversService = new ReceiversService({} as Knex);
  });

  test("checkToken", async () => {
    const foundToken = {
      id:1,
      token: "123",
    };
    receiversService.checkToken = jest.fn(async (token) => {
      return foundToken;
    });

    const testSubject = new ReceiversController(receiversService);

    req.body = {
      token: "123",
    };

    await testSubject.checkTokenControl(req, res);

    expect(receiversService.checkToken).toBeCalledWith("123");
    expect(receiversService.checkToken).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ message: "successful!" });
  });
});
