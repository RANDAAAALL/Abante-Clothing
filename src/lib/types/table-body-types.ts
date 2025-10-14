
type TableBodyProps<T extends Record<string, string | number | Date | null>> = {
    TheadData?: string[];
    TbodyData: T[];
}

export type { TableBodyProps };