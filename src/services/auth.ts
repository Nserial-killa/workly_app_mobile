import * as AuthSession from "expo-auth-session"; //importamos el módulo AuthSession de expo para construir correctamente la URL de redireccion de vuelta a tu app.
import * as WebBrowser from "expo-web-browser"; //importamos el módulo WebBrowser de expo para poder abrir el navegador web del dispositivo y redirigir al usuario a la página de login de supabase.
import { supabase } from "../lib/supabase"; //importamos el cliente de supabase que creamos en el archivo src/lib/supabase.ts

//para que la pantalla no quede congelada.
WebBrowser.maybeCompleteAuthSession(); //esta función es necesaria para que expo pueda manejar correctamente la redirección de vuelta a tu app después de que el usuario se loguee en supabase.

//esta función es la que vamos a llamar cuando el usuario haga click en el botón de login con Google.
export async function signInWithGoogle() {
  const redirectUrl = AuthSession.makeRedirectUri({
    scheme: "worklyapp",
    path: "auth/callback",
  }); //esta función construye la URL de redireccion de vuelta a tu app, que es la que supabase va a usar para redirigir al usuario después de que se loguee.

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google", //le decimos a supabase que queremos loguear al usuario con Google
    options: {
      redirectTo: redirectUrl, //le pasamos la URL de redireccion de vuelta a tu app que construimos con la función makeRedirectUri.
      skipBrowserRedirect: true, //le decimos a supabase que no redirija al usuario a la página de login de supabase, sino que lo redirija a la URL que le pasamos en el parámetro redirectTo.
    },
  });

  if (error) {
    console.log("Error al loguear con Google: ", error.message); //si hay un error, lo mostramos en la consola
    throw new Error(error.message); //lanzamos el error para que pueda ser manejado por el componente que llamó a esta función
  }

  // Abrimos el navegador del dispositivo para que el usuario inicie sesión
  // con Google. Ya NO leemos ni procesamos el resultado acá: la pantalla
  // src/app/auth/callback.tsx es la que se encarga de capturar los tokens
  // y guardar la sesión, usando Linking.useURL(). index.tsx se entera del
  // cambio de sesión automáticamente gracias a onAuthStateChange.
  await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
}

// PASO 1 del login por teléfono: le pedimos a supabase que le mande
// (o, con un "test phone number" configurado, que simule mandar) un
// código de un solo uso (OTP) a este número de teléfono.
export async function enviarCodigoOTP(telefono: string) {
  const { error } = await supabase.auth.signInWithOtp({
    phone: telefono, //el número de teléfono al que se le va a enviar el código, en formato E.164 (ej. "+50688755791")
  });

  if (error) {
    console.log("Error al enviar el código OTP: ", error.message); //si hay un error, lo mostramos en la consola
    throw new Error(error.message); //lanzamos el error para que pueda ser manejado por el componente que llamó a esta función
  }
}

// PASO 2 del login por teléfono: verificamos que el código que el
// usuario escribió coincide con el que supabase espera para ese
// número. Si coincide, supabase crea y guarda la sesión automáticamente
// (usando el ExpoSecureStoreAdapter que configuramos en supabase.ts) --
// a diferencia de Google, acá no necesitamos hacer un setSession manual.
export async function verificarCodigoOTP(telefono: string, codigo: string) {
  const { error } = await supabase.auth.verifyOtp({
    phone: telefono, //el mismo número al que le mandamos el código en el paso anterior
    token: codigo, //el código de 6 dígitos que el usuario escribió en la pantalla
    type: "sms", //le indicamos a supabase que este código llegó (o "llegaría") por SMS, y no por otro medio como email
  });

  if (error) {
    console.log("Error al verificar el código OTP: ", error.message); //si hay un error, lo mostramos en la consola
    throw new Error(error.message); //lanzamos el error para que pueda ser manejado por el componente que llamó a esta función
  }
}
