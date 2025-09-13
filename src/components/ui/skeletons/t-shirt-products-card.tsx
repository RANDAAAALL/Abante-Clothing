import { Card, CardContent, CardFooter } from "../carousel/card";

export default function TshirtProductsSkeletonCard(){
    return (
        <>
        <div className="font-bold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

        {Array.from({ length: 9 }).map(( _ , i ) => (
            <Card key={i} className="w-full items-center">
                <CardContent className="flex aspect-square items-center">
                    <div className="t-shirt-skeleton w-[180] h-[200] rounded-xl"></div>          
                </CardContent>

                <CardFooter className="w-full justify-between gap-10">
                    <div className="t-shirt-skeleton w-25 h-4 rounded"></div>
                    <div className="t-shirt-skeleton w-25 h-4 rounded"></div>
                </CardFooter>
            
            </Card>
        ))}
        </div>
        </>
    );
}