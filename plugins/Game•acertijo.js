import fs from 'fs';

const timeout = 60000;
const poin = 10000;

// Handler para iniciar acertijo
const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay acertijos sin responder en este chat', conn.tekateki[id][0]);
    throw false;
  }

  const tekateki = JSON.parse(fs.readFileSync('./src/game/acertijo.json'));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  const clue = json.response.replace(/[A-Za-z]/g, '_');

  const caption = `
ⷮ🚩 *ACERTIJOS*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(0)} Segundos
🎁 *Premio:* +${poin} monedas 🪙
`.trim();

  // Guardamos el acertijo en memoria para este chat
  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m), // mensaje enviado
    json.response.toLowerCase(),          // respuesta correcta
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `🚩 Se acabó el tiempo!\n*Respuesta:* ${json.response}`, conn.tekateki[id][0]);
        delete conn.tekateki[id];
      }
    }, timeout)
  ];
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;

// Handler para capturar respuestas
export const tekatekiHandler = async (m, { conn }) => {
  const id = m.chat;
  if (!conn.tekateki?.[id]) return;

  const respuestaCorrecta = conn.tekateki[id][1];
  if (m.text.toLowerCase().includes(respuestaCorrecta)) {
    await conn.reply(m.chat, `🎉 ¡Correcto! Has ganado +${conn.tekateki[id][2]} monedas 🪙`, conn.tekateki[id][0]);
    clearTimeout(conn.tekateki[id][3]);
    delete conn.tekateki[id];
  }
};

tekatekiHandler.all = true;