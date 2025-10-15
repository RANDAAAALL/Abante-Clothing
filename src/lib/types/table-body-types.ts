
type TableBodyProps<T extends Record<string, unknown>> = {
    TheadData?: (keyof T)[];
    TbodyData: T[];
}

export type { TableBodyProps };