import "dotenv/config";
import { google } from "googleapis";
import open from "open";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Define GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en tu entorno antes de generar el refresh token.");
  }

  const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost");
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    prompt: "consent",
  });

  console.log("Abriendo el navegador para autorizar el acceso a tu Google Drive...\n");
  await open(authUrl, { wait: false });

  const rl = readline.createInterface({ input, output });
  const code = (await rl.question("Pega el código de verificación aquí: ")).trim();
  rl.close();

  if (!code) {
    throw new Error("No se recibió ningún código de verificación.");
  }

  const { tokens } = await oAuth2Client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error("Google no devolvió un refresh token. Asegúrate de usar prompt=consent y access_type=offline.");
  }

  console.log("\nREFRESH_TOKEN obtenido. Guarda este valor de forma segura:\n");
  console.log(tokens.refresh_token);
  console.log("\nAñádelo a tu archivo .env.local como GOOGLE_REFRESH_TOKEN=...\n");
}

main().catch((error) => {
  console.error("Error al generar el refresh token:", error);
  process.exit(1);
});
