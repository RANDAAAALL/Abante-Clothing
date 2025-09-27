import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import NavbarClient from "./navbar-client";

export default async function NavbarContent() {
  // console.log("navbar content rendered");
  let user = null;

  try {
    user = await UserPayload(); 
  } catch (err) {
    user = null; 
  }

  return <NavbarClient user={user} />;
}
