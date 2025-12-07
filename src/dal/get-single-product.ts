import { getSingleProductCached } from "@/lib/cache/get-single-product-cached";

export const getSingleProduct = (slug: string) => {
    return getSingleProductCached({slug});
}

  