export { createClient } from "@supabase/supabase-js"; //importamos la funcion createClient de supabase, que nos permite crear un cliente de supabase
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store"; // traemos el módulo SecureStore de expo para poder almacenar de manera segura el token de autenticación del usuario
import "react-native-url-polyfill/auto"; //este import es necesario para que supabase funcione correctamente en react native

// El adaptador
/* Tres funciones que funcionan como "traductor", supabase fue
disenado para funcionar en navegadores web, donde existe algo llamado
"localStorage", con el que podemos almacenar y recuperar datos de manera persistente.
Justamente con los metodos "getItem", "setItem" y "removeItem".
 */
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// importamos la variables de entorno que contienen la URL y la llave publica de supabase

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  //si no existen las variables de entorno, lanzamos un error
  throw new Error(
    "Faltan las variables de entorno de Supabase. Revisá tu archivo .env",
  );
}

// exportamos la funcion createClient de supabase y creamos el cliente de supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter, //le pasamos el adaptador que creamos para que supabase pueda almacenar el token de autenticación del usuario de manera segura
    autoRefreshToken: true, //le decimos a supabase que refresque el token de autenticación del usuario de manera automática
    persistSession: true, //le decimos a supabase que persista la sesión del usuario de manera automática
    detectSessionInUrl: false, //le decimos a supabase que no detecte la sesión del usuario en la URL, ya que esto no es necesario en una aplicación móvil
  },
});
