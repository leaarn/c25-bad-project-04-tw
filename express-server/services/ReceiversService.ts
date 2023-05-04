import type { Knex } from "knex";
import { OrdersRow } from "../model";
export class ReceiversService {
  constructor(private knex: Knex) {}

  checkToken = async (input: string) => {
    const foundToken = await this.knex<OrdersRow>("orders")
      .select("id", "token")
      .where("token", input)
      .first();

    if (foundToken) {
      await this.knex<OrdersRow>("orders")
        .where("token", "=", input)
        .update("orders_status", "已完成");
      return foundToken;
    }
    return foundToken;
  };
}
