
// this will be the designated environment mode
export const ApiURL = process.env.NODE_ENV === "production" 
                ? process.env.NEXT_PUBLIC_PRODUCTS_URL
                : process.env.LOCAL_PRODUCTS_URL
