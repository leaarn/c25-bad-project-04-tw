import { usersLogin } from "../model";
import { driversLogin } from "../model";
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

  loginGoogle = async (result: any) => {
    const foundUser = await this.knex<usersLogin>("users")
      .select("id", "email", "password")
      .where("email", result.email)
      .first();

    if (!foundUser) {
      console.log("no such user, create one ");
      const tempPass = crypto.randomBytes(20).toString("hex");
      const hashedPassword = await hashPassword(tempPass);
      await this.knex<usersLogin>("users").insert({
        email: result.email,
        password: hashedPassword,
      });
    }

    const foundDriver = await this.knex<usersLogin>("drivers")
      .select("id", "email", "password")
      .where("email", result.email)
      .first();

    if (!foundDriver) {
      console.log("no such driver, create one ");
      const tempPass = crypto.randomBytes(20).toString("hex");
      const hashedPassword = await hashPassword(tempPass);
      await this.knex<driversLogin>("drivers").insert({
        email: result.email,
        password: hashedPassword,
      });
    }
    return true;
  };

  
}
