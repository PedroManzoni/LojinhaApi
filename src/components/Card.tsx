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

export default function Card() {
  const [quantityClient, setQuantidadeClient] = useState<string>("1");
  const { list, setList } = useContext(GlobalContext)!;

  const quantityClientAsNumber = Number(quantityClient) || 1;

  const handleAddToCart = async (product: IProducts) => {
    try {
      const productToAdd = {
        description: product.description,
        amount: product.amount,
        quantity: quantityClientAsNumber,
        discount: 0,
      };

      await addProduct(productToAdd);

      const updatedList = list.map((item) =>
        item.description === product.description
          ? { ...item, inCart: true }
          : item
      );

      setList(updatedList);
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      alert("Erro ao adicionar produto ao carrinho.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {list.map((item: IProducts, index) => {
        const precoTotal = item.amount * quantityClientAsNumber;

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>{item.description}</Text>
            <Text style={styles.price}>R$ {precoTotal.toFixed(2)}</Text>

            {item.inCart ? (
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
                    value={quantityClient}
                    onChangeText={(text) =>
                      setQuantidadeClient(text.replace(/[^0-9]/g, ""))
                    }
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityText}>
                    Adicionar ao carrinho!
                  </Text>
                  <TouchableOpacity
                    style={styles.qtdButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.qtdButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}
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
