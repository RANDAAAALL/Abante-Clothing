"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AccountDetailsClientDataProps } from "@/lib/interface/account-details";
import { Edit2 } from "lucide-react";
import EditAccountDetailsForm from "@/components/ui/form/edit-account-details-form";

export default function AccountDetailClientData({ email, username }: AccountDetailsClientDataProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="space-y-5 font-medium flex flex-col">
        <div className="flex items-center justify-between -mt-3.5">
          <span className="text-2xl">Account Details</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
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
    </>
  );
}