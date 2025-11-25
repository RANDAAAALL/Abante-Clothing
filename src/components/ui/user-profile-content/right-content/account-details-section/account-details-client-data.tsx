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

export default function AccountDetailClientData({ email, username }: AccountDetailsClientDataProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      window.location.replace("/login");
      
    } catch (error) {
      setIsDeleting(false);
    }
  }, []);

  return (
    <>
      <div className="space-y-5 font-medium flex flex-col -mt-4">
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <span className="text-2xl">Account Details</span>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 gap-2 cursor-pointer">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>

            <Button
              onClick={() => setIsDeleting(true)}
              variant="outline"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 gap-2 cursor-pointer">
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