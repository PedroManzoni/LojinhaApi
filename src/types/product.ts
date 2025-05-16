export interface IProducts {
  id?: string;
  description: string;
  quantity: number;
  amount: number;
  discount: number;
  inCart?: boolean;
}
