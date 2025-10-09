import { getBaseUrl } from "@/lib/helper/getBaseUrl";

// dynamically builds URLs based on environment
export const ProductsURL = `${getBaseUrl()}/api/products`;
export const LoginsURL = `${getBaseUrl()}/api/login`;
export const RegisterURL = `${getBaseUrl()}/api/register`;
export const CustomerFeedbackURL = `${getBaseUrl()}/api/customer-feedbacks`;
export const LogoutURL = `${getBaseUrl()}/api/logout`;
export const MeURL = `${getBaseUrl()}/api/me`;
export const GetCartURL = `${getBaseUrl()}/api/get-cart`;
export const AddToCartURL = `${getBaseUrl()}/api/add-to-cart`;
export const DeleteCartURL = `${getBaseUrl()}/api/delete-cart`;
export const DeleteAllCartURL = `${getBaseUrl()}/api/delete-all-cart`;
export const CheckoutURL = `${getBaseUrl()}/api/checkout`;