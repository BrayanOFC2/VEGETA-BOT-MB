import fs from 'fs';

const timeout = 60000; // 60 segundos
const poin = 10000;   // Recompensa

const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay acertijos sin responder en este chat', conn.tekateki[id][0]);
    throw false;
  }

  // Cargar preguntas desde JSON
  const tekateki = JSON.parse(fs.readFileSync('./src/game/acertijo.json'));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  // Crear pista oculta con _
  const _clue = json.response;
  const clue = _clue.replace(/[A-Za-z]/g, '_');

  const caption = `
ⷮ🚩 *ACERTIJOS*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(0)} Segundos
🎁 *Premio:* +${poin} monedas 🪙
`.trim();

  // Guardar el acertijo en memoria
  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m), 
    json,
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