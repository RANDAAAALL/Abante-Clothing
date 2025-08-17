import Image from "next/image";

export default function Home() {
  return (
    <div className="text-black flex flex-col justify-center items-center h-screen bg-red-background ">
     <p className="text-black font-metrapolis font-extralight">Metrapolis Extra Light</p>
     <p className="text-black font-metrapolis font-thin">Metrapolis Thin</p>
     <p className="text-black font-metrapolis font-bold">Metrapolis Bold</p>
     <p className="text-black font-metrapolis font-extrabold">Metrapolis Extra Bold</p>
     <p className="text-black font-metrapolis font-regular">Metrapolis Regular</p>
     <p className="font-metrapolis font-medium">Metrapolis Medium</p>
     <p className="font-metrapolis font-black">Metrapolis Black</p>
    <Image 
    src="/images/svg/abante-clothing-logo.svg"
    height={80}
    width={80}
    alt="Abante Clothing Logo"
    />
    </div>
  );
}
 