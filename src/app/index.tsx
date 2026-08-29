import GradientButton from "@/components/GradientButton";
import { colores } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/services/auth";
import { AntDesign } from "@expo/vector-icons"; // set de íconos que ya viene incluido con Expo
import { useRouter } from "expo-router"; // hook para navegar entre pantallas
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Bienvenida() {
  const router = useRouter();

  // Este listener sigue siendo importante: si el usuario ya tiene
  // sesión activa (por ejemplo, vuelve a abrir la app), lo mandamos
  // directo adentro en vez de mostrarle la bienvenida de nuevo.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          // TODO: acá falta la lógica real de a dónde mandar al usuario
          // (completar perfil si es la primera vez, o directo a la app
          // si ya tiene perfil completo). Por ahora, sin hacer nada
          // visible más que confirmar que la sesión se guardó.
          console.log(
            "Sesión activa:",
            session.user.email ?? session.user.phone,
          );
        }
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>BIENVENIDOS A WORKLY</Text>

      <View style={styles.logoContenedor}>
        <Image
          source={require("@/assets/images/icono-workly-logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.espaciador} />

      <View style={styles.botonesPrincipales}>
        <GradientButton
          texto="INICIAR SESIÓN"
          onPress={() => router.push("/login")}
        />
        <GradientButton
          texto="REGISTRARME"
          onPress={() => router.push("/registro")}
        />
      </View>

      <View style={styles.divisorContenedor}>
        <View style={styles.linea} />
        <Text style={styles.textoDivisor}>o</Text>
        <View style={styles.linea} />
      </View>

      <Pressable style={styles.botonGoogle} onPress={handleGoogleSignIn}>
        <AntDesign name="google" size={18} color="#1A1A1A" />
        <Text style={styles.textoGoogle}>Continuar con Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  logoContenedor: {
    width: 110, // este es el que "reserva" el espacio en el layout — no lo toques
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible", // clave: deja que la imagen se vea aunque sea más grande que el contenedor
  },
  logo: {
    width: 400, // ahora sí, hacé esto todo lo grande que quieras
    height: 400,
    resizeMode: "contain",
    top: 25, // y movelo hacia arriba para que se vea la parte que querés
  },
  titulo: {
    color: colores.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  espaciador: {
    height: 40,
  },
  botonesPrincipales: {
    width: "100%",
    gap: 14,
  },
  divisorContenedor: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: "#33334d",
  },
  textoDivisor: {
    color: "#8888aa",
    fontSize: 13,
  },
  botonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colores.white,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
  },
  textoGoogle: {
    color: "#1A1A1A",
    fontWeight: "600",
    fontSize: 15,
  },
});
