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
  pick_up_date: string;
  pick_up_time: string;
  pick_up_district: string;
  pick_up_address: string;
  pick_up_coordinates?: string;
  deliver_district: string;
  deliver_address: string;
  deliver_coordinates?: string;
  users_id: Number;
  drivers_id?: Number;
  receiver_name: string;
  receiver_contact: Number;
  distance_km: Number;
  distance_price: Number;
  reference_code: string;
  orders_status: string;
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
  orders_id: Number;
  animals_id: Number;
  animals_amount: Number;
  animals_history_price: Number;
}

export interface AnimalsRow {
  animals_name: string;
  price: Number;
}

export interface usersLogin {
  [x: string]: any;
  firstName:string;
  username: string;
  password: string;
}

export interface driversLogin {
  [x: string]: any;
  firstName: string;
  username: string;
  password: string;
}

export interface createUsers {
  [x: string]: any;
  lastName: string;
  firstName: string;
  title: string;
  email: string;
  password: string;
  contactNum: Number;
  defaultDistrict: string;
  defaultAddress: string;
}

export interface createDrivers {
  [x: string]: any;
  username: string;
  password: string;
}

