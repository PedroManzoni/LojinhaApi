import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../context/GlobalContext";
import { getCart, deleteProduct, updateProductQuantity } from "../api/cart";
import { IProducts } from "../types/product";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";

export default function CartScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { list, setList } = useContext(GlobalContext)!;
  const [products, setProducts] = useState<IProducts[]>([]);
  const [total, setTotal] = useState(0);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setProducts(data.products);
      setTotal(Number(data.totalValue));

      const updatedList = list.map((p) =>
        data.products.some((item: IProducts) => item.id === p.id)
          ? { ...p, inCart: true }
          : { ...p, inCart: false }
      );
      setList(updatedList);
    } catch (error) {
      setProducts([]);
      setTotal(0);
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (products.length === 1) {
        await deleteProduct(id);
        setProducts([]);
        setTotal(0);

        const updatedList = list.map((p) =>
          p.id === id ? { ...p, inCart: false } : p
        );
        setList(updatedList);
      } else {
        await deleteProduct(id);
        await loadCart();
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const renderItem = ({ item }: { item: IProducts }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.description}</Text>
      <Text style={styles.detail}>Quantidade: {item.quantity}</Text>
      <Text style={styles.detail}>
        Preço: R$ {Number(item.amount).toFixed(2)}
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <TouchableOpacity
          style={[styles.qtdButton, { backgroundColor: "#ccc" }]}
          onPress={async () => {
            await updateProductQuantity(item.id!, 1);
            await loadCart();
          }}
        >
          <Text style={styles.qtdButtonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.qtdButton, { backgroundColor: "#4CAF50" }]}
          onPress={async () => {
            await updateProductQuantity(item.id!, 0);
            await loadCart();
          }}
        >
          <Text style={styles.qtdButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeItem(item.id!)}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Meu Carrinho</Text>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!}
        ListEmptyComponent={
          <Text style={styles.empty}>Seu carrinho está vazio.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {products.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.payButtonText}>← Voltar para Loja</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#ff5757",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 40,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
  qtdButton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 40,
    alignItems: "center",
  },
  qtdButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
