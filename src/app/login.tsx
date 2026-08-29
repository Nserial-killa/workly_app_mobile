import { colores } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Pantalla de inicio de sesión (por construir)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: { color: colores.white },
});
