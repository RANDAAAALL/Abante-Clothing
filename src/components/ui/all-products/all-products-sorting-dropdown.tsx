"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../button";
import { getSortLabel } from "@/lib/helper/get-sort-label";

export default function AllProductsSortingDropdown() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "name-asc";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "name-asc") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black dark:border-white text-sm font-medium"
        >
          <span>Sort by: {getSortLabel(currentSort)}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        sideOffset={4}
      >
        <DropdownMenuRadioGroup
          value={currentSort}
          onValueChange={handleSortChange}
        >
          <DropdownMenuRadioItem value="name-asc">
            Name (A-Z)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">
            Name (Z-A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-asc">
            Price (Low to High)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-desc">
            Price (High to Low)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
