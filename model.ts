export interface UsersRow {
  last_name: string;
  first_name: string;
  title: string;
  email: string;
  password: string;
  contact_num: Number;
  default_district: string;
  default_address: string;
  default_coordinates?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DriversRow {
  last_name: string;
  first_name: string;
  title: string;
  email: string;
  password: string;
  contact_num: Number;
  car_license_num: Number;
  car_type: Number;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersRow {
  pick_up_date: Date;
  pick_up_time: TimeRanges;
  pick_up_district: string;
  pick_up_address: string;
  pick_up_coordinates?: string;
  deliver_district: string;
  deliver_address: string;
  deliver_coordinates?: string;
  receiver_name: string;
  receiver_contact: Number;
  distance_km: Number;
  distance_price: Number;
  reference_code: string;
  order_status: string;
  token: string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarTypesRow {
  car_type: string;
}

export interface PaymentMethodRow {
  method: string;
}

export interface OrderAnimalsRow {
  animals_amount: Number;
  animals_unit_price: Number;
}

export interface AnimalsRow {
  animals_name: string;
  price: Number;
}

export interface usersLogin {
  username: string;
  password: string;
}

export interface driversLogin {
  username: string;
  password: string;
}

export interface createUsers {
  username: string;
  password: string;
}

export interface createDrivers {
  username: string;
  password: string;
}

