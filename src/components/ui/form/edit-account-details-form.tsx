"use client"
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { EditAccountDetailsFormType, EditAccountDetailsSchema } from "@/lib/validations/edit-account-detail-schema";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UpdateAccountDetailsURL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface EditAccountDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    email: string;
    username: string;
  };
}

export default function EditAccountDetailsForm({ 
  isOpen, 
  onClose, 
  initialData 
}: EditAccountDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch
  } = useForm<EditAccountDetailsFormType>({
    resolver: zodResolver(EditAccountDetailsSchema),
    defaultValues: initialData,
    mode: "onChange" 
  });

  const router = useRouter();

  // reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (editFormData: EditAccountDetailsFormType) => {
    return toast.promise(
        (async () => {
            const res = await fetchWithCsrf(UpdateAccountDetailsURL, { 
                method: "PUT",
                body: JSON.stringify(editFormData)
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data?.errorMessage || data?.parsedErrors);

            return data;
        })(), {
            loading: "Updating account details...",
            success: (message) => {
                router.refresh();
                onClose();
                return message?.successMessage;
            }, 
            error: (err) => err?.message || "Failed to update account details." 
        }
    )
  };

  const handleCancel = () => {
    reset(initialData);
    onClose();
  };

  // watch form values to determine if there are changes
  const watchedValues = watch();
  const hasChanges = 
    watchedValues.email !== initialData.email || 
    watchedValues.username !== initialData.username;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="dark:bg-card-black-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Account Details</DialogTitle>
          <DialogDescription>
            Update your email address and username.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {errors.email && (
               <p className="text-sm text-red-600 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                placeholder="Enter your username"
                disabled={isSubmitting}/>
                {errors.username && (
                <p className="text-sm text-red-600 ml-1">{errors.username.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges || !isDirty}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}