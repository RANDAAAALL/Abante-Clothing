import { getOrders } from "@/dal/get-orders";
import OrdersClientData from "./orders-client-data";

export default async function OrdersServerData(){
    const ordersData = await getOrders();

    return <OrdersClientData orders={ordersData}/>
} 