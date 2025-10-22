import { CsrfURL } from "../config";

export const fetchWithCsrf = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    // get CSRF token from backend 
    const csrfRes = await fetch(`${CsrfURL}`, { credentials: "include" });
    const { csrfToken } = await csrfRes.json();
  
    // create headers and add tokens
    const headers = new Headers(init?.headers || {});
    headers.set("x-csrf-token", csrfToken);
    if (!(init?.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
  
    // perform actual API request
    return fetch(input, {
      ...init,
      headers,
      credentials: "include", 
    });
  }
  