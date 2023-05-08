import { DriversMainService } from "../services/DriversMainService";
import Knex from "knex";

const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["test"]); // Connection to the test database.

describe("DriversMainService TestsCases", () => {
    let driversMainService: DriversMainService
    
    beforeEach(async () => {
        driversMainService = new DriversMainService(knex)
    })
})