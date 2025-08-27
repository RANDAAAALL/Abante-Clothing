

export default function FooterPPC(){
    return (
        <div className=" text-center md:w-auto md:flex md:flex-row-reverse md:justify-between md:pt-5 md:mx-20">
            <hr className="dark:border-white border-t-1 border-black md:hidden"/>
            <div className="flex items-center justify-evenly p-1 mt-2 md:mt-0 md:p-0 md:gap-6">
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
            </div>
            <p>@ 2025 Abante Clothing. All rights reserved</p>
        </div>
    );
}