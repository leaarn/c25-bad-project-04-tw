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

        usersMainService.getAddress = jest.fn(()=>
            Promise.resolve([{
                "default_district": "Eastern",
                "default_room": "Room 109",
                "default_floor": "1/F",
                "default_building": "Cityplaza",
                "default_street": "18 Tai Koo Shing Rd"
            }]))

        usersMainService.payOrder = jest.fn(()=>
            Promise.resolve([{
                "pick_up_date_time": "2023-03-01 11:03:00",
                "pick_up_address": "sgf sv vv rgerg 南區",
                "deliver_address": "rge rgerg rgreg rgerg 東區",
                "animals_name": [
                    "dog",
                    "cat"
                ],
                "animals_amount": [
                    1,
                    4
                ],
                "remarks": "grgerger",
                "distance_km": 20,
                "id": 25,
                "distance_total_price": 200,
                "animals_total_price": "200",
                "total_price": "400"
            }])
        )

        usersMainService.confirmOrder = jest.fn()
            
            usersMainController = new UsersMainController(usersMainService)

            req = getRequest();
            res = getResponse();

        })

    it("get userInfo success", async () =>{
       await  usersMainController.getUserInfo(req,res)

       expect(usersMainService.getUserInfo).toBeCalledTimes(1)
       expect(res.json).toBeCalledWith([{"first_name": "Julia"}])
    })

    it("get default address success", async () =>{
       await  usersMainController.getAddress(req,res)

       expect(usersMainService.getAddress).toBeCalledTimes(1)
       expect(res.json).toBeCalledWith([{
        "default_district": "Eastern",
        "default_room": "Room 109",
        "default_floor": "1/F",
        "default_building": "Cityplaza",
        "default_street": "18 Tai Koo Shing Rd"
    }])
    })

    
    it("get order to pay details success", async () =>{
        await  usersMainController.payOrder(req,res)
 
        expect(usersMainService.payOrder).toBeCalledTimes(1)
        expect(res.json).toBeCalledWith([{
            "pick_up_date_time": "2023-03-01 11:03:00",
            "pick_up_address": "sgf sv vv rgerg 南區",
            "deliver_address": "rge rgerg rgreg rgerg 東區",
            "animals_name": [
                "dog",
                "cat"
            ],
            "animals_amount": [
                1,
                4
            ],
            "remarks": "grgerger",
            "distance_km": 20,
            "id": 25,
            "distance_total_price": 200,
            "animals_total_price": "200",
            "total_price": "400"
        }])
     })

})

