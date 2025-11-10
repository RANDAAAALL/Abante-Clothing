"use client";
import { Card, CardHeader, CardTitle, CardContent } from "../carousel/card";

export default function UploadProductSkeleton() {
  const skeletonArray = Array.from({ length: 6 });

  return (
    <div>
      {/* === Summary Cards Skeleton === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[0, 1, 2].map((i) => (
            <Card key={i} className="dark:bg-card-black-background p-2"> 
                <CardHeader className="pb-3"> 
                <CardTitle className="text-sm font-medium">
                    <div className="h-6 w-32 checkout-form-skeleton rounded" /> 
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-3"> 
                <div className="h-12 w-16 checkout-form-skeleton rounded" /> 
                </CardContent>
             </Card>
        ))}
      </div>

      {/* === Filter Skeleton (Product Status Dropdown) === */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-6 mb-3">
        <span className="text-sm font-medium">
          <div className="h-4 w-32 checkout-form-skeleton rounded" />
        </span>

        <div className="mt-2 md:mt-0">
          <div className="h-8 w-[200px] checkout-form-skeleton rounded" />
        </div>
      </div>

      {/* === Products Display Skeleton === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonArray.map((_, index) => (
          <Card
            key={index}
            className="dark:bg-card-black-background py-4 gap-0"
          >
            {/* image placeholder */}
            <div className="px-4">
                <div className="h-48 checkout-form-skeleton rounded-md" />
            </div>

            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-2/3">
                  <div className="h-5 checkout-form-skeleton rounded w-3/4" />
                  <div className="h-4 checkout-form-skeleton rounded w-1/2" />
                </div>

                <div className="h-8 w-16 checkout-form-skeleton rounded" />
              </div>

              {/* details */}
              <div className="space-y-2">
                <div className="h-4 checkout-form-skeleton rounded w-1/2" />
                <div className="h-4 checkout-form-skeleton rounded w-1/3" />
                <div className="h-3 checkout-form-skeleton rounded w-full" />
                <div className="h-3 checkout-form-skeleton rounded w-5/6" />
                <div className="h-3 checkout-form-skeleton rounded w-4/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
