"use client";

import NavbarCart from "@/components/ui/navbar-section/navbar-cart";
import { useRouter } from "next/navigation";

export default function CartModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
        <div className="bg-card-white-background dark:bg-card-black-background rounded-lg shadow-lg w-[400px] max-w-[90%] p-6">
            <div className="flex justify-between items-center">    
                <div className="flex space-x-1">
                    <p className="font-medium text-md">Cart</p>
                    <NavbarCart flag={true} width={18} height={18}/>
                </div>
                <button className="text-black dark:text-white font-bold cursor-pointer" onClick={() => router.back()}>X</button>
            </div>

                <div className="h-50 flex justify-center items-center">
                    <p className="text-sm text-center text-black dark:text-white">Your cart is currently empty.</p>
                </div>
        </div>
    </div>
  );
}
