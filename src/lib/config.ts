import { getBaseUrl } from "@/lib/helper/getBaseUrl";

// dynamically builds URLs based on environment
// export const ProductsURL = `${getBaseUrl()}/api/products`;
export const LoginURL = `${getBaseUrl()}/api/login`;
export const RegisterURL = `${getBaseUrl()}/api/register`;
// export const CustomerFeedbackURL = `${getBaseUrl()}/api/customer-feedbacks`;
export const LogoutURL = `${getBaseUrl()}/api/logout`;
export const MeURL = `${getBaseUrl()}/api/me`;
export const GetCartURL = `${getBaseUrl()}/api/get-cart`;
export const AddToCartURL = `${getBaseUrl()}/api/add-to-cart`;
export const DeleteCartURL = `${getBaseUrl()}/api/delete-cart`;
export const DeleteAllCartURL = `${getBaseUrl()}/api/delete-all-cart`;
export const UploadProfilePictureURL = `${getBaseUrl()}/api/upload-profile-picture`;
export const CheckoutURL = `${getBaseUrl()}/api/checkout`;
export const GenerateReceiptURL = `${getBaseUrl()}/api/generate-receipt`;
export const ForgotPasswordURL = `${getBaseUrl()}/api/forgot-password`;
export const ResetPasswordURL = `${getBaseUrl()}/reset-password`;
export const ResetPasswordAPIURL = `${getBaseUrl()}/api/reset-password`;
export const OrderReceiptEmailURL = `${getBaseUrl()}/api/receipt-email`;
export const CsrfURL = `${getBaseUrl()}/api/csrf`;
export const AddAddressOrBillingURL = `${getBaseUrl()}/api/add-address-or-billing`;
export const UpdateAddressOrBillingURL = `${getBaseUrl()}/api/update-address-or-billing`;
export const DeleteAddressOrBillingURL = `${getBaseUrl()}/api/delete-address-or-billing`
export const AddSelectedAddressOrBillingURL = `${getBaseUrl()}/api/add-selected-address-or-billing`
export const GetSelectedAddressOrBillingURL = `${getBaseUrl()}/api/get-selected-address-or-billing`
export const RemoveSelectedAddressOrBillingURL = `${getBaseUrl()}/api/remove-selected-address-or-billing`
export const RefreshTokenURL = `${getBaseUrl()}/api/refresh-session`
export const UpdateOrdersStatusAndTrackingNumberURL = `${getBaseUrl()}/api/update-order-status-and-tracking-number`
export const UploadProductURL = `${getBaseUrl()}/api/upload-product`;
export const UpdateProductURL = `${getBaseUrl()}/api/update-product`;