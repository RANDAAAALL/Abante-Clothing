"use client"
import { LogoutURL } from "@/lib/config";
// import { useRouter } from "next/navigation";


//src\app\(protected)\(customer)\dashboard\page.tsx
export default function DashboardPage() {
//   const router = useRouter();
    
  const handleLogoutClick = async () => {
    await fetch(`${LogoutURL}`, { method: "POST"});
    window.location.href = "/login";
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard! This is a protected route.</p>
      <button onClick={()=> handleLogoutClick()}>Logout</button>
    </div>
  );
}