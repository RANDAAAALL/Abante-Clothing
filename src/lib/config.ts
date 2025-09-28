
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
            ? process.env.NEXT_PUBLIC_PROD_CUSTOMER_FEEDBACKS_URL
            : process.env.NEXT_PUBLIC_LOCAL_CUSTOMER_FEEDBACKS_URL

// this will be the designated environment mode for logout api endpoint
export const LogoutURL = process.env.NODE_ENV === "production" 
            ? process.env.NEXT_PUBLIC_PROD_LOGOUT_URL
            : process.env.NEXT_PUBLIC_LOCAL_LOGOUT_URL

// this will be the designated environment mode for me api endpoint
export const MeURL = process.env.NODE_ENV === "production" 
            ? process.env.NEXT_PUBLIC_PROD_ME_URL
            : process.env.NEXT_PUBLIC_LOCAL_ME_URL
