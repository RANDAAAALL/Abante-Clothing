import { cookies } from "next/headers";

export const getCsrfToken = async () => {
    return (await cookies()).get("csrf_token")?.value;
}