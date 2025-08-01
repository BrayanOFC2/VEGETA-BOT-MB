import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n\n📌 *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const res = await fetch(searchApi);
    const json = await res.json();

    if (!json?.data || !json.data.length) {
      return m.reply(`⚠️ No se encontraron resultados para *"${text}"*.`);
    }

    const video = json.data[0];

    const texto = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
`.trim();

    const buttons = [
      { buttonId: `${usedPrefix}ytmp3 ${video.url}`, buttonText: { displayText: '🎧 AUDIO' }, type: 1 },
      { buttonId: `${usedPrefix}ytmp4 ${video.url}`, buttonText: { displayText: '🎬 VIDEO' }, type: 1 },
    ];

    const buttonMessage = {
      image: { url: video.image },
      caption: texto,
      footer: 'Selecciona una opción para descargar:',
      buttons: buttons,
      headerType: 4
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    await m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al buscar el video.');
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;