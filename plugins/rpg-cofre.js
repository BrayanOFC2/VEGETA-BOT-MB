import { readFile } from 'fs/promises';

const handler = async (m, { isPrems, conn }) => {
  if (!global.db.data.users[m.sender]) {
    throw `❌ Usuario no registrado.`;
  }

  const lastCofreTime = global.db.data.users[m.sender].lastcofre || 0;
  const timeToNextCofre = lastCofreTime + 86400000;

  if (Date.now() < timeToNextCofre) {
    const tiempoRestante = timeToNextCofre - Date.now();
    const mensajeEspera = `⏳ Ya has reclamado tu cofre hoy.\nVuelve en *${msToTime(tiempoRestante)}* para reclamar otro.`;
    await conn.sendMessage(m.chat, { text: mensajeEspera }, { quoted: m });
    return;
  }

  const data = JSON.parse(await readFile('./src/database/db.json', 'utf-8'));
  const imagenes = data.vegeta?.imagenes;
  const img = imagenes && imagenes.length
    ? imagenes[Math.floor(Math.random() * imagenes.length)]
    : 'https://qu.ax/rZZfy.jpg';

  const dia = Math.floor(Math.random() * 100);
  const tok = Math.floor(Math.random() * 10);
  const ai = Math.floor(Math.random() * 40);
  const expp = Math.floor(Math.random() * 5000);

  global.db.data.users[m.sender].coin += dia;
  global.db.data.users[m.sender].diamonds += ai;
  global.db.data.users[m.sender].joincount += tok;
  global.db.data.users[m.sender].exp += expp;
  global.db.data.users[m.sender].lastcofre = Date.now();

  const texto = `
🎁 *¡Has abierto un Cofre Sorpresa!*

🏆 Recursos obtenidos:

💰 *${dia} ${moneda}*
🎟️ *${tok} Tokens*
💎 *${ai} Diamantes*
✨ *${expp} Experiencia*

¡Sigue jugando para conseguir más recompensas!
`;

  try {
    await conn.sendFile(m.chat, img, 'Vegeta.jpg', texto, m);
  } catch {
    throw `⚠️ Error al enviar el cofre.`;
  }
};

handler.help = ['cofre'];
handler.tags = ['rpg'];
handler.command = ['cofre'];
handler.level = 5;
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  let hours = Math.floor(duration / 3600000);
  let minutes = Math.floor((duration % 3600000) / 60000);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours} Horas ${minutes} Minutos`;
}