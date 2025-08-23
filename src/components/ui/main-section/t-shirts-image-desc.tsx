import { TshirtValue } from "@/lib/values-type/t-shirt-value";
import Image from "next/image";

export default function TshirtsImageDescContent(){
    return (
        <>
        {TshirtValue.map((Tshirt, i) => (
            <div key={i} className="relative flex flex-col font-bold items-center bg-t-shirt-background p-4 rounded-lg">
                <p className="p-2 absolute right-1 top-0 md:top-1 text-lg">{Tshirt.discount}</p>
                <Image src={Tshirt.path} width={250} height={250} alt={Tshirt.alt}/>
                <div className="flex flex-col items-center mt-2"> 
                <p className="text-lg">{Tshirt.name} - {Tshirt.size}</p>
                <p className="text-lg">₱ {Tshirt.price}</p>  
                </div>
            </div>
        ))}
        </>
    );
}