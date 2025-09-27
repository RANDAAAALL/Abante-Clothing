import { UserPayload } from "@/lib/security/payloads/get-user-payload";

export default async function DashboardPage() {
  const userDetails = await UserPayload();
  return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
      <main className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col">
          <span>{userDetails?.user_ID}</span>
          <span>{userDetails?.username}</span>
          <span>{userDetails?.email}</span>
        </div>
      </main>
    </div>
  );
}