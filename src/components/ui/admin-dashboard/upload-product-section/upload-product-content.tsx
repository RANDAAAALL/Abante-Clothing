import UploadProductClientButton from "./upload-product-client-button";
import UploadProductServerData from "./upload-product-server-data";
import { Suspense } from "react";

export default function UploadProductContent() {
  return (
    <main className="min-h-[500px] md:min-h-screen w-full md:max-w-7xl md:mx-auto mt-10 p-4 md:p-0 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <span className="font-bold text-3xl">Products Management</span>
        <UploadProductClientButton />
      </div>
      <Suspense><UploadProductServerData /></Suspense>
    </main>
  );
}
