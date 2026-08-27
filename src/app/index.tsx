import { colores } from "@/constants/colors"; //importamos la paleta de colores que definimos para Workly
import { supabase } from "@/lib/supabase"; //importamos el cliente de supabase
import {
  enviarCodigoOTP,
  signInWithGoogle,
  verificarCodigoOTP,
} from "@/services/auth"; //importamos las 3 funciones de autenticación que armamos en auth.ts
import { useEffect, useState } from "react"; //useState para manejar valores que cambian y se muestran en pantalla; useEffect para ejecutar código cuando el componente se monta
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"; //importamos componentes de React Native para armar la UI

export default function Index() {
  const [status, setStatus] = useState("Sin iniciar sesión");

  //Guarda lo que el usuario escribe en el campo del teléfono.
  const [telefono, setTelefono] = useState("");

  //Guarda lo que el usuario escribe en el campo del codigo OTP.
  const [codigo, setCodigo] = useState("");

  // Este booleano decide qué mostrar en pantalla: si es false, mostramos
  // el campo para escribir el teléfono; si es true, mostramos el campo
  // para escribir el código que ya se "envió".
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  // Este useEffect se suscribe a CUALQUIER cambio de sesión en toda la app
  // (login, logout, refresh de token). No importa desde dónde se dispare
  // el cambio -- ya sea esta misma pantalla o la pantalla /auth/callback --
  // este listener se entera solo y actualiza el status automáticamente.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          // Un usuario logueado con Google tiene "email"; uno logueado
          // por teléfono tiene "phone" en vez de "email". Con el
          // operador "??" (nullish coalescing) usamos el que exista:
          // si session.user.email es null/undefined, usamos
          // session.user.phone en su lugar.
          setStatus(`Sesión iniciada: ${session.user.email}`);
        }
      },
    );

    // Función de limpieza: cuando el componente se desmonta, cancelamos
    // la suscripción para evitar fugas de memoria.
    return () => listener.subscription.unsubscribe();
  }, []);

  //se ejecuta cuando el usuario hace click en el botón de login con Google
  async function handleGoogleSignIn() {
    try {
      setStatus("Abriendo Google...");
      await signInWithGoogle();
      // No hacemos nada más acá: el listener de arriba (onAuthStateChange)
      // va a actualizar el status automáticamente en cuanto la sesión
      // quede guardada desde la pantalla /auth/callback.
    } catch (error) {
      setStatus("Error al iniciar sesión");
      console.error("Error al iniciar sesión con Google:", error);
    }
  }

  // Se ejecuta cuando el usuario toca "Enviar código", en el paso 1
  // del login por teléfono.
  async function handleEnviarCodigo() {
    try {
      setStatus("Enviando código...");
      //le pedimos a supabase que envie el codigo OTP al teléfono que el usuario escribió en el campo de texto
      await enviarCodigoOTP(telefono);
      setCodigoEnviado(true); //cambiamos el estado para mostrar el campo de texto del código OTP
      setStatus("Código enviado. Revisa tu teléfono.");
    } catch (error) {
      setStatus("Error al enviar el código");
      console.error("Error al enviar el código OTP:", error);
    }
  }

  // Se ejecuta cuando el usuario toca "Verificar código", en el paso 2
  // del login por teléfono.
  async function handleVerificarCodigo() {
    try {
      setStatus("Verificando código...");
      await verificarCodigoOTP(telefono, codigo); //comparamos el código escrito contra el que supabase espera
      // No hace falta hacer nada más acá tampoco: el listener de arriba
      // (onAuthStateChange) va a actualizar el status automáticamente
      // en cuanto supabase confirme el código y cree la sesión.
    } catch (error) {
      setStatus("Código incorrecto o expirado");
      console.error("Error al verificar código OTP:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icono-workly-logo.png")}
        style={styles.logo}
      />

      <Text style={styles.text}>Bienvenido a Workly.</Text>

      <Pressable style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Probar login con Google</Text>
      </Pressable>
      {/* Una línea horizontal simple para separar visualmente el login
          de Google del login por teléfono */}
      <View style={styles.divider} />

      {/* Operador ternario (condición ? siVerdadero : siFalso): decide
          qué bloque de JSX mostrar según el valor de codigoEnviado.
          Los <> </> son "Fragmentos de React": agrupan varios elementos
          (el TextInput + el Pressable) sin necesitar un <View> extra. */}

      {!codigoEnviado ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+50688755791" //texto de ejemplo que se ve cuando el campo está vacío
            placeholderTextColor="#8888aa" //color de ese texto de ejemplo
            value={telefono} //el campo siempre muestra lo que hay guardado en el estado "telefono"
            onChangeText={setTelefono} //cada vez que el usuario tipea, actualizamos el estado con el texto nuevo
            keyboardType="phone-pad" //le pedimos al sistema operativo un teclado optimizado para números de teléfono
          />
          <Pressable style={styles.button} onPress={handleEnviarCodigo}>
            <Text style={styles.buttonText}>Enviar código</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="#8888aa"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="number-pad" //teclado numérico, apropiado para un código corto
            maxLength={6} //no deja escribir más de 6 caracteres, ya que el código OTP de supabase tiene 6 dígitos
          />
          <Pressable style={styles.button} onPress={handleVerificarCodigo}>
            <Text style={styles.buttonText}>Verificar código</Text>
          </Pressable>
        </>
      )}

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.background,
    gap: 20,
    padding: 10,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    top: -50,
  },
  text: {
    color: colores.white,
    fontSize: 20,
    top: -100,
  },
  divider: {
    width: "110%",
    height: 1,
    backgroundColor: "#33334d",
    top: -30,
  },
  button: {
    backgroundColor: colores.gradientStart,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    top: -90,
  },
  buttonText: {
    color: colores.white,
    fontWeight: "600",
  },
  status: {
    color: colores.white,
    fontSize: 14,
    textAlign: "center",
    top: -25,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#33334d",
    borderRadius: 8,
    padding: 10,
    color: colores.white,
    top: 25,
    fontSize: 16,
  },
});
