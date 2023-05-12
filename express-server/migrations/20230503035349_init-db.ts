import { Knex } from "knex";

export const userTable = "users";
export const driverTable = "drivers";
export const orderTable = "orders";
export const paymentTable = "payment_method";
export const animalTable = "animals";
export const orderAnimalTable = "order_animals";
export const uploadTable = "upload";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(userTable, (table) => {
    table.increments('id').primary(); // id
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
    table.increments('id').primary(); // id
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
    table.increments('id').primary(); // id
    table.date("pick_up_date");
    table.time("pick_up_time");
    table.string("pick_up_district");
    table.string("pick_up_room");
    table.string("pick_up_floor");
    table.string("pick_up_building");
    table.string("pick_up_street");
    table.string("pick_up_coordinates");
    table.string("deliver_district");
    table.string("deliver_room");
    table.string("deliver_floor");
    table.string("deliver_building");
    table.string("deliver_street");
    table.string("deliver_coordinates");
    table.integer("users_id").unsigned();
    table.foreign("users_id").references("users.id");
    table.integer("drivers_id");
    table.foreign("drivers_id").references("drivers.id");
    table.string("receiver_name");
    table.integer("receiver_contact");
    table.integer("distance_km");
    table.integer("distance_price").notNullable().defaultTo("10");
    table
      .uuid("reference_code")
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.string("orders_status").notNullable().defaultTo("not pay yet");
    table.string("token");
    table.string("remarks");
    table.timestamps(false, true); // created_at, updated_at
  });

  await knex.schema.createTable(paymentTable, (table) => {
    table.increments('id').primary(); // id
    table.string("method").notNullable().defaultTo("VISA");
  });

  await knex.schema.createTable(animalTable, (table) => {
    table.increments('id').primary(); // id
    table.string("animals_name").notNullable();
    table.integer("price").notNullable();

  });

  const animal =  await knex("animals")
  .insert([{
    animals_name:"貓",
    price:40
  },{
    animals_name:"狗",
    price:40
  },{
    animals_name:"家禽或鳥類",
    price:30},
    {
    animals_name:"馬",
    price:40
  },{
    animals_name:"羊",
    price:40
  },{
    animals_name:"牛",
    price:40
  },{
    animals_name:"大象",
    price:40
  },{
    animals_name:"熊",
    price:40
  },{
    animals_name:"斑馬",
    price:40
  },{
    animals_name:"長頸鹿",
    price:40
  }])

  console.log("migrateanimal",animal)
  await knex.schema.createTable(orderAnimalTable, (table) => {
    table.increments('id').primary(); // id
    table.integer("orders_id")
    table.foreign("orders_id").references("orders.id");
    table.integer("animals_id")
    table.foreign("animals_id").references("animals.id");
    table.integer("animals_amount").notNullable();
    table.integer("animals_history_price").notNullable();
    table.boolean("is_AI").defaultTo(false)
    table.integer("AI_rating",1-5)
  });

  await knex.schema.createTable(uploadTable, (table) => {
    table.increments('id').primary(); // id
    table.string("image");
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(uploadTable);
  await knex.schema.dropTableIfExists(orderAnimalTable);
  await knex.schema.dropTableIfExists(animalTable);
  await knex.schema.dropTableIfExists(paymentTable);
  await knex.schema.dropTableIfExists(orderTable);
  await knex.schema.dropTableIfExists(driverTable);
  await knex.schema.dropTableIfExists(userTable);
}
