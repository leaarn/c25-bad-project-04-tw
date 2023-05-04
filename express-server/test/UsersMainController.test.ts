// Testing target: UsersMainController
// Mock target : Dependency of UsersMainController

import { UsersMainController } from "../controllers/usersMainController";
import { UsersMainService } from "../services/UsersMainService";
import { Knex } from "knex";
import type { Request, Response } from "express";
import { getRequest, getResponse } from "./utils";

describe("UsersMainController TestsCases", ()=>{
    let usersMainService: UsersMainService;
    let usersMainController: UsersMainController;
    let req:Request;
    let res: Response;

    beforeEach(() =>{
        usersMainService = new UsersMainService({} as Knex)
        usersMainService.getUserInfo = jest.fn(()=>
            Promise.resolve([{"first_name": "Julia"}]))
            
            usersMainController = new UsersMainController(usersMainService)

            req = getRequest();
            res = getResponse();

        })

    it("get userInfo success", async () =>{
       await  usersMainController.getUserInfo(req,res)

       expect(usersMainService.getUserInfo).toBeCalledTimes(1)
       expect(res.json).toBeCalledWith([{"first_name": "Julia"}])
    })
})

