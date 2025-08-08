import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";

export async function startSubBot(m, conn, caption, isCode, phone, chatId, commandFlags) {
  try {
    await conn.sendMessage(chatId, { text: caption });

    console.log(`[SUBBOT] Iniciando subbot para: ${phone}`);
    commandFlags[phone] = true;

    const { state, saveCreds } = await useMultiFileAuthState(`./session/${phone}`);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: !isCode,
      getMessage: async () => ({})
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) startSubBot(m, conn, caption, isCode, phone, chatId, commandFlags);
      } else if (connection === "open") {
        console.log(`[SUBBOT] Subbot conectado: ${phone}`);
      }
    });

  } catch (e) {
    console.error(`[SUBBOT ERROR] ${e}`);
    await conn.sendMessage(chatId, { text: "❌ Error al intentar iniciar el sub bot." });
  }
}