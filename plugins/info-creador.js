async function handler(m, { conn }) {
  m.react('👑');

  const name = 'BrᴀʏᴀɴOFC👻';
  const empresa = 'BrayanOFC - Servicios Tecnológicos';
  const link = 'https://wa.me/5216641784469';

  await conn.sendMessage(m.chat, {
    image: { url: 'https://qu.ax/gSWtg.jpg' },
    caption: `👑 *${name}*\n👻 - CEO & Fundador de\n*${empresa}*\n\n📲 ➡️ ${link}`,
  }, { quoted: m });
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;