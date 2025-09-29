import UserProfileContent from "@/components/user-profile/user-profile-content";

export const experimental_ppr = true;

export default function Profile() {
  return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <UserProfileContent />
      </main>
    </div>
  );
}