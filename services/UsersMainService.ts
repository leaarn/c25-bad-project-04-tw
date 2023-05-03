import type {Knex} from "knex";
import { createOrder } from "../model";

export class UsersMainService {
    constructor(private knex:Knex){}

    getUserInfo = async(usersId: number) =>{
        
        const queryResult = await this.knex("users")
        .select("first_name")
        .where("id",usersId).first()

        return queryResult
    }

    getAddress = async(usersId: number) =>{
        const queryResult = await this.knex("users")
        .select("default_district","default_room","default_floor","default_building","default_street")
        .where("id",usersId).first()

        return queryResult
    }

    createOrder = async(input:createOrder)=>{

    }
    payOrder = async(usersId:number)=>{
        const orderToPay = await this.knex("orders").select(this.knex.raw(` CONCAT(pick_up_date,' ',pick_up_time) AS pick_up_date_time,
        CONCAT(pick_up_room,' ',pick_up_floor,' ',pick_up_building,' ',pick_up_street,' ',pick_up_district) AS pick_up_address,
        CONCAT(deliver_room,' ',deliver_floor,' ',deliver_building,' ',deliver_street,' ',deliver_district) AS deliver_address,
        json_agg(animals.animals_name) AS animals_name,
        json_agg(order_animals.animals_amount) AS animals_amount,
        remarks,
        max(distance_km) AS distance_km,
        orders.id, 
        max(distance_km * distance_price) AS distance_total_price,
        SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price, 
        max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) AS total_price`))
        .where('orders.orders_status','=','not pay yet')
        .andWhere('orders.users_id', '=', usersId)
        .groupBy('remarks', 'distance_km','pick_up_date_time','pick_up_address','deliver_address','orders.id')
        .first()

        return orderToPay
    }
    confirmOrder = async(usersId:number,orderId:number)=>{
        await this.knex("orders")
        .where("id",'=',orderId)
        .andWhere('users_id','=',usersId)
        .update({
            orders_status:'訂單待接中',
            created_at : this.knex.fn.now()
        })
    }
    orderStatus = async(usersId:number)=>{
        const queryResult = await this.knex("orders")
        .select(this.knex.raw(`orders.id,
        TO_CHAR(orders.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        CONCAT(pick_up_room,' ',pick_up_floor,' ',pick_up_building,' ',pick_up_street,' ',pick_up_district) AS pick_up_address,
        CONCAT(deliver_room,' ',deliver_floor,' ',deliver_building,' ',deliver_street,' ',deliver_district) AS deliver_address,
        CONCAT(pick_up_date,' ',pick_up_time) AS pick_up_date_time,
        json_agg(animals.animals_name) AS animals_name,
        json_agg(order_animals.animals_amount) AS animals_amount,
        remarks,
        orders_status,
        reference_code,
        orders.drivers_id`))
        .join('order_animals','order_animals.orders_id','orders.id')
        .join('animals','animals.id','order_animals.animals_id')
        .leftJoin('drivers','drivers.id','orders.drivers_id')
        .whereNot('orders_status','已完成')
        .whereNot('orders_status','not pay yet')
        .where('orders.users_id','=',usersId)
        .groupBy('orders.id','created_at','remarks','orders_status','reference_code','orders.drivers_id')
        .orderBy('created_at')

        return queryResult
    }
    orderStatusDetails = async (usersId:number,orderId:number) => {
        const queryResult = await this.knex("drivers")
        .select(this.knex.raw(` CONCAT(drivers.title,' ',drivers.first_name,' ',drivers.last_name) AS full_name,
        drivers.contact_num,
        drivers.car_license_num `))
    }
    historyOrders = async () => {
    }
    historyOrderDetails = async () => {
    }

}