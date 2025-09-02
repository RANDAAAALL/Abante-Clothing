import { Decimal } from "@prisma/client/runtime/library";

type TshirtType = {
    product_item_ID: number | null,
    product_item_image: string | null,
    product_item_name: string | null,
    product_item_color: string | null,
    product_item_size: string | null,
    product_item_price: string | Decimal | number | null,
    alt?: string | null | undefined,
    discount?: string | Decimal | number | null,
}


export type { TshirtType };