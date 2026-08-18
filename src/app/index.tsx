import { colores } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a Workly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.background,
  },
  text: {
    color: colores.white,
    fontSize: 20,
  },
});
