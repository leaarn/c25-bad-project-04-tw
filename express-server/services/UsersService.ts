import { usersLogin } from "../model";
import { createUsers } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import type { Knex } from "knex";
import crypto from "crypto";

export class UsersService {
  constructor(private knex: Knex) {}

  login = async (usersEmail: string, password: string) => {
    if (!usersEmail || !password) {
      throw new Error("missing username or password");
    }
    const foundUser = await this.knex<usersLogin>("users")
      .select("id", "first_name", "email", "password")
      .where("email", usersEmail)
      .first();

    if (!foundUser) {
      throw new Error("invalid username ");
    }

    if (!(await checkPassword(password, foundUser.password))) {
      throw new Error("invalid password ");
    }
    return foundUser;
  };

  loginGoogle = async (userType: string, result: any) => {
    if (userType === "user") {
      const foundUser = await this.knex("users")
        .select("id",)
        .where("email", result.email)
        .first();
      if (!foundUser) {
        const tempPass = crypto.randomBytes(20).toString("hex");
        const hashedPassword = await hashPassword(tempPass);
        const user = await this.knex("users")
          .insert({
            email: result.email,
            password: hashedPassword,
          })
          .returning(["id"]);
        return user;
      }
      return foundUser;
    } else {
      const foundDriver = await this.knex("drivers")
        .select("id")
        .where("email", result.email)
        .first();
      if (!foundDriver) {
        const tempPass = crypto.randomBytes(20).toString("hex");
        const hashedPassword = await hashPassword(tempPass);
        const driver = await this.knex("drivers")
          .insert({
            email: result.email,
            password: hashedPassword,
          })
          .returning(["id"]);
        return driver;
      }
      return foundDriver;
    }
  };

  createAccount = async (input: createUsers) => {
    const result = await this.knex<createUsers>("users")
      .select("id", "email")
      .where("email", input.email)
      .first();

    if (result) {
      throw new Error("existing users!");
    }

    const hashedPassword = await hashPassword(input.password);
    const userId = await this.knex("users")
      .insert({
        last_name: input.lastName,
        first_name: input.firstName,
        title: input.title,
        email: input.email,
        password: hashedPassword,
        contact_num: input.contactNum,
        default_district: input.defaultDistrict,
        default_room: input.defaultRoom,
        default_floor: input.defaultFloor,
        default_building: input.defaultBuilding,
        default_street: input.defaultStreet,
      })
      .returning("id");

    return userId;
  };
}
