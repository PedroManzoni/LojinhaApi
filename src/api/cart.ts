import axios from "axios";
import { IProducts } from "../types/product";

const api = axios.create({
  baseURL: "http://192.168.15.6:3000/api/v1/shopping-cart",
});

const cpf = "03970320135";

export async function getCart() {
  try {
    const response = await api.get(`/${cpf}`);
    return {
      products: response.data.products,
      totalValue: response.data.total_value,
    };
  } catch (error) {
    return {
      products: [],
      totalValue: 0,
    };
  }
}

export async function addProduct(product: Omit<IProducts, "id">) {
  const response = await api.post(`/${cpf}/add-product`, product);
  return response;
}

export async function updateProductQuantity(
  productId: string,
  operation: 0 | 1
) {
  return await api.put(`/${cpf}/update-quantity/${productId}`, { operation });
}

export async function deleteProduct(productId: string) {
  return await api.delete(`/${cpf}/remove-product/${productId}`);
}
