import { SlicedPaginatedDataProps } from "../types/sliced-paginated-data-types";

export const SlicedPaginatedData = <T, > ({
    props,
    firstItemIndex,
    lastItemIndex
}: SlicedPaginatedDataProps<T>) => {
    return props?.slice(firstItemIndex, lastItemIndex);
};