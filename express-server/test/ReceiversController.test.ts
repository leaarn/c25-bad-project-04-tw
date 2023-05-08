import { ReceiversController } from "../controllers/ReceiversController";
import { ReceiversService } from "../services/ReceiversService";
import { getRequest, getResponse } from "./utils";
import express from "express";
let req: express.Request;
let res: express.Response;
let receiversService: ReceiversService;
let receiversController: ReceiversController;

describe.only("test receivers controller", () => {
  beforeEach(() => {
    req = getRequest();
    res = getResponse();
  });

  test("checkToken", async () => {
    (req.body as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        token: "abc123",
      })
    );
    await receiversController.checkTokenControl(req, res);

    expect(receiversService.checkToken).toBeCalledWith("abc123");
    expect(receiversService.checkToken).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith([{ message: "successful" }]);
  });
});
