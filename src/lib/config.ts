
// this will be the designated environment mode for products api endpoint
export const ProductsURL = process.env.NODE_ENV === "production" 
                ? process.env.NEXT_PUBLIC_PROD_PRODUCTS_URL
                : process.env.NEXT_PUBLIC_LOCAL_PRODUCTS_URL
       
// this will be the designated environment mode for login api endpoint
export const LoginsURL = process.env.NODE_ENV === "production" 
                ? process.env.NEXT_PUBLIC_PROD_LOGIN_URL
                : process.env.NEXT_PUBLIC_LOCAL_LOGIN_URL

// this will be the designated environment mode for register api endpoint
export const RegisterURL = process.env.NODE_ENV === "production" 
                ? process.env.NEXT_PUBLIC_PROD_REGISTER_URL
                : process.env.NEXT_PUBLIC_LOCAL_REGISTER_URL
                
// this will be the designated environment mode for customer-feedback api endpoint
export const CustomerFeedbackURL = process.env.NODE_ENV === "production" 
? process.env.NEXT_PUBLIC_PROD_CUSTOMER_FEEDBACK_URL
: process.env.NEXT_PUBLIC_LOCAL_CUSTOMER_FEEDBACK_URL
