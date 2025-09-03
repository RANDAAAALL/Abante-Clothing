import { TshirtType } from "./t-shirt-types"

type ProductsNameProps = {
    product_item_name: string | null
}


type ProductsProps = {
    products: TshirtType[]
}

type ProductType = {
    product: TshirtType
}

export type { ProductsProps, ProductType, ProductsNameProps};