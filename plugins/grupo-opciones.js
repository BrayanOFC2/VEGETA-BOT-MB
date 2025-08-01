import { readFile } from 'fs/promises';

const handler = async (m, { conn }) => {
  const {
    welcome, autolevelup, antiBot, antiBot2, autoAceptar, autoRechazar,
    autoresponder, modoadmin, reaction, nsfw, detect, antiLink,
    antitoxic, antiTraba, antifake
  } = global.db.data.chats[m.chat];

  const texto = `👑 *CONFIGURACIÓN DE GRUPO* 

◈ Welcome: ${welcome ? 'Activado' : 'Desactivado'}
◈ Autolevelup: ${autolevelup ? 'Activado' : 'Desactivado'} 
◈ Antibot: ${antiBot ? 'Activado' : 'Desactivado'} 
◈ Antisubbots: ${antiBot2 ? 'Activado' : 'Desactivado'}
◈ Autoaceptar: ${autoAceptar ? 'Activado' : 'Desactivado'} 
◈ Autorechazar: ${autoRechazar ? 'Activado' : 'Desactivado'} 
◈ Autoresponder: ${autoresponder ? 'Activado' : 'Desactivado'}
◈ Modoadmin: ${modoadmin ? 'Activado' : 'Desactivado'}
◈ Reaction: ${reaction ? 'Activado' : 'Desactivado'}
◈ Nsfw: ${nsfw ? 'Activado' : 'Desactivado'} 
◈ Detect: ${detect ? 'Activado' : 'Desactivado'} 
◈ Antilink: ${antiLink ? 'Activado' : 'Desactivado'} 
◈ Antitoxic: ${antitoxic ? 'Activado' : 'Desactivado'} 
◈ Antitraba: ${antiTraba ? 'Activado' : 'Desactivado'}
◈ Antifake: ${antifake ? 'Activado' : 'Desactivado'}

Activa con *#comando*`.trim();

  // Cargar y leer el archivo db.json
  const data = JSON.parse(await readFile('./src/database/db.json', 'utf-8'));
  const imagenes = data.vegeta?.imagenes;

  if (!imagenes || imagenes.length === 0) {
    return conn.reply(m.chat, '❌ No hay imágenes en db.json → vegeta.imagenes[]', m);
  }

  const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];

  await conn.sendMessage(m.chat, {
    image: { url: imagen },
    caption: texto
  }, { quoted: m });

  await m.react('⚙️');
};

handler.command = ['config'];
handler.group = true;
handler.register = true;

export default handler;