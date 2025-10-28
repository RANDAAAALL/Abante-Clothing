import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { getDefaultAddressAndBillingCached } from "@/lib/cache/get-default-address-and-billing-cached";

export const getDefaultAddressOrBilling = async () => {
  if (!await isAuthenticatedUser()) redirect("/login");
  const payload = await UserPayload();
  if (!payload) redirect("/login");

  const user_ID = Number(payload.user_ID);

  return getDefaultAddressAndBillingCached(user_ID);
};
