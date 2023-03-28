DROP DATABASE IF EXISTS project2;
CREATE DATABASE project2;

\c project2

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_num INTEGER NOT NULL,
    default_district VARCHAR(255) NOT NULL,
    default_address VARCHAR(255) NOT NULL,
    default_coordinates POINT
);

DROP TABLE IF EXISTS drivers;
CREATE TABLE drivers (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_num INTEGER NOT NULL,
    car_license_num VARCHAR(255) NOT NULL,
    car_type VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	pick_up_date DATE,
	pick_up_time TIME(0) WITHOUT TIME ZONE NOT NULL,
    pick_up_district VARCHAR(255) NOT NULL,
    pick_up_address VARCHAR(255) NOT NULL,
    pick_up_coordinates POINT,
    deliver_district VARCHAR(255) NOT NULL, 
    deliver_address VARCHAR(255) NOT NULL,
    deliver_coordinates POINT,
    users_id INTEGER,
	FOREIGN KEY (users_id) REFERENCES users(id),
    drivers_id INTEGER,
	FOREIGN KEY (drivers_id) REFERENCES drivers(id),
	distance_km INTEGER NOT NULL,
    distance_price INTEGER NOT NULL,
    reference_code UUID NOT NULL,
    orders_status VARCHAR(255) NULL,
    token VARCHAR(255) NULL,
    remarks VARCHAR(255) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS car_types;
CREATE TABLE car_types (
	id SERIAL PRIMARY KEY,
	car_type VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS payment_method;
CREATE TABLE payment_method (
	id SERIAL PRIMARY KEY,
	method VARCHAR NOT NULL
);

DROP TABLE IF EXISTS order_animals;
CREATE TABLE order_animals(
	id SERIAL PRIMARY KEY,
    orders_id INTEGER,
	FOREIGN KEY (orders_id) REFERENCES orders(id),
    animals_id INTEGER,
	FOREIGN KEY (animals_id) REFERENCES animals(id),
    animals_amount INTEGER NOT NULL,
    animals_unit_price INTEGER NOT NULL

);

DROP TABLE IF EXISTS animals;
CREATE TABLE animals (
	id SERIAL PRIMARY KEY,
	animals_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL
);






-- INSERT INTO users (username, password) VALUES ('jason', 'jason');
-- INSERT INTO users (username, password) VALUES ('jason', 'jason'), ('peter', 'peter');

