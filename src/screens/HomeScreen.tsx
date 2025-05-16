import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import carrinho from "../../assets/carrinho.png";
import Card from "../components/Card";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";
import { GlobalContext } from "../context/GlobalContext";
import { useFocusEffect } from "@react-navigation/native";
import { getCart } from "../api/cart";
import { IProducts } from "../types/product";

export default function HomeScreen() {
  const { list, setList } = useContext(GlobalContext)!;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      const syncWithCart = async () => {
        try {
          const data = await getCart();

          const updatedList = list.map((product) => {
            const estaNoCarrinho = data.products.some(
              (p: IProducts) => p.description === product.description
            );
            return {
              ...product,
              inCart: estaNoCarrinho,
            };
          });

          setList(updatedList);
        } catch (error) {
          console.log("Erro ao sincronizar com o carrinho:", error);
        }
      };

      syncWithCart();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lojinha da API</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Image
            source={carrinho}
            style={{ width: 50, height: 50, marginTop: 10 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <Card />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c6c6c6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e2e2e2",
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  list: {
    padding: 16,
  },
});
