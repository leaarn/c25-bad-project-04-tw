import type {Knex} from "knex";

export class UsersMainService {
    constructor(private knex:Knex){}

    getUserInfo = async() =>{
        const queryResult = await this.knex("users").
    }

}