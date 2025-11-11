import { getUserInfo } from "@/dal/get-user-info";
import AccountDefailtClientData from "./account-details-client-data";
export default async function AccountDetailsServerData() {
  const data = await getUserInfo();
  return <AccountDefailtClientData email={data?.email as string} username={data?.username as string}/>
}
