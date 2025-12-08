"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";
import { EditAccountDetailsFormType, EditAccountDetailsSchema } from "@/lib/validations/edit-account-detail-schema";
import { useRouter } from "next/navigation";
import EyeOpen from "@/components/icons/svg/eye-open";
import { actionUpdateAccountDetails } from "@/lib/actions/handle-update-account-details";

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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch
  } = useForm<EditAccountDetailsFormType>({
    resolver: zodResolver(EditAccountDetailsSchema),
    defaultValues: initialData,
    mode: "onChange" 
  });

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      reset(initialData);
      setShowChangePassword(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (editFormData: EditAccountDetailsFormType) => {
    return toast.promise(
      (async () => {
        const res = await actionUpdateAccountDetails(editFormData);
        if (res.status !== 200) throw new Error(`${res.errorMessage}`);

        return res;
      })(),
      {
        loading: "Updating account details...",
        success: (message) => {
          router.refresh();
          onClose();
          
          // type guard to ensure successMessage exists
          if ("successMessage" in message && message.successMessage) {
            return message.successMessage;
          }
          
          // fallback
          return `Account details updated successfully.`;
        },
        error: (err) => err?.message || "Failed to update account details."
      }
    )
  };

  const handleCancel = () => {
    reset(initialData);
    setShowChangePassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const watchedValues = watch();
  const hasChanges = 
    watchedValues.email !== initialData.email || 
    watchedValues.username !== initialData.username ||
    (showChangePassword && (watchedValues.password || watchedValues.confirmPassword));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="dark:bg-card-black-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Account Details</DialogTitle>
          <DialogDescription>
            Update your email address, username, and optionally your password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600 ml-1">{errors.email.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
              {errors.username && <p className="text-sm text-red-600 ml-1">{errors.username.message}</p>}
            </div>

            {/* Change Password Collapsible */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                type="button"
                className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setShowChangePassword(prev => {
                    if (prev) {
                      resetField("password");
                      resetField("confirmPassword");
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                    }
                    return !prev;
                  });
                }}>
                
                <span>Change Password</span>
                {showChangePassword ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-4 ${showChangePassword ? "py-4 max-h-96" : "py-0 max-h-0 overflow-hidden"}`}
              >
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                      className="pr-10 mb-2" 
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOpen/> : <EyeClosed/>}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600 ml-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 mt-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOpen/> : <EyeClosed/>}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges || !isDirty}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}