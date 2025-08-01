const handler = async (m, { conn }) => {
  const {
    welcome, autolevelup, antiBot, antiBot2, autoAceptar, autoRechazar,
    autoresponder, modoadmin, reaction, nsfw, detect, antiLink,
    antitoxic, antiTraba, antifake
  } = global.db.data.chats[m.chat];

  const texto = `👑 *ℂ𝕆ℕ𝔽𝕀𝔾𝕌ℝ𝔸ℂ𝕀𝕆ℕ 𝔻𝔼 𝔾ℝ𝕌ℙ𝕆* 
  
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

> Nota: Puedes activar una de estas opciones con el comando: *#antilink*`.trim();

  const imagen = 'https://qu.ax/gfLKQ.jpg';
  const emoji = '🧃';
  const packname = 'BOT DE GRUPO';
  const dev = 'BrayanOFC';
  const redes = 'https://t.me/BrayanOFC';
  const icono = 'https://qu.ax/UOvit.jpg';

  await conn.sendMessage(m.chat, {
    image: { url: imagen },
    caption: texto,
    contextInfo: {
      forwardingScore: 200,
      isForwarded: false,
      externalAdReply: {
        showAdAttribution: true,
        title: packname,
        body: dev,
        mediaType: 1,
        sourceUrl: redes,
        thumbnailUrl: icono,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m });

  await m.react(emoji);
};

handler.help = ['configuraciongrupo'];
handler.tags = ['grupo'];
handler.command = ['on', 'off', 'config'];
handler.register = true;
handler.group = true;

export default handler;