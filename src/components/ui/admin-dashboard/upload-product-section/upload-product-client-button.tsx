"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "../../button";
import UploadProductFormContent from "../../form/upload-product-form";

export default function UploadProductDialogButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline">+ Upload New Product</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[50]" />
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-[60]
            -translate-x-1/2 -translate-y-1/2
            bg-white dark:bg-[#1E1E1E]
            p-6 rounded-2xl shadow-lg
            w-[95%] md:w-[800px] max-h-[90vh]
            overflow-y-auto">

          <div className="flex justify-between items-center mb-4 bg-inherit z-10">
            <Dialog.Title className="text-xl font-semibold">
              Upload New Product
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close">
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* form */}
          <UploadProductFormContent />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
