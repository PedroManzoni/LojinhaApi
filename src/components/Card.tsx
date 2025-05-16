import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { IProducts } from "../types/product";
import { addProduct } from "../api/cart";
import { GlobalContext } from "../context/GlobalContext";

interface props {
  product: IProducts;
}

export default function Card({ product }: props) {
  const [quantityClient, setQuantidadeClient] = useState<number>(1);
  const { list, setList } = useContext(GlobalContext)!;

  const handleAddToCart = async (product: IProducts) => {
    try {
      const productToAdd = {
        description: product.description,
        amount: product.amount,
        quantity: quantityClient,
        discount: 0,
      };
      const response = await addProduct(productToAdd);

      if (response.status === 200) {
        const updatedList = list.map((item) =>
          item.description === product.description
            ? { ...item, inCart: true }
            : item
        );
        setList(updatedList);
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      alert("Erro ao adicionar produto ao carrinho.");
    }
  };

  const precoTotal = product.amount * quantityClient;

  return (
    <View style={{ padding: 16 }}>
      <View style={styles.card}>
        <Text style={styles.title}>{product.description}</Text>
        <Text style={styles.price}>R$ {precoTotal.toFixed(2)}</Text>

        {product.inCart ? (
          <Text
            style={[styles.quantityText, { marginTop: 10, color: "green" }]}
          >
            Produto adicionado ao carrinho!
          </Text>
        ) : (
          <>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>Quantas Unidades?</Text>
              <TextInput
                style={styles.input}
                value={"1"}
                onChangeText={(text) =>
                  setQuantidadeClient(Number(text.replace(/[^0-9]/g, "")))
                }
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>Adicionar ao carrinho!</Text>
              <TouchableOpacity
                style={styles.qtdButton}
                onPress={() => handleAddToCart(product)}
              >
                <Text style={styles.qtdButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      );
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 5,
    width: 50,
    textAlign: "center",
  },
  qtdButton: {
    backgroundColor: "#41be03",
    padding: 8,
    borderRadius: 5,
  },
  qtdButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
