import Image from 'next/image'

export default function NavbarLogo() {
    return (
        <>
            <Image 
            src="/images/svg/abante-clothing-logo.svg"
            height={65}
            width={65}
            alt="Abante Clothing Logo" />
        </>
    );
}