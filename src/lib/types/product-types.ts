import { TshirtType } from "./t-shirt-types"

type ProductsName = {
    product_item_name: string
}


type ProductsProps = {
    products: TshirtType[]
}

type ProductType = {
    product: TshirtType
}

export type { ProductsProps, ProductType };