import { JWTPayload } from "jose";
export interface UserPayloadProps extends JWTPayload {
    user_ID: string;
}   