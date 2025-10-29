import ForgotPasswordContent from "@/components/ui/form/forgot-password-form-content";

export default function ForgotPassword(){
    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
        {/* main section */}
        <main className=" text-center w-full md:mx-auto p-4 md:p-0 md:px-6 ">
        <ForgotPasswordContent />
        </main>
    </div>
    );
}