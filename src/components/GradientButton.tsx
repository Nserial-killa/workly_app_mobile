import { colores } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient"; // el componente que dibuja el degradado
import { Pressable, StyleSheet, Text } from "react-native";

// Definimos qué props recibe este componente: el texto del botón,
// y una función a ejecutar cuando lo toquen.
type Props = {
  texto: string;
  onPress: () => void;
};

export default function GradientButton({ texto, onPress }: Props) {
  return (
    // Pressable es el que detecta el toque; LinearGradient adentro es
    // solo el "pintado" visual, no reacciona al toque por sí mismo.
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[colores.gradientStart, colores.gradientEnd]} // los 2 colores del degradado
        start={{ x: 0, y: 0 }} // el degradado arranca en la esquina superior izquierda
        end={{ x: 1, y: 0 }} // y termina en la esquina superior derecha (degradado horizontal)
        style={styles.boton}
      >
        <Text style={styles.texto}>{texto}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 16,
    borderRadius: 30, // bien redondeado, como en tu mockup
    alignItems: "center",
  },
  texto: {
    color: colores.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
