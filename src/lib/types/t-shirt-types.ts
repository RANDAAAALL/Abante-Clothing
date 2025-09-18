
type TshirtType = {
    product_item_ID: number | null,
    product_item_image: string | null,
    product_item_back_image?: string | null,
    product_item_name: string | null,
    product_item_color?: string | null,
    product_item_size: string | null,
    product_item_price: number | null | undefined,
    product_item_material?: string | null,
    product_item_construction?: string | null,
    product_item_design_features?: string | null,
    alt?: string | null,
    discount?: number | null,
}

export type { TshirtType };