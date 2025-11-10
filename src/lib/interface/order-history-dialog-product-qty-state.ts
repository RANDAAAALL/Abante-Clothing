export interface ProductQuantityState {
    quantities: { [key: string]: number };
    setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}