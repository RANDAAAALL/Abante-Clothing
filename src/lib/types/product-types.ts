import { TshirtType } from "./t-shirt-types"

type ProductProps<T extends TshirtType | Partial<TshirtType> | TshirtType[] | Partial<TshirtType>[] | string | null> = T;

export type { ProductProps};