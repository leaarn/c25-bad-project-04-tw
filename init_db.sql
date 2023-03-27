\c project2

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR NOT NULL,
	first_name VARCHAR NOT NULL,
	title VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	contact_num INT NOT NULL,
	default_district VARCHAR NOT NULL,
	default_address VARCHAR NOT NULL,
	default_coordinates VARCHAR NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS drivers;
CREATE TABLE drivers (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR NOT NULL,
	first_name VARCHAR NOT NULL,
	title VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	contact_num INT NOT NULL,
	car_license_num VARCHAR NOT NULL,
	car_type VARCHAR NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	pick_up_date DATE,
	pick_up_time TIME,
	pick_up_district VARCHAR NOT NULL,
	pick_up_address VARCHAR NOT NULL,
	pick_up_coordinates POINT,
	deliver_district VARCHAR NOT NULL,
	deliver_address VARCHAR NOT NULL,
	deliver_coordinates POINT,
	FOREIGN KEY (users_id) REFERENCES users(id),
	FOREIGN KEY (drivers_id) REFERENCES drivers(id),
	distance_km INT NOT NULL,
	distance_price INT NOT NULL,
	reference_code uuid DEFAULT uuid_generate_v4(),
	order_status VARCHAR NOT NULL,
	token VARCHAR,
	remarks VARCHAR,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS car_types;
CREATE TABLE car_types (
	id SERIAL PRIMARY KEY,
	car_type VARCHAR NOT NULL
);

DROP TABLE IF EXISTS payment_method;
CREATE TABLE payment_method (
	id SERIAL PRIMARY KEY,
	method VARCHAR NOT NULL
);

DROP TABLE IF EXISTS order_animals;
CREATE TABLE order_animals(
	id SERIAL PRIMARY KEY,
	FOREIGN KEY (orders_id) REFERENCES orders(id),
	FOREIGN KEY (animals_id) REFERENCES animals(id),
	animals_amount INT NOT NULL,
	animals_unit_price INT NOT NULL

);

DROP TABLE IF EXISTS animals;
CREATE TABLE animals (
	id SERIAL PRIMARY KEY,
	animals_name VARCHAR NOT NULL,
	price INT
);






-- INSERT INTO users (username, password) VALUES ('jason', 'jason');
-- INSERT INTO users (username, password) VALUES ('jason', 'jason'), ('peter', 'peter');

