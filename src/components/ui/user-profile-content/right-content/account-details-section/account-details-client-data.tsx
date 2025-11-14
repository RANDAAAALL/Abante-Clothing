"use client"
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { AccountDetailsClientDataProps } from "@/lib/interface/account-details";
import { Edit2, Trash2 } from "lucide-react";
import EditAccountDetailsForm from "@/components/ui/form/edit-account-details-form";
import DeleteAccountDialog from "@/components/ui/modal/delete-account-dialog";
import toast from "react-hot-toast";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UpdateAccountURL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function AccountDetailClientData({ email, username }: AccountDetailsClientDataProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    // console.log("Deleting account..");

    try {
      await toast.promise(
        (async () => {
          const res = await fetchWithCsrf(UpdateAccountURL, { 
            method: "PUT",
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          const data = await res.json();
          if(!res.ok) throw new Error(data?.errorMessage);

          return data;
        })(), {
          loading: "Deleting account...",
          success: (message) => { 
            return message?.successMessage || "Account deleted successfully";
          },
          error: (e) => e?.message || "Failed to delete your account."
        } 
      );
      
      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
      setIsDeleting(false);
      window.location.href = "/login"
      
    } catch (error) {
      setIsDeleting(false);
    }
  }, [router]);

  return (
    <>
      <div className="space-y-5 font-medium flex flex-col -mt-4">
        <div className="flex items-center justify-between flex-col md:flex-row">
          <span className="text-2xl">Account Details</span>

          <div className=" flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>

            <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsDeleting(true)}
            >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-x-3">
          <span>Email:</span>
          <span className="break-words text-end md:text-start">{email ?? "anonymous@email.com"}</span>
        </div>

        <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-x-3">
          <span>Username:</span>
          <span className="break-words text-end md:text-start">{username ?? "Anonymous"}</span>
        </div>
      </div>

      <EditAccountDetailsForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={{ email: email ?? "", username: username ?? "" }}
      />

      <DeleteAccountDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}