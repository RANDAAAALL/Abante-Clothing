"use client"
import LoginFormContent from "@/components/ui/form/login-form-content";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') ?? undefined;

  return (
    <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
      <main className="text-center p-4 md:p-0 md:px-6">
        <LoginFormContent reason={reason} />
      </main>
    </div>
  );
}