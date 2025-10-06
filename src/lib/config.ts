const ENV = process.env.VERCEL_ENV ?? process.env.NODE_ENV;

// PRODUCTS API
export const ProductsURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_PRODUCTS_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_PRODUCTS_URL
    : process.env.NEXT_PUBLIC_LOCAL_PRODUCTS_URL;

// LOGIN API
export const LoginsURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_LOGIN_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_LOGIN_URL
    : process.env.NEXT_PUBLIC_LOCAL_LOGIN_URL;

// REGISTER API
export const RegisterURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_REGISTER_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_REGISTER_URL
    : process.env.NEXT_PUBLIC_LOCAL_REGISTER_URL;

// CUSTOMER FEEDBACK API
export const CustomerFeedbackURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_CUSTOMER_FEEDBACKS_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_CUSTOMER_FEEDBACKS_URL
    : process.env.NEXT_PUBLIC_LOCAL_CUSTOMER_FEEDBACKS_URL;

// LOGOUT API
export const LogoutURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_LOGOUT_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_LOGOUT_URL
    : process.env.NEXT_PUBLIC_LOCAL_LOGOUT_URL;

// ME API
export const MeURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_ME_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_ME_URL
    : process.env.NEXT_PUBLIC_LOCAL_ME_URL;

// GET CART API
export const GetCartURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_GetCart_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_GetCart_URL
    : process.env.NEXT_PUBLIC_LOCAL_GetCart_URL;

// ADD TO CART API
export const AddToCartURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_AddToCart_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_AddToCart_URL
    : process.env.NEXT_PUBLIC_LOCAL_AddToCart_URL;

// DELETE CART API
export const DeleteCartURL =
  ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_DeleteCart_URL
    : ENV === "preview"
    ? process.env.NEXT_PUBLIC_PREVIEW_DeleteCart_URL
    : process.env.NEXT_PUBLIC_LOCAL_DeleteCart_URL;
