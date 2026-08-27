import { colores } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    async function CompletarSesion() {
      if (!url) return;

      const hash = url.split("#")[1];
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }

      router.replace("/");
    }

    CompletarSesion();
  }, [router, url]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colores.white} />
      <Text>Completando inicio de sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colores.background,
    gap: 20,
  },
  text: {
    color: colores.white,
    fontSize: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});
