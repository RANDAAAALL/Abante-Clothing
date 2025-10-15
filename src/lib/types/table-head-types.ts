type TableHeadProps<T extends Record<string, unknown>> = {
    TheadData: (keyof T)[];
}

export type { TableHeadProps }