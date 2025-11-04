import { getAllStatusProducts } from "@/dal/get-all-status-products";
import UploadProductClientData from "./upload-product-client-data";

export default async function UploadProductServerData(){
    const productsData = await getAllStatusProducts();

    return <UploadProductClientData products={productsData} />
}