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

> Puedes activar cualquiera con *#comando*`.trim();

  const imagen = 'https://files.catbox.moe/2v7j6r.jpg'; // URL válida
  const thumb = 'https://files.catbox.moe/2v7j6r.jpg'; // puede ser igual
  const packname = 'BrayanOFC';
  const autor = 'Configuración';
  const url = 'https://t.me/BrayanOFC';

  await conn.sendMessage(m.chat, {
    image: { url: imagen },
    caption: texto,
    contextInfo: {
      externalAdReply: {
        title: packname,
        body: autor,
        thumbnailUrl: thumb,
        sourceUrl: url,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  await m.react('⚙️');
};

handler.help = ['config'];
handler.tags = ['grupo'];
handler.command = ['config'];
handler.register = true;
handler.group = true;

export default handler;