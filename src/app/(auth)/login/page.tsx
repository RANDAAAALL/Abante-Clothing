import LoginFormContent from "@/components/ui/form/login-form-content";

export default function Login() {
    return (
      <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
          {/* <LoginToast reason={reason} /> */}
            {/* main section */}
            <main className="text-center p-4 md:p-0 md:px-6 ">
              <LoginFormContent />
            </main>
          </div>
    );
}