import fetch from 'node-fetch';
import { readFile } from 'fs/promises';

let handler = async (m, { conn, usedPrefix, command }) => {
  const data = JSON.parse(await readFile('./src/database/db.json', 'utf-8'));
  const imagenes = data.vegeta?.imagenes;
  const miniurl = imagenes?.length
    ? imagenes[Math.floor(Math.random() * imagenes.length)]
    : 'https://i.imgur.com/XTzfa1T.jpg';

  let grupos = `*Hola!, te invito a unirte a los grupos oficiales del Bot para convivir con la comunidad.....*

- ${namegrupo}
*❀* ${gp1}

- ${namecomu}
*❀* ${comunidad1}

*ׄ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ*

⚘ Enlace anulado? entre aquí! 

- ${namechannel}
*❀* ${channel}

- ✧┊┋◟𝐕𝐞𝐠𝐞𝐭𝐚 𝐁𝐨𝐭 𝐓𝐞𝐬𝐭◞┊┋✧
*❀* ${channel2}

> ${dev}`;

  await conn.sendFile(m.chat, miniurl, "vegeta.jpg", grupos, m, null, rcanal);

  await m.react(emojis);
};

handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'links', 'groups'];

export default handler;