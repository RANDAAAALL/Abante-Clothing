import UserProfileContent from "@/components/user-profile/user-profile-content";

export default async function DashboardPage() {
  return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
      <main className="flex h-screen w-full items-center justify-center">
        <UserProfileContent />
      </main>
    </div>
  );
}