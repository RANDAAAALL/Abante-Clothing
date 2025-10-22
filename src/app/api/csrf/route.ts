import { generateCsrfToken } from "@/lib/security/csrf/generate-csrf-token";
import { getCsrfToken } from "@/lib/security/csrf/get-csrf-token";
import { setCsrfToken } from "@/lib/security/csrf/set-csrf-token";
import { NextResponse } from "next/server";

export async function GET(){
    let existingCsrfToken = await getCsrfToken();

    if (!existingCsrfToken) {
        existingCsrfToken = generateCsrfToken(); 
        await setCsrfToken(existingCsrfToken); 
    }

    return NextResponse.json({ csrfToken: existingCsrfToken });
}