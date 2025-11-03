import UploadProductFormContent from "../../form/upload-product-form";

export default function UploadProductContent(){
    return (
        <main className="min-h-[500] md:min-h-screen w-full md:max-w-7xl md:mx-auto mt-10 p-4 md:p-0 md:px-6">
          <div className="flex flex-col items-start">
            <span className="font-bold text-3xl">Products Management</span>
          </div>
          
          <UploadProductFormContent />
        </main>
    );
}