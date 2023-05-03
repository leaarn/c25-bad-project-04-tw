import { usersLogin } from "../model";
import { createUsers } from "../model";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { body, validationResult } from "express-validator";
import type { Knex } from "knex";

export class UsersService {
  constructor(private knex: Knex) {}

  login = async (usersEmail: string, password: string) => {
    try {
      if (!usersEmail || !password) {
        throw new Error("missing username or password");
      }

      const foundUser = await this.knex<usersLogin>("users")
        .select("id", "first_name", "email", "password")
        .where("email", usersEmail)
        .first();
      return foundUser;
      
    } catch (error) {}
  };

  loginGoogle = async (result: any) => {
    try {
    } catch (error) {}
  };
}
