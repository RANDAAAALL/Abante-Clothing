"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../button";
import { DialogHeader } from "../../dialog";
import { useState } from "react";
import { StatusProductsProps } from "@/lib/types/status-products-types";
import EditUploadProductForm from "./edit-upload-product-form";

export default function EditUploadProductContent({
  product,
}: {
  product: StatusProductsProps;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline">
          Edit Product
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[50]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[60]
          -translate-x-1/2 -translate-y-1/2
          bg-white dark:bg-[#1E1E1E]
          p-6 rounded-2xl shadow-lg
          w-[95%] md:w-[800px] max-h-[90vh]
          overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <DialogHeader>
              <Dialog.Title className="text-lg font-semibold">
                Edit Product
              </Dialog.Title>
            </DialogHeader>

            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
                aria-label="Close">
                ✕
              </button>
            </Dialog.Close>
          </div>
          <EditUploadProductForm
            product={product}
            closeDialog={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
