import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n\n📌 *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para *"${text}"*.`);
    }

    const video = searchData.data[0];
    const videoInfo = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: videoInfo,
      footer: 'Selecciona una opción:',
      buttons: [
        { buttonId: `${usedPrefix}ytmp3 ${video.url}`, buttonText: { displayText: '🎵 Audio (MP3)' }, type: 1 },
        { buttonId: `${usedPrefix}ytmp4 ${video.url}`, buttonText: { displayText: '🎬 Video (MP4)' }, type: 1 },
      ]
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;