import { Knex } from "knex";

export const userTable = "users";
export const driverTable = "drivers";
export const orderTable = "orders";
export const paymentTable = "payment_method";
export const animalTable = "animals";
export const orderAnimalTable = "order_animals";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(userTable, (table) => {
    table.increments(); // id
    table.string("last_name").notNullable();
    table.string("first_name").notNullable();
    table.string("title").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.integer("contact_num").notNullable();
    table.string("default_district").notNullable();
    table.string("default_room").notNullable();
    table.string("default_floor").notNullable();
    table.string("default_building").notNullable();
    table.string("default_street").notNullable();
    table.string("default_coordinates");
    table.timestamps(false, true); // created_at, updated_at
  });

  await knex.schema.createTable(driverTable, (table) => {
    table.increments(); // id
    table.string("last_name").notNullable();
    table.string("first_name").notNullable();
    table.string("title").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.integer("contact_num").notNullable();
    table.string("car_license_num").notNullable();
    table.string("car_type").notNullable().defaultTo("Van");
    table.timestamps(false, true); // created_at, updated_at
  });

  await knex.schema.createTable(orderTable, (table) => {
    table.increments(); // id
    table.date("pick_up_date").notNullable();
    table.time("pick_up_time").notNullable();
    table.string("pick_up_district").notNullable();
    table.string("pick_up_room").notNullable();
    table.string("pick_up_floor").notNullable();
    table.string("pick_up_building").notNullable();
    table.string("pick_up_street").notNullable();
    table.string("pick_up_coordinates");
    table.string("deliver_district").notNullable();
    table.string("deliver_room").notNullable();
    table.string("deliver_floor").notNullable();
    table.string("deliver_building").notNullable();
    table.string("deliver_street").notNullable();
    table.string("deliver_coordinates");
    table.integer("users_id").unsigned();
    table.foreign("users_id").references("users.id");
    table.integer("drivers_id").unsigned();
    table.foreign("drivers_id").references("drivers.id");
    table.string("receiver_name").notNullable();
    table.integer("receiver_contact").notNullable();
    table.integer("distance_km").notNullable();
    table.integer("distance_price").notNullable().defaultTo("10");
    table
      .uuid("reference_code")
      .notNullable()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.string("orders_status").notNullable().defaultTo("not pay yet");
    table.string("token");
    table.string("remarks");
    table.timestamps(false, true); // created_at, updated_at
  });

  await knex.schema.createTable(paymentTable, (table) => {
    table.increments(); // id
    table.string("method").notNullable().defaultTo("VISA");
  });

  await knex.schema.createTable(animalTable, (table) => {
    table.increments(); // id
    table.string("animals_name").notNullable();
    table.integer("price").notNullable();
  });

  await knex.schema.createTable(orderAnimalTable, (table) => {
    table.increments(); // id
    table.integer("orders_id").unsigned();
    table.foreign("orders_id").references("orders.id");
    table.integer("animals_id").unsigned();
    table.foreign("animals_id").references("animals.id");
    table.integer("animals_amount").notNullable();
    table.integer("animals_history_price").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(orderAnimalTable);
  await knex.schema.dropTableIfExists(animalTable);
  await knex.schema.dropTableIfExists(paymentTable);
  await knex.schema.dropTableIfExists(orderTable);
  await knex.schema.dropTableIfExists(driverTable);
  await knex.schema.dropTableIfExists(userTable);
}
